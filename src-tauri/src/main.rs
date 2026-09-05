// No extra console window alongside the app window in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Desktop-only shim. Everything real is in lib.rs (`vkdex_lib::run`), which
// the mobile builds link directly without ever compiling this file.
fn main() {
    vkdex_lib::run();
}
