//! Live 360:800 aspect-ratio lock for the main window — Windows only.
//!
//! Electron did this natively (`win.setAspectRatio`, electron-app/main.js).
//! Tauri has no equivalent (tauri-apps/tauri #5332, open since 2022), and
//! its JS `setSize()` can only correct *after* a drag settles (src/app.js's
//! `lockAspect`, kept as a safety net). This module subclasses the real
//! Win32 window procedure and rewrites the proposed rect in `WM_SIZING`
//! before Windows applies it — the same mechanism native apps use, so the
//! window feels continuously constrained while the border is dragged.
//!
//! Chrome (title bar/border) size is re-measured on every message, so DPI
//! and monitor changes need no special handling. Windows proposes each
//! step from the cursor's absolute position, *not* from the rect we handed
//! back last time (0.2.15 local test: corner drags flip-flopped between
//! axes when the rule compared the proposal against the live client size),
//! so the corner rule is a pure function of the proposal — the smallest
//! 360:800 client rect that contains it, which keeps the cursor on one of
//! the two moving edges. No per-drag state, nothing to reset.

use raw_window_handle::{HasWindowHandle, RawWindowHandle};
use tauri::{AppHandle, Manager};
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, RECT, WPARAM};
use windows::Win32::UI::Shell::{DefSubclassProc, SetWindowSubclass};
use windows::Win32::UI::WindowsAndMessaging::{
    GetClientRect, GetWindowRect, WMSZ_BOTTOM, WMSZ_BOTTOMLEFT, WMSZ_LEFT, WMSZ_RIGHT, WMSZ_TOP,
    WMSZ_TOPLEFT, WMSZ_TOPRIGHT, WM_SIZING,
};

// Mirrors PHONE_BASE_WIDTH/PHONE_BASE_HEIGHT in src/app.js and the
// minWidth/minHeight in tauri.conf.json.
const BASE_W: i32 = 360;
const BASE_H: i32 = 800;
const ASPECT: f64 = BASE_W as f64 / BASE_H as f64;
const SUBCLASS_ID: usize = 1;

/// Subclass the "main" window. Logs and returns on any failure — the JS
/// fallback in app.js still applies, so a miss here degrades, not breaks.
pub fn install(app: &AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        eprintln!("VKDex resize lock: no 'main' window");
        return;
    };
    let hwnd = match window.window_handle().map(|h| h.as_raw()) {
        Ok(RawWindowHandle::Win32(h)) => HWND(h.hwnd.get() as *mut core::ffi::c_void),
        other => {
            eprintln!("VKDex resize lock: unexpected window handle: {other:?}");
            return;
        }
    };
    // SAFETY: hwnd is the live main window; `subclass_proc` is a plain fn
    // with no captured state, valid for the whole process lifetime.
    let ok = unsafe { SetWindowSubclass(hwnd, Some(subclass_proc), SUBCLASS_ID, 0) };
    eprintln!("VKDex resize lock: SetWindowSubclass -> {ok:?}");
}

unsafe extern "system" fn subclass_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
    _subclass_id: usize,
    _ref_data: usize,
) -> LRESULT {
    if msg == WM_SIZING {
        let (mut outer, mut client) = (RECT::default(), RECT::default());
        // SAFETY: plain Win32 queries on a live window into local out-params;
        // for WM_SIZING, lParam is documented to point at a mutable RECT.
        let queried = unsafe {
            GetWindowRect(hwnd, &mut outer).is_ok() && GetClientRect(hwnd, &mut client).is_ok()
        };
        if queried {
            let chrome = (
                outer.right - outer.left - client.right,
                outer.bottom - outer.top - client.bottom,
            );
            let rect = unsafe { &mut *(lparam.0 as *mut RECT) };
            fit_rect(wparam.0 as u32, chrome, rect);
            return LRESULT(1); // TRUE: we changed the rect
        }
    }
    unsafe { DefSubclassProc(hwnd, msg, wparam, lparam) }
}

