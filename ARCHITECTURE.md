# StarFlex ERP 3D - Architecture & Codebase Map

> **Purpose:** Master navigation index and architectural map for AI coding agents and developers. Consult this map to instantly locate files, functions, and line ranges without needing full-codebase searches.

---

## 1. System Overview

* **Stack:** Vanilla JavaScript (ES6+), Three.js (r128), HTML5 Canvas, CSS3.
* **Architecture:** Zero-build, script-tag modular system hosted directly on GitHub Pages.
* **Global Scope:** Modules share state and helpers via browser global scope (`window`), with `appState` as the single source of truth.

---

## 2. Directory & Module Map

```
StarFlexERP3D/
├── index.html                  # HTML entry point, 3D canvas container & script loading order
├── css/
│   └── style.css               # Responsive layout, dark/light themes, 3D HTML label overlays
├── js/
│   ├── config.js               # Global appState, station configurations & default maps
│   ├── calculations.js         # MRP material balance & yield/waste calculations
│   ├── materials/              # Modular 3D Materials, Procedural Textures & Props
│   │   ├── base.js             # Shared Three.js materials (kraft box, tape, stretch wrap)
│   │   ├── textures.js         # 2D Canvas procedural textures (Hygiene pouch, film web, sack)
│   │   ├── props.js            # 3D props (pouch mesh, carton box, sacks, racks, drums)
│   │   └── pallets.js          # Pallet builders (wooden pallets, wrapped box pallets, roll pallets)
│   ├── machines/               # Individual Machine 3D Models
│   │   ├── common.js           # Reusable machine components (winder stands, film web spans)
│   │   ├── blown-film.js       # Station 1: Blown Film Extrusion Tower
│   │   ├── ink-mix.js          # Station 2: Solvent Ink Mixing & Dispensing Station
│   │   ├── printing.js         # Station 3: 8-Color Rotogravure Printing Press
│   │   ├── laminate.js         # Station 4: Dry Laminator with Bridge Oven
│   │   ├── slit.js             # Station 5: Venus III High-Speed Slitter Rewinder
│   │   ├── bag.js              # Station 6: Stand-Up Pouch Bag Making Machine & Conveyor
│   │   ├── spout.js            # Station 7: Rotary Indexing Spout Inserter & Welder
│   │   └── index.js            # Dispatcher: buildRealisticStationMachine()
│   ├── scene.js                # Scene lighting, worker placement, station loop & 3D labels
│   ├── simulation.js           # Core simulation tick (stepSimulationFrame), vehicle tasks, station animation
│   ├── vehicles.js             # 3D models: Forklift, Hand Pallet Truck (HPT), Container Truck
│   ├── paths.js                # Navigation waypoints, transit lanes & docking coordinates
│   ├── bays.js                 # Station Infeed / Outfeed demarcated safety bays
│   ├── floor.js                # Industrial concrete floor, zone boundaries & safety walkways
│   ├── labels.js               # 3D-to-2D CSS label projector (project3DLabelsToScreen)
│   ├── ui.js                   # DOM event bindings, sidebar controls, KPI panels & modals
│   └── main.js                 # Initialization sequence & requestAnimationFrame loop
└── docs/
    └── prompts/                # Reference notes, prompt archives & historical specifications
```

---

## 3. Quick-Lookup Guide (Where to Edit)

| What you want to do | Target File | Key Functions / Locations |
| :--- | :--- | :--- |
| **Change Station / Machine Geometry** | `js/machines/<station-id>.js` | `buildBlownFilmMachine`, `buildBagMachine`, `buildSpoutMachine`, etc. |
| **Change Worker Positions or Appearance** | `js/scene.js` | Around lines 740–765 (`workerX`, `workerZ`, `workerYaw`, `createWorkerMesh`) |
| **Add / Edit Machine Animations** | `js/machines/<machine>.js` + `js/simulation.js` | `mGroup.userData.updateAnimation` in machine, hooked into `stepSimulationFrame(dt)` in `simulation.js` |
| **Change Pouch / Carton / Pallet Visuals** | `js/materials/props.js` or `pallets.js` | `createPouchMesh`, `createKraftCartonBox`, `createStandardBoxPallet` |
| **Change Hygiene Print / Texture Art** | `js/materials/textures.js` | `getHygienePouchTexture()`, `getHygieneFilmTexture()`, `getResinSackTexture()` |
| **Change Product Type Defaults / Config** | `js/config.js` | `appState.productType`, `STATIONS_CONFIG`, `DEFAULT_WASTE_MAP` |
| **Change Material Balance / MRP Logic** | `js/calculations.js` | `calculateProductionPlan(orderQty, unit, productType, ...)` |
| **Change Vehicle Dispatch & Movement** | `js/simulation.js` + `js/paths.js` | `updateForkliftTasks()`, `updateHandPalletTruckTasks()`, waypoint arrays |
| **Change UI Controls / Side Panel / KPIs** | `js/ui.js` + `index.html` | `recalculateAndRenderUI()`, `bindAllUIEvents()`, sidebar HTML |
| **Change 3D HTML Overlay Labels** | `js/labels.js` | `project3DLabelsToScreen()`, `registerLabel3D()` |

---

## 4. Script Loading Order (`index.html`)

Scripts must be loaded in dependency order:
1. External libraries: `three.min.js`
2. Core configuration: `config.js` -> `calculations.js`
3. Materials & Props: `materials/base.js` -> `materials/textures.js` -> `materials/props.js` -> `materials/pallets.js`
4. Machine models: `machines/common.js` -> individual machines -> `machines/index.js`
5. Scene & Environment: `vehicles.js` -> `bays.js` -> `floor.js` -> `scene.js` -> `labels.js`
6. Logic & Interaction: `paths.js` -> `simulation.js` -> `ui.js` -> `main.js`
