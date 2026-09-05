// Shared app entry for every target. Desktop binaries reach it through
// main.rs; Tauri's generated Android/iOS projects (src-tauri/gen/, from
// `tauri android init`) link this crate as a library and call it through
// the `mobile_entry_point` attribute below — so all real setup lives here,
// never in main.rs.

// Electron's wrapper had to explicitly null the application menu
// (Menu.setApplicationMenu(null), electron-app/main.js) because Electron
// installs a default one with live accelerators (Ctrl+R reloaded and threw
// away every in-memory state). Tauri only auto-creates a default menu on
// macOS, so on Windows there is nothing to remove here.

// Live 360:800 aspect lock via WM_SIZING — Windows only, see the module doc.
#[cfg(target_os = "windows")]
mod resize_lock;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "windows")]
            resize_lock::install(_app.handle());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running VKDex");
}
