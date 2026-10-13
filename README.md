# Virtual Chemistry Lab

A web app that lets diploma engineering students (MSBTE K-Scheme, **Basic Science – Chemistry 311305**)
practise a laboratory experiment on screen before doing it in the real lab.

The first complete experiment is **Practical No. 15: Determination of thinner content in oil paint**.
The app is designed so that more experiments can be added by dropping in **one JSON data file** plus
a **small simulation module** — no changes to the app pages are needed.

---

## Tech stack

- React + Vite
- Tailwind CSS (v4)
- React Router
- Zustand (state)
- Framer Motion (animation)
- @dnd-kit/core (drag and drop)

No backend, database or login. No external images or CDNs — every graphic is drawn as inline SVG, so
the app works fully offline once dependencies are installed.

---

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build into /dist
npm run preview   # preview the production build
npm run lint      # oxlint
```

Node 18+ is recommended (developed on Node 24).

---

## Screens / routes

| Route | Purpose |
| --- | --- |
| `/` | Home: list of experiments (left) and laboratory precautions (right, sticky). |
| `/experiment/:id` | Choose **Read** (lab manual) or **Perform** (simulation). |
| `/experiment/:id/read` | Full lab manual in the order given in the data file, with a Print button. |
| `/experiment/:id/perform` | The lab bench simulation. |
| `/experiment/:id/report` | Print-friendly report with the student's readings. |

### The Perform page

- **Left panel** with tabs (Aim, Apparatus, Procedure, Precautions, Observations) and a
  **Hide** button. The open/closed state is remembered (localStorage).
- **Shelf** at the top shows only this experiment's items. Movable items can be dragged to the
  bench; fixed equipment is labelled.
- **Working bench** with the weighing balance, electric oven and desiccator as drop targets.
- **Hint bar** at the bottom shows the current step and hosts **Reset**, **Hint** and **Finish**.
- **Guided / Free** mode switch, plus a **time control** (1x / 60x / 240x) and a live simulated clock.
- A **precautions pop-up** must be acknowledged before the simulation starts.

---

## Project structure

```
src/
  pages/         Home, ChooseMode, Read, Perform, Report
  components/     SidePanel, Bench, Shelf, HintBar, ObservationTable, ResultCard, Viva,
                  Toasts, PrecautionsModal, DragBits
    apparatus/    PorcelainDish, PaintTin, WeighingBalance, ElectricOven, Desiccator, Paint
  engine/         store.js (Zustand), stepEngine logic in store, timeSim.js
  experiments/    registry.js + paintThinner/ (this experiment's simulation module)
  data/           precautions.json, apparatus.json, experiments/
    experiments/  index.json (list) + paint-thinner.json (manual + steps + viva)
```

### Data-driven design

- `src/data/experiments/index.json` — the list of experiments (`id`, `title`, `status`).
- `src/data/experiments/<id>.json` — the manual content, apparatus ids, guided steps and viva questions,
  plus the hidden-value configuration for the simulation.
- `src/data/apparatus.json` — a shared apparatus library (`id`, `name`, `specification`).
- `src/experiments/registry.js` — maps an experiment id to its simulation module.
- `src/experiments/<name>/index.js` — an experiment's logic: `createInitialState`, `tick`, `reduce`,
  `stepChecks`, `fieldStatus`, `makeResult`.

The **Perform page is generic**: it builds the shelf from the experiment's apparatus list and runs the
steps from the JSON by calling the named check functions on the simulation module.

---

## How the simulation works

- **Hidden values** are randomised at the start of each attempt: empty dish mass (28.000–45.000 g) and
  the true thinner fraction (30–50%). They are never shown until the result screen.
- **Weight loss on heating** = `thinnerFraction × paintMass × (1 − exp(−t / 12 min))`, so heating at
  120 °C for one hour evaporates about 99% of the thinner.
- **Cooling** in the desiccator falls from the oven temperature to 30 °C with a 7-minute time constant;
  it counts as “cooled” at 32 °C or below.
- **Balance** shows a 3-decimal reading that drifts and then becomes **STABLE** after 3–5 seconds.
  There is no tare function (the manual does not use one); the reading is always the gross weight.
- **Pouring** is a press-and-hold control that adds paint in small steps of 0.005 g (only when the dish
  is on the balance). An extra “Discard paint & clean dish” button is provided to recover from over-pouring.
- **Time control** 1x / 60x / 240x: at 240x one simulated hour passes in about 15 real seconds.
- **Mistakes** (weighing a hot dish, oven not at 120 °C, too little/much paint, heating under an hour)
  produce friendly messages and are logged for the report.

---

## How to add a new experiment

1. **Add the data.** Create `src/data/experiments/<new-id>.json` with the same shape as
   `paint-thinner.json` (id, title, aim, outcomes, theory, resources, procedure, observationTable,
   `apparatus` ids, `steps`, `viva`, `simulation`). The loader picks up new files automatically.
2. **Register it in the list.** Add an entry for the new id to `src/data/experiments/index.json`
   with `"status": "active"`.
3. **Add any apparatus** you use to `src/data/apparatus.json`.
4. **Write the simulation module.** Create `src/experiments/<name>/index.js` exporting:
   - `createInitialState(hidden)` → the starting state,
   - `tick(state, dtSimMinutes, dtRealMs)` → advance continuous physics (returns `{ state, events }`),
   - `reduce(state, action)` → handle one user action (returns `{ state, events }`),
   - `stepChecks` → an object of pure functions named by the `check` field of each step,
   - `fieldStatus(state, field)` and `makeResult(state)` for the observations table and result screen.
5. **Register the module** in `src/experiments/registry.js`:
   ```js
   import myExperiment from './myExperiment'
   const modules = { 'paint-thinner': paintThinner, 'new-id': myExperiment }
   ```
6. **(Optional) Add SVG apparatus** to `src/components/apparatus/` if your experiment needs a new
   drawing, and render it from the Bench.

Events returned from `tick`/`reduce` use `{ kind: 'warn' | 'info' | 'block', text, action? }`.
Warnings and blocks are logged as mistakes automatically.

---

## Assumptions

- **Lab bench layout**: heavy equipment (balance, oven, desiccator) is fixed on the bench; the shelf
  holds the movable samples (porcelain dish, oil paint tin). This matches how the equipment is used in
  the procedure and keeps the drag-and-drop meaningful.
- **No tongs**: the manual lists no tongs, so none were added. Opening the oven door with the dish
  inside is allowed and merely animated.
- **CaCO3 as desiccant** is included exactly as written in the manual, with a note to confirm with the
  instructor.
- **Pouring** adds 5 small steps (0.005 g each) per animation frame, so about 1 g is poured in ~2 seconds
  of holding. The 0.005 g step size is from the specification.
- **Result tolerance**: the balance noise is ±0.001 g, so W1/W2/W3 are marked correct within 0.002 g of
  the simulated true weighing; W, Z and % are checked as arithmetic on the student's own values (±0.01).
- **Viva** is answered after the result and completes the last guided step.
- Number formatting uses a dot decimal separator, matching the printed MSBTE manual style.

---

## Definition of done (this MVP)

A student can open Home, pick Practical 15, **Read** the manual or **Perform** the experiment, complete
all 10 guided steps with realistic animated SVG apparatus, hide the side panel, fill the observation
table with validation, get a result with feedback, answer the viva, and print a report. Free mode also
works. `npm run build` and `npm run lint` pass.
