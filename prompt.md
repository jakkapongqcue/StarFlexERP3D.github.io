# Prompt: Starflex ERP 3D – Flexible Packaging Factory Simulator

## 1. Goal

Build a single-page 3D ERP / production simulator for a **flexible packaging (plastic film) factory**.
The user configures a production order (product type, quantity, unit, waste %) and presses **Start**;
the page then animates the full flow: raw materials leave the RM warehouse, are processed station by station
in the production area, finished goods are stored in the FG warehouse, and a container truck is loaded for delivery.

**References**

1. https://github.com/Boom-Vitt/boombignose-erp (3D ERP concept and structure)
2. WareTrack-style dashboard screenshot: light background, KPI cards on top, zone chips, detail panel on the right, shipment-style stepper at the bottom, blue accent.

**UI language:** English only (labels, buttons, tooltips, panels, logs).

## 2. Three zones (isometric layout)

| Zone                          | Role                                                                                  | Material handling                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zone 1 – Warehouse RM**     | Stores raw materials and intermediate stock returned from PRD (blown film, mixed ink) | **Forklift** delivers RM from the warehouse to PRD stations                                                                                                  |
| **Zone 2 – PRD (Production)** | Seven process stations arranged in process order                                      | WIP moves between stations with a **Manual Hand Pallet Truck** (operator-pushed)                                                                             |
| **Zone 3 – Warehouse FG**     | (a) FG storage racks, (b) **Delivery Department** with a loading dock                 | A **forklift drives into PRD** to collect FG pallets and stores them in FG racks; a **Delivery forklift** loads pallets onto the container truck at the dock |

Suggested floor plan: RM on the left, PRD in the middle (largest, 7 stations in a U or S shape with a central aisle),
FG on the right with the Delivery dock and truck yard (road + parking bay) at the far end.
Keep aisles wide enough for forklifts; use separate lanes for forklift and hand-pallet-truck paths to avoid collisions.

## 3. Warehouse RM contents (3D models, built from three.js primitives)

Each item has a visible, recognizable model on racks or pallets:

1. **Cylinder** – gravure/printing cylinders: long metal rods (chrome cylinders lying on a rack)
2. **Base-color ink drums** – large drums (RM Ink)
3. **Solvent drums** – small drums
4. **Adhesive drums** – small drums
5. **Resin bags** – white sacks stacked on pallets
6. **Film rolls** – wrapped film rolls, kept as three separately named stocks: **Purchased Film** (bought in, ready for Printing), **Blown Film** (made in-house and returned from PRD), and **Laminate Film** (second layer for Laminate)
7. **Paper cores (Papercore)** – cardboard tubes in bundles
8. **Corrugated boxes** – flat/stacked brown cartons with tape
9. **Spout caps** – small plastic fitment boxes/bags (required by the Spout process)

Also store here the intermediate outputs sent back from PRD: **Blown Film rolls** and **ready-to-use Ink**.
Show a small stock label per item type that decreases as the simulation consumes materials.

### Material name labels (required)

Every material must be identifiable by name wherever it appears, from storage to the point of use:

- **In Warehouse RM:** a floating name tag above each item group (e.g. "Resin bags", "Base-color ink drums", "Purchased film", "Blown film"), showing the current stock quantity and unit.
- **During transport:** each pallet carried by a forklift or hand pallet truck has a floating tag following it with the material name and quantity (e.g. "Resin – 120 kg", "Printing Roll – 1 pallet", "Papercore + Corrugated Box"). A pallet carrying several materials lists them (max 3 lines, then "+N more").
- **At each PRD station:** an "Input" tag listing the materials currently supplied to that station, and an "Output" tag naming what it produces (e.g. "Out: Laminate Roll").
- **Tag behavior:** tags face the camera, stay readable at any zoom (scale or hide below a size threshold), use the same material names and colors everywhere, and have a toggle "Show material labels" (default on) in the order panel.

## 4. Production processes (data flow)

