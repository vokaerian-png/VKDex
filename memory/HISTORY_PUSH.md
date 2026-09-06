<!-- Compact release-note entry for the version about to be tagged.
     Rewritten (not appended) each version bump, alongside the HISTORY.md
     entry — see CLAUDE.md §6d. Read literally by tools/release.js as the
     GitHub Release notes body, so keep it release-note quality: what
     shipped and why it matters, not internal verification/handoff detail. -->

## 0.3.8 → 0.3.15

The app has a livelier look throughout: a new warm yellow accent
highlights selected moves and alt-forme options (blue is still used for
the menu and search), the Pokédex panel and the National Dex header both
have a subtle molded-plastic texture with a small lens-and-LED hardware
detail on the header, each side menu button has its own accent color, and
the Pokémon detail screen now glows faintly in the viewed Pokémon's type
color. Pokédex grid entries have a soft raised/recessed "molded key" look
behind each sprite for more depth without extra color noise.

Also fixed: the "extremely effective" (×4) weakness pill's colored outline
now correctly follows the pill's rounded shape instead of showing as a
square box around it.

The side menu has been redesigned: every button now shows its name next to
its icon, the buttons are grouped into Browse and Reference, and Settings
sits at the bottom. On first launch after this update, a short walkthrough
opens the menu and explains each button in turn (tap Next or Skip; it only
shows once). The redundant Search button was removed (use the magnifying
glass on the Pokédex screen, or press "/"). The side-menu handle is now
easier to tap and can also be dragged open, and the Pokédex/Favorites grid
can be scrolled by clicking and dragging it directly, not just the scrollbar.

Two new reference screens: **Type Chart** — the full 18×18 type
effectiveness grid, color-coded (super effective / not very effective / no
effect), sized to fit the screen with no sideways scrolling — and
**Natures** — all 25 natures with the stat each one raises and lowers.

Also since 0.3.8: the Found In section now lists every region a Pokémon
can be caught in, not just its home region — 7 mainline regions gained
wild-encounter data for species that originate elsewhere (0.3.10). The
Evolution Line follows the selected regional forme (Alolan Vulpix → Alolan
Ninetales, Galarian Farfetch'd → Sirfetch'd), duplicate Sinnoh area names
are merged into one row, DLC-only Paldea locations are badged "DLC", and
Scarlet/Violet, BDSP and Legends: Arceus encounter details (tera raid
stars, alpha levels, weather, time of day, ...) are now shown in full
(0.3.9).
