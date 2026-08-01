# Minesweeper

A polished, from-scratch Minesweeper built with React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion — styled after the soft, rounded Material 3 look of Google Play Games' Minesweeper. No backend, no external assets: sound effects are synthesized on the fly with the Web Audio API.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Features

- **Three difficulties** (Easy 10×10/20 mines, Medium 15×15/45 mines, Hard 20×20/80 mines — all a fixed 20% mine density) plus a **custom board** builder with row/column/mine sliders.
- **Safe, fair first click** — the board is generated *after* your first click, mines are kept out of the clicked cell and (where the board allows) its neighbors, and a flood fill opens up a real pocket of space rather than a single lonely number.
- **Classic rules**: left click reveals, right click (or long-press on touch) flags, flagged cells can't be revealed, flood fill opens connected zero-value regions, and clicking a satisfied number "chords" open its remaining hidden neighbors.
- **Timer & mine counter** in the top bar; timer starts on first click and freezes on win/loss.
- **Undo (one move)** — including undoing the click that just lost you the game — and a limited-use **Hint** button.
- **Autosave** — an unfinished game is restored automatically if you refresh or close the tab.
- **Stats modal** — games played, win rate, current/best streak, and best time per difficulty, all in `localStorage`.
- **Dark mode**, keyboard navigation (arrow keys to move, `F` to flag, Enter/Space to reveal), visible focus rings, and screen-reader labels on every cell.
- **Framer Motion throughout**: staggered flood-fill reveals that ripple outward from your click, a spring-loaded flag plant, a shake + particle burst on the mine that got you, and a confetti celebration on a win.
- Sounds are optional and mutable; toggle them from the top bar.

## Project structure

```
src/
  types/            Shared TypeScript types (Board, Cell, GameState, ...)
  constants/         Difficulty presets, storage keys, number colors
  utils/             Pure game logic: board generation, flood fill, chording, win checks
  hooks/
    useMinesweeper   Core game reducer (the only place game rules live)
    useTimer         Self-contained ticking timer (isolated so it doesn't re-render the board)
    useSound         WebAudio-synthesized sound effects
    useStats         localStorage-backed statistics
    useDarkMode      Theme toggle
    useLocalStorage  Small generic localStorage hook
  components/
    Board/           Board grid, Cell, mine/flag icons, explosion particles
    TopBar/          Difficulty selector, timer/mine chips, controls
    Overlays/        Win/lose banners, confetti
    Modals/          Generic modal shell, stats modal, custom board modal
    UI/              Small shared button primitives
    layout/          Loading screen
  App.tsx            Wires everything together
```

Game logic (`utils/boardUtils.ts`, `hooks/useMinesweeper.ts`) is fully decoupled from rendering — every function there is pure and unit-testable independent of React.

## Performance notes

- `Cell` is wrapped in `React.memo` with a custom comparator over primitive props only, so a single reveal or flag toggle only re-renders the handful of cells that actually changed — verified smooth on the 20×20/80-mine board.
- The timer lives in its own small component (`TimerChip`) so its once-a-second tick never touches the board tree.

## Browser support

Uses modern CSS (`color-mix`, CSS nesting via Tailwind, `dvh` units) and the Web Audio API — any recent version of Chrome, Edge, Firefox, or Safari works. All effects degrade gracefully (e.g. sound fails silently if the browser blocks audio before a user gesture).