| #   | Process                                             | Input (from)                                                                                                                   | Process                                                                                                             | Output                                    |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | **Blown Film** _(only when Film source = In-house)_ | Resin (Warehouse RM)                                                                                                           | Melt resin in the extruder and blow it into film                                                                    | Blown Film roll → stored in Warehouse RM  |
| 2   | **Ink Mix**                                         | Base-color ink drums (RM Ink) from Warehouse RM                                                                                | Mix and tune color to job spec                                                                                      | Ready-to-use Ink → stored in Warehouse RM |
| 3   | **Printing**                                        | Film roll (**Purchased Film or in-house Blown Film**, per Film source), Cylinder, Ink, Solvent & Other (all from Warehouse RM) | Print artwork and text onto the film                                                                                | Printing Roll                             |
| 4   | **Laminate**                                        | Printing Roll (previous process), Laminate Film and Adhesive & Other (from Warehouse RM)                                       | Bond 2+ film layers with adhesive (lamination) or molten plastic (extrusion lamination) for strength and protection | Laminate Roll                             |
| 5   | **Slit**                                            | Laminate Roll (previous process), Papercore (Warehouse RM)                                                                     | Slit the wide roll into narrow rolls to customer width                                                              | Slit Roll, packed in Corrugated Box       |
| 6   | **Bag**                                             | Laminate/Slit Roll (previous process), Corrugated Box (Warehouse RM)                                                           | Fold and seal film into finished bags                                                                               | Bag (finished pouch), packed in boxes     |
| 7   | **Spout**                                           | Bag/Slit Roll (previous process), Spout, Corrugated Box (Warehouse RM)                                                         | Weld a plastic spout onto the pouch (liquid products)                                                               | Bag with Spout, packed in boxes           |
| 8   | **Warehouse FG**                                    | Finished goods from PRD                                                                                                        | Store Slit Rolls on pallets; Bags and Spout Bags in boxes on pallets; wait for delivery                             | FG stock → Delivery → container truck     |

### Film source (new option)

The user chooses where the base film for Printing comes from:

- **In-house Blown Film:** the Blown Film process runs (resin consumed), and its film roll is returned to Warehouse RM before being issued to Printing.
- **Purchased Film:** the Blown Film process is **skipped** (greyed in the stepper, no resin consumed, no blown-film waste); Printing takes **Purchased Film** rolls straight from Warehouse RM stock.

The choice changes the route, the animation, the stock deductions and the summary table. Ink Mix is unaffected.

### Route per product type

Shown for Film source = In-house. With Film source = Purchased, remove Blown Film from the route.

- **FG Roll:** Blown Film + Ink Mix (upstream, feed RM) → Printing → Laminate → Slit → FG
- **FG Bag:** Blown Film + Ink Mix → Printing → Laminate → Slit → Bag → FG
- **FG Spout:** Blown Film + Ink Mix → Printing → Laminate → Slit → Bag → Spout → FG

(Assumption: Bag takes Slit Roll by default; make "skip Slit for Bag/Spout" a toggle if the factory needs it.)

## 5. Production order input panel (Run Simulation)

A clean, compact form (left sidebar or collapsible floating card) with a **mode switcher** at the top so the user can choose between a quick **Minimal Mode** and a full **Detailed Mode**. The animation starts only when **Start** is pressed.

### Input Mode Switcher

A segmented control / tab bar at the top of the panel:

- **Minimal (Simple) Mode** _(default)_ – clean, low-friction UI showing only essential inputs while applying smart factory defaults in the background.
- **Detailed (Advanced) Mode** – reveals granular process parameters, custom conversion specs, routing overrides, and per-station waste % controls.
- Switching between modes preserves the user's current values (with a "Reset to defaults" link in Detailed mode).

### A. Minimal Mode fields (always visible)

1. **Product type** (compact visual pill/segment choice)
   - **FG Roll** – finished roll from the Slit process
   - **FG Bag** – pouch without spout, from the Bag process
   - **FG Spout** – pouch with spout, from the Spout process