/// Rewrite the proposed outer `rect` so the *client* area is 360:800, at
/// least 360x800, moving only the dragged edge(s). Pure — no Win32 calls.
fn fit_rect(edge: u32, chrome: (i32, i32), rect: &mut RECT) {
    let prop_w = rect.right - rect.left - chrome.0;
    let prop_h = rect.bottom - rect.top - chrome.1;

    let by_height = match edge {
        WMSZ_TOP | WMSZ_BOTTOM => true,
        WMSZ_LEFT | WMSZ_RIGHT => false,
        // Corners: proposal taller than 360:800 -> height drives (width grows
        // to match), else width drives. Depends on the proposal alone, so
        // successive cursor positions can't flip the axis back and forth.
        _ => prop_h as f64 * ASPECT > prop_w as f64,
    };
    let (w, h) = if by_height {
        let h = prop_h.max(BASE_H);
        ((h as f64 * ASPECT).round() as i32, h)
    } else {
        let w = prop_w.max(BASE_W);
        (w, (w as f64 / ASPECT).round() as i32)
    };
    let (w, h) = (w.max(BASE_W) + chrome.0, h.max(BASE_H) + chrome.1);

    match edge {
        WMSZ_LEFT | WMSZ_TOPLEFT | WMSZ_BOTTOMLEFT => rect.left = rect.right - w,
        _ => rect.right = rect.left + w,
    }
    match edge {
        WMSZ_TOP | WMSZ_TOPLEFT | WMSZ_TOPRIGHT => rect.top = rect.bottom - h,
        _ => rect.bottom = rect.top + h,
    }
}

// `cd src-tauri && cargo test` (Windows) — the one check that fails if the
// fit logic breaks. Chrome (16, 39) is a typical Win11 non-client size.
#[cfg(test)]
mod tests {
    use super::*;
    use windows::Win32::UI::WindowsAndMessaging::WMSZ_BOTTOMRIGHT;

    fn rect(l: i32, t: i32, r: i32, b: i32) -> RECT {
        RECT { left: l, top: t, right: r, bottom: b }
    }
    fn client(r: &RECT) -> (i32, i32) {
        (r.right - r.left - 16, r.bottom - r.top - 39)
    }

    #[test]
    fn right_edge_drives_height_and_keeps_left() {
        let mut r = rect(100, 100, 100 + 16 + 720, 100 + 39 + 800);
        fit_rect(WMSZ_RIGHT, (16, 39), &mut r);
        assert_eq!((r.left, r.top), (100, 100));
        assert_eq!(client(&r), (720, 1600));
    }

    #[test]
    fn top_edge_drives_width_and_keeps_bottom() {
        let mut r = rect(100, 100 - 200, 100 + 16 + 360, 100 + 39 + 800);
        fit_rect(WMSZ_TOP, (16, 39), &mut r);
        assert_eq!(r.bottom, 100 + 39 + 800);
        assert_eq!(client(&r), (450, 1000));
    }

    #[test]
    fn corner_contains_proposal_and_floors_at_base() {
        let mut r = rect(0, 0, 16 + 400, 39 + 810); // wider than 360:800
        fit_rect(WMSZ_BOTTOMRIGHT, (16, 39), &mut r);
        assert_eq!(client(&r), (400, 889));
        let mut r = rect(0, 0, 16 + 380, 39 + 900); // taller than 360:800
        fit_rect(WMSZ_TOPRIGHT, (16, 39), &mut r);
        assert_eq!(client(&r), (405, 900));
        assert_eq!((r.left, r.bottom), (0, 39 + 900)); // anchored edges untouched
        let mut r = rect(0, 0, 16 + 300, 39 + 700); // below the floor
        fit_rect(WMSZ_BOTTOMLEFT, (16, 39), &mut r);
        assert_eq!(client(&r), (360, 800));
        assert_eq!((r.right, r.top), (16 + 300, 0));
    }

    // The 0.2.15 corner jitter: two successive cursor positions in one
    // bottom-right drag. The old rule compared step 2 against the live
    // client size (400x889 after step 1), saw |812-889| > |402-400|, and
    // flipped to height-driven 365x812; step 3 flipped back, every step.
    #[test]
    fn corner_axis_is_stable_across_cursor_steps() {
        let mut r = rect(0, 0, 16 + 400, 39 + 810);
        fit_rect(WMSZ_BOTTOMRIGHT, (16, 39), &mut r);
        assert_eq!(client(&r), (400, 889));
        let mut r = rect(0, 0, 16 + 402, 39 + 812);
        fit_rect(WMSZ_BOTTOMRIGHT, (16, 39), &mut r);
        assert_eq!(client(&r), (402, 893));
    }
}
