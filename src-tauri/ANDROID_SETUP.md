# Android — one-time setup (Windows dev machine)

Do this once before any Android build is possible. `tools/release.js`
refuses the Android target until step 6 has produced
`src-tauri/gen/android/app`.

**Nothing below has been verified from the Cowork sandbox** — it has no
Android SDK, no JDK, no Rust toolchain (`CLAUDE.md` §4). The first real
test is on this machine. If `tauri android init` or the first build hits a
snag, it gets its own follow-up pass, the same way the desktop Tauri
scaffold needed two local rounds (`HISTORY.md` 0.2.11-0.2.16).

## 1. Android Studio

Install Android Studio (https://developer.android.com/studio). It bundles
the SDK Manager used in step 2 and a JDK that can serve for step 3.

## 2. SDK components

Android Studio → Settings → Languages & Frameworks → Android SDK:

- **SDK Platforms** tab: at least one Android SDK Platform (the current
  stable API level is fine).
- **SDK Tools** tab (tick "Show Package Details"): the matching
  **Android SDK Build-Tools**, **Android SDK Platform-Tools**,
  **Android SDK Command-line Tools**, and **NDK (Side by side)**. Note the
  NDK version number — its path is needed in step 4.

## 3. JDK

JDK 17 or newer. Either use the one Android Studio ships
(`C:\Program Files\Android\Android Studio\jbr`) or install a standalone
one (Adoptium Temurin 17+).

## 4. Environment variables

System (or user) environment variables — Settings → System → About →
Advanced system settings → Environment Variables. Adjust paths to the
actual install locations:

| Variable       | Typical value                                                        |
|----------------|----------------------------------------------------------------------|
| `JAVA_HOME`    | `C:\Program Files\Android\Android Studio\jbr`                        |
| `ANDROID_HOME` | `C:\Users\<you>\AppData\Local\Android\Sdk`                           |
| `NDK_HOME`     | `C:\Users\<you>\AppData\Local\Android\Sdk\ndk\<version from step 2>` |

(`ANDROID_SDK_ROOT` is the older name for `ANDROID_HOME`; setting both to
the same path is harmless.) Also append to `Path`:
`%ANDROID_HOME%\platform-tools` (for `adb`). Open a **new** terminal
afterwards — existing ones won't see the change.

## 5. Rust Android targets

The desktop build only needed the host target. Android needs the four
Android ones:

```
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## 6. Initialize the Android project

From the VKDex project root (the folder with the root `package.json`):

```
npx tauri android init
```

Generates `src-tauri/gen/android/` (gitignored — regenerable build
scaffolding, not source). This is the directory `tools/release.js` checks
for. Re-run it only if that folder is deleted.

## 7. Build

```
npm run build:android        # = tauri android build --debug
node tools/release.js        # menu: 1 (Android) / 2 (Windows) / 3 (Both)
```

The debug build is signed with Gradle's auto-generated debug keystore
(`%USERPROFILE%\.android\debug.keystore`) — installable on a phone via
"Install unknown apps" for the browser/file manager used to open it, not
publishable to the Play Store. A release keystore is a separate future
decision (`TODO.md`); every later update of an installed app must be signed
with the same key, so it isn't something to generate casually.

Assumption to confirm on the first real run: `--debug` is the Tauri 2 CLI
flag for a debug build (it is in the CLI reference as of Tauri 2.x; `--apk`
can be added to skip the AAB Gradle also produces by default). The APK is
expected under `src-tauri/gen/android/app/build/outputs/apk/universal/
debug/` — `release.js` searches that whole `apk/` tree rather than
hardcoding the leaf, and lists what it found if no `.apk` turns up.