2. **Quantity** (number) and **Unit** (choice, depends on product type) + **Quick preset chips** (e.g., `10`, `50`, `100` rolls or `3,000`, `10,000` pcs)
   - FG Roll units: **roll**, **meter**, **kilogram**
   - FG Bag / FG Spout units: **pieces** (packed in boxes)
3. **Film source** (single choice, default In-house): **In-house Blown Film** or **Purchased Film**. If Purchased is chosen, show a subtle badge that Blown Film is skipped.
4. **Compact assumptions summary pill** (shown only in Minimal mode): a single muted line summarizing active background defaults (e.g., _"Defaults: 3% waste/step · 300 pcs/box · 1,000 m / 25 kg per roll — click Detailed to customize"_).

### B. Detailed Mode fields (additional controls shown when Detailed Mode is active)

5. **Pieces per box** – shown only when unit = pieces; **default 300 pieces per box** (editable). Box count = ceil(pieces / pieces-per-box).
6. **Roll spec** for roll/meter/kg conversion (editable assumed defaults: **1,000 m** and **25 kg** per roll).
7. **Route option** – **Skip Slit for Bag/Spout** toggle (default off; only shown when Product type is FG Bag or FG Spout).
8. **Waste % per process** (one number input per active process in the selected route, default e.g. 2–5%, editable, plus a quick "Apply to all" helper).
   - If Film source = **Purchased Film**, hide the Blown Film waste field and show a note that Blown Film is skipped.
   - Waste affects every process: required input of each step = required output ÷ (1 − waste %), computed backwards from the ordered FG quantity so the first step's input is correctly scaled up. With In-house film the chain starts at resin (Blown Film input); with Purchased film it starts at the Purchased Film quantity needed by Printing.

### C. Common controls & Output (visible in both modes)

9. **Show material labels** toggle (default on).
10. **Buttons:** **Start**, **Pause/Resume**, **Reset**. Show an inline validation message if quantity ≤ 0.

After **Start**, show a **results/summary table**: per process – input qty, waste qty, output qty, and RM consumed (resin kg **or** purchased film kg depending on Film source, ink kg, solvent, adhesive, cores, boxes, spouts).

## 6. Animation behavior

Animation is driven by the order; visible objects are capped (e.g. max 6 pallets per hop) while numeric counters show the real quantities.

0. Before the run starts, all material name tags are visible in Warehouse RM; once Start is pressed, tags follow each pallet through every transport leg and update their quantities on arrival.
1. Forklift takes RM from Warehouse RM to each PRD station that needs it (resin → Blown Film (In-house only), ink drums → Ink Mix, film (purchased or blown, per Film source) + cylinder + ink + solvent → Printing, laminate film + adhesive → Laminate, papercore → Slit, boxes → Slit/Bag/Spout, spout caps → Spout).
2. With In-house film, Blown Film rolls are returned from PRD to Warehouse RM (forklift) and then issued to Printing; with Purchased film this step is skipped and the Purchased Film pallet goes directly from RM to Printing. Mixed Ink is returned to Warehouse RM and issued to Printing in both cases.
3. Between stations, WIP (printing roll, laminate roll, slit roll, bags) is moved by **manual hand pallet truck** with an operator walking beside it; stations show running status (rotating rolls, status light) only while they are active.
4. A forklift enters PRD to pick up FG pallets (roll pallets or boxed bags/spouts) and stores them in FG racks.
5. The Delivery forklift loads FG pallets onto the **container truck** at the dock; the truck then drives away and the run ends with a completion summary.
6. Workers (hard hat, hi-vis vest) stay at stations with working arm animation; walking inspectors patrol the aisles.

Truck: tractor + blue container with open rear, wheels rotate with movement, label "Container Truck".

## 7. ERP UI

