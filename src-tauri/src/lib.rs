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
// Skipped entirely under the `desktop-ui` Cargo feature (Cargo.toml): that
// build ships src-desktop/, a real resizable three-pane desktop UI, for which
// a phone aspect ratio is exactly wrong. Default builds are unaffected.
#[cfg(all(target_os = "windows", not(feature = "desktop-ui")))]
mod resize_lock;

/// First-paint DPI fix for the desktop-ui build — Windows only.
///
/// WebView2 sometimes composites its very first frame at the wrong scale
/// factor for the monitor it opened on, so the whole page (SVG map art and
/// ordinary text alike) renders blurry until something forces a recompute.
/// Any real OS resize does force it, which is why dragging a window edge
/// visibly sharpens everything — so we fake one: grow the window by a single
/// physical pixel and put it straight back, before the user sees anything.
/// Not needed on default builds, whose window is a fixed phone frame.
#[cfg(all(target_os = "windows", feature = "desktop-ui"))]
fn nudge_dpi_repaint(app: &tauri::AppHandle) {
    use tauri::Manager;
    let Some(window) = app.get_webview_window("main") else {
        eprintln!("VKDex dpi nudge: no 'main' window");
        return;
    };
    if let Ok(size) = window.inner_size() {
        let _ = window.set_size(tauri::PhysicalSize::new(size.width + 1, size.height));
        let _ = window.set_size(size);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(all(target_os = "windows", not(feature = "desktop-ui")))]
            resize_lock::install(_app.handle());
            #[cfg(all(target_os = "windows", feature = "desktop-ui"))]
            nudge_dpi_repaint(_app.handle());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running VKDex");
}
