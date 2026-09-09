// VKDex release GUI — a thin window over `node tools/release.js`.
//
// It deliberately reimplements NOTHING of release.js: no version checks, no
// git/tag logic, no changelog parsing, no build invocation. It assembles the
// same flags the terminal menu would have produced, spawns the script, relays
// its output, and relays its one mandatory `Proceed? [y/N]` question back as
// two buttons. release.js stays the single source of truth.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{ChildStdin, Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

/// The VKDex repo root, resolved from the compile-time manifest path
/// (`release-gui/src-tauri`) rather than the process CWD, which depends on
/// where `tauri dev` happened to be launched from.
fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent() // release-gui/
        .and_then(Path::parent) // repo root
        .expect("CARGO_MANIFEST_DIR has no grandparent — release-gui moved?")
        .to_path_buf()
}

/// The live run's stdin, or None when nothing is running. Doubles as the
/// "is a run in progress" flag, so there is only one thing to keep in sync.
#[derive(Default)]
struct Running(Mutex<Option<ChildStdin>>);

/// Relay one of the child's pipes to the frontend.
///
/// Reads raw chunks, NOT lines: release.js writes its `Proceed with build...?
/// [y/N] ` prompt with no trailing newline, so a line-buffered reader would
/// hold back the single piece of output the GUI actually has to react to
/// until after it had already been answered.
fn pump<R: Read + Send + 'static>(app: AppHandle, mut pipe: R, event: &'static str) {
    std::thread::spawn(move || {
        let mut buf = [0u8; 4096];
        loop {
            match pipe.read(&mut buf) {
                Ok(0) | Err(_) => break,
                // ponytail: from_utf8_lossy per chunk, so a multi-byte char
                // straddling a 4096-byte boundary renders as U+FFFD. The only
                // non-ASCII in release.js's output is the changelog heading's
                // arrow; buffer the trailing partial char if that ever shows.
                Ok(n) => {
                    let _ = app.emit(event, String::from_utf8_lossy(&buf[..n]).to_string());
                }
            }
        }
    });
}

/// Spawn `node tools/release.js <args>` in the repo root. `args` is assembled
/// by the frontend from the same target/frontend pairs release.js's own menu
/// uses, so the interactive menu never appears and the only prompt left to
/// answer is the confirmation.
#[tauri::command]
fn start(app: AppHandle, state: State<Running>, args: Vec<String>) -> Result<(), String> {
    let mut slot = state.0.lock().map_err(|e| e.to_string())?;
    if slot.is_some() {
        return Err("a release run is already in progress".into());
    }

    let mut child = Command::new("node")
        .arg("tools/release.js")
        .args(&args)
        .current_dir(repo_root())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("could not start node: {e}"))?;

    *slot = child.stdin.take();
    if let Some(out) = child.stdout.take() {
        pump(app.clone(), out, "release-log");
    }
    if let Some(err) = child.stderr.take() {
        pump(app.clone(), err, "release-err");
    }

    std::thread::spawn(move || {
        let code = child.wait().ok().and_then(|s| s.code()).unwrap_or(-1);
        // Drop stdin first: the pipe closing is what tells any still-blocked
        // reader on the other side that no answer is coming.
        if let Ok(mut slot) = app.state::<Running>().0.lock() {
            slot.take();
        }
        let _ = app.emit("release-done", code);
    });

    Ok(())
}

/// Answer release.js's prompt. The frontend sends "y\n" or "n\n" — exactly
/// what the terminal user would have typed.
#[tauri::command]
fn answer(state: State<Running>, text: String) -> Result<(), String> {
    let mut slot = state.0.lock().map_err(|e| e.to_string())?;
    let stdin = slot.as_mut().ok_or("no release run is in progress")?;
    stdin.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    stdin.flush().map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(Running::default())
        .invoke_handler(tauri::generate_handler![start, answer])
        .run(tauri::generate_context!())
        .expect("error while running the VKDex release GUI");
}