- **KPI cards (top):** WIP orders, total FG stock, overall waste %, order progress %.
- **Zone/station chips:** Warehouse RM, PRD (and each of the 7 stations), Warehouse FG / Delivery.
- **Camera:** drag to orbit, wheel to zoom, click a zone/station to select it (blue highlight) and focus the detail panel.
- **Floating labels** above zones/stations with name, status, and current quantity.
- **Detail panel (right):** station status, input/output quantities, waste %, current job, stock list for warehouses.
- **Bottom stepper:** (Blown Film is greyed out when Film source = Purchased) Blown Film → Ink Mix → Printing → Laminate → Slit → Bag → Spout → FG → Delivered, highlighting the active step (steps not used by the route are greyed out).
- **Event log:** timestamped lines that name the material and quantity, such as "Forklift #1: Resin 120 kg → Blown Film" or "Forklift #1: Purchased Film 300 kg → Printing".
- **Stock list (Warehouse RM detail):** Purchased Film, Blown Film, Laminate Film, Resin, ink, solvent, adhesive, cylinder, papercore, boxes and spouts, each with unit.
- Mock data lives in JS state; no backend required.

## 8. Technical requirements

- Single HTML file (inline CSS/JS) using **three.js r128 UMD** from `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.
- Noto Sans (or system font) with fallback; no other external libraries.
- Write orbit/zoom controls manually with pointer events (OrbitControls is not in the r128 core build).
- Light/dark theme via CSS variables (`prefers-color-scheme`); read zone colors from CSS variables when building the scene.
- Responsive: bottom-sheet panels on mobile; `viewport-fit=cover` and safe-area insets.
- Visible keyboard focus; respect `prefers-reduced-motion` (render a static pose and skip animation).
- No localStorage; keep state in memory.
- Paths: define waypoint lists for every forklift/hand pallet truck/worker route; movement time based on path length and speed.

## 9. Pitfalls learned (avoid these)

1. **Do not name functions/variables the same as DOM element ids** (e.g. a `panel()` function shadowed `<aside id="panel">` and broke the detail panel).
2. **Watch `const`/`let` temporal dead zone:** functions called during scene construction must not use constants declared later in the script.
3. **Avoid name collisions** (e.g. floor mesh `fl` vs forklift list); use descriptive names.
4. When patching with multi-line regex (`.*?`), verify the result; a greedy/early match once deleted large parts of the file.
5. Before publishing, smoke-test the script in Node with a stubbed `THREE` and `document` to catch ReferenceErrors.

## 10. Acceptance criteria

- Three clearly separated zones (Warehouse RM, PRD, Warehouse FG with Delivery dock) are visible; all text is in English.
- Warehouse RM shows all 9 item types listed in section 3.
- The Order Input panel provides a **Minimal Mode** (default, showing only Product type, Quantity/Unit with presets, Film source, and a compact assumptions summary) and a **Detailed Mode** (revealing Pieces per box, Roll spec, Skip Slit toggle, and per-process Waste % inputs) without losing values when switching.
- Selecting FG Roll / FG Bag / FG Spout changes the route, available units, and the stepper.
- Pieces unit shows the pieces-per-box field (in Detailed mode, default 300 in Minimal mode); box count is calculated correctly.
- Waste % per process changes the required input quantities and the summary table.
- Pressing Start runs: RM forklift → PRD stations (hand pallet truck for WIP) → FG forklift pick-up → FG storage → Delivery forklift → container truck departs.
- Material name tags are visible on every Warehouse RM item group, follow each pallet during forklift and hand-pallet-truck transport, and appear as Input/Output tags at each PRD station; the labels toggle works.
- Film source = Purchased: Blown Film is skipped and greyed, no resin is consumed, Purchased Film stock decreases, and Printing receives the purchased film pallet. Film source = In-house: Blown Film runs and returns film to RM before Printing.
- No console errors; works on desktop and mobile; the user can pause and reset.

## 11. Future extensions

- Bind animation to real inventory and orders (e.g. Epicor ERP via API) instead of mock data.
- Cost per process, customer orders and delivery notes, ink recipes, film layer structures.
- Replace primitive models with real machine models (.glb/.gltf) from vendors.
