# lived4w

A lightweight music production studio: step sequencer, piano roll, mixer and song mode. All sounds are synthesized with Web Audio — no samples or plugins needed. Ships as a single Linux **AppImage**.

## Features

- **Channel rack** — 16-step sequencer for Kick, Snare, Clap, Hat, Bass and Lead
- **Piano roll** — Lead notes (C3–C5, 16 steps); click to add/remove, drag to lengthen
- **Mixer** — volume and pan per channel, master volume, level meter
- **Patterns & song mode** — 4 patterns, 8-slot playlist
- **Transport** — play/stop, BPM 40–300, light/dark theme
- **Projects** — save and open `.l4w.json` files (validated on load)

## Usage

```bash
chmod +x lived4w-1.0.0-x86_64.AppImage
./lived4w-1.0.0-x86_64.AppImage
```

| Key | Action |
|---|---|
| `Space` | Play / stop |
| `Ctrl+S` | Save project |
| `Ctrl+O` | Open project |

Click a channel name to mute it. Double-click a pan slider to center it.

## Build

Requires Node.js 18+.

```bash
npm install
npm start       # run in development
npm run dist    # build dist/lived4w-1.0.0-x86_64.AppImage
```

The whole app is `docs/index.html`; the same file also runs in a browser.

## Dependencies

lived4w is an x86_64 AppImage built on Electron 33. It needs a glibc-based distro (glibc 2.28+, check with `ldd --version`), X11 or Wayland, and a sound server (PipeWire, PulseAudio or ALSA). Everything else is bundled; install the system libraries below if the app fails to start.

| Distro | Install command |
|---|---|
| **Ubuntu 22.04, Debian 12, Mint** | `sudo apt install libfuse2 libgtk-3-0 libnss3 libasound2 libgbm1 libxss1 libxtst6 libatspi2.0-0 libxkbcommon0` |
| **Ubuntu 24.04+** | `sudo apt install libfuse2t64 libgtk-3-0t64 libnss3 libasound2t64 libgbm1 libxss1 libxtst6 libatspi2.0-0t64 libxkbcommon0` |
| **Fedora, RHEL / Alma / Rocky** | `sudo dnf install fuse-libs gtk3 nss alsa-lib mesa-libgbm libXScrnSaver libXtst at-spi2-core libxkbcommon` |
| **Arch, Manjaro, EndeavourOS** | `sudo pacman -S fuse2 gtk3 nss alsa-lib mesa libxss libxtst at-spi2-core libxkbcommon` |
| **openSUSE** | `sudo zypper install libfuse2 libgtk-3-0 mozilla-nss libasound2 libgbm1 libXss1 libXtst6 at-spi2-core libxkbcommon0` |
| **NixOS** | `nix-shell -p appimage-run --run "appimage-run lived4w-1.0.0-x86_64.AppImage"` |

Notes:

- Package names can differ slightly between releases; if one is not found, search for it with your package manager.
- **No FUSE?** Skip `libfuse2` and run `./lived4w-*.AppImage --appimage-extract-and-run`.
- **Alpine and other musl distros** are not supported (the AppImage needs glibc).
- **Audio:** on PipeWire systems make sure `pipewire-pulse` is installed (`pipewire-pulseaudio` on Fedora/Arch).
- ARM (aarch64) is not built.

## Troubleshooting

- **No sound:** check that PipeWire/PulseAudio is running and the channel isn't muted.

## Not included

Sample loading, VST/plugins, automation, WAV export, undo, MIDI input.

## License

GNU General Public License v3.0 only (`GPL-3.0-only`). See [LICENSE](LICENSE).
