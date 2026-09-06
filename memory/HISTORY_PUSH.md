<!-- Compact release-note entry for the version about to be tagged.
     Rewritten (not appended) each version bump, alongside the HISTORY.md
     entry — see CLAUDE.md §6d. Read literally by tools/release.js as the
     GitHub Release notes body, so keep it release-note quality: what
     shipped and why it matters, not internal verification/handoff detail. -->

## 0.3.5 → 0.3.8

VKDex's data now comes from a richer, merged data source, and it shows most
in Found In: Scarlet/Violet, Brilliant Diamond/Shining Pearl, and Legends:
Arceus wild encounters are real for the first time — 768 Pokémon gained
wild-encounter data the app never had, including most of Paldea, which
previously just said its data was missing.

Scarlet/Violet's DLC areas (The Teal Mask's Kitakami, The Indigo Disk's
Blueberry Academy) are correctly labelled as DLC rather than lumped in with
the base game. A handful of other values were corrected using the richer
source: base experience now reflects the current generation instead of an
older one, and a few capture rates, hatch counts, and other details were
fixed against more accurate data. Move names also gained their Japanese
romanization.
