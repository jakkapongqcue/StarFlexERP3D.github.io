# Prompt: Starflex ERP 3D – Flexible Packaging Factory Simulator

## 1. Goal

Build a single-page 3D ERP / production simulator for a **flexible packaging (plastic film) factory**.
The user configures a production order (product type, quantity, unit, waste %) and presses **Start**;
the page then animates the full flow: raw materials leave the RM warehouse, are processed station by station
across a realistic two-row production floor with a dedicated PRD Warehouse (curing/staging area), finished goods are stored in the FG warehouse, and a container truck is loaded at the high-detail logistics loading dock for delivery.

**References**

1. https://github.com/Boom-Vitt/boombignose-erp (3D ERP concept and structure)
2. WareTrack-style dashboard screenshot: light/dark theme support, KPI cards on top, collapsible floating panels, zone chips, inspector panel on the right, shipment-style stepper at the bottom, blue accent.
3. Industrial factory reference standards: Two-row production layout, central transit highway, dual-level industrial racks with blue uprights & orange load beams, high-detail logistics dock with teal canopy frame & safety bollards, dedicated yellow-demarcated Infeed/Outfeed material bays beside machines.

**UI language:** English only (labels, buttons, tooltips, panels, logs).

---

## 2. Factory Layout & Zones (Isometric 3D View)

The factory is arranged horizontally along the X-axis ($X = -130$ to $+130$) with a wide central transit spine along $Z = 0.0$:

| Zone | Area & Coordinates | Role & Equipment | Material Handling |
| :--- | :--- | :--- | :--- |
| **Zone 1 – Warehouse RM** | West wing ($X \approx -110$ to $-65$, $Z \approx -22$ to $+22$) | Stores raw materials and intermediate stock returned from PRD (blown film, mixed ink). Industrial racks, drum pallets, resin bags, film rolls. | **RM Forklift** delivers raw materials from RM racks along the Central Highway to PRD station Infeed bays. |
| **Zone 2 – PRD (Production Floor)** | Center floor ($X \approx -65$ to $+65$, $Z \approx -22$ to $+22$) | **Two-row layout (Row 1 North, Row 2 South)** with a wide Central Transit Highway ($Z = 0.0$) in between: <br>• **Row 1 (North, $Z = -12.0$):** Blown Film ($X=-45$), Printing ($X=-15$), Bag Making ($X=+15$), Spout ($X=+45$)<br>• **Row 2 (South, $Z = +12.0$):** Ink Mix ($X=-45$), **PRD WH** ($X=-15$), Laminate ($X=+15$), Slit ($X=+45$) | WIP is transported between stations and PRD WH via a **Manual Hand Pallet Truck (HPT)** with walking operator along the Central Highway. |
| **Zone 2.5 – PRD WH (Curing & Staging Area)** | PRD Row 2, Col 2 ($X = -15.0$, $Z = +12.0$) | Intermediate warehouse in the production area with dual-level industrial racks (blue uprights, orange load beams) storing rolls undergoing curing/adhesive bond development and WIP staging boxes. Aisle features cyan guide lines & arrows. | Hand Pallet Truck moves rolls into curing racks and out to subsequent lamination, slitting, or bag making steps. |
| **Zone 3 – Warehouse FG & Logistics Dock** | East wing ($X \approx +65$ to $+130$, $Z \approx -22$ to $+22$) | **(a) FG Storage Racks:** Multilevel pallet racks for finished goods.<br>**(b) High-Detail Logistics Loading Dock ($Z = -4.0$):** Teal steel canopy frame, roll-up shutter, red/green LED dock safety lights, yellow safety bollards, zebra hazard stripes, container truck loading yard, asphalt perimeter roads with zebra crossings & perimeter trees. | **FG Forklift** collects finished goods from Outfeed bays into FG racks; **Delivery Forklift** loads pallets into the container truck. |

### Central Transit Highway ($Z = 0.0$)
- High-visibility thoroughfare running east-west dividing Row 1 and Row 2.
- Features asphalt textured surface, yellow dashed centerline markings, directional arrows, and white pedestrian zebra crossings.
- All machine docks face this highway at $Z = \pm 5.0$, eliminating route collisions and vehicle clipping through machine geometry.

---

## 3. Machine Models & Demarcated Infeed / Outfeed Bays

### A. Realistic Machine & Product Models
Every station features custom three.js geometry matching real industrial flexible packaging equipment:
1. **Blown Film Extruder:** Extruder barrel, hopper, tall circular die, vertical scaffolding tower with bubble collapsing frame, bubble cage, take-up rolls, and dual surface winders.
2. **Ink Mixing Station:** Heavy steel frame, stainless mixing tanks with agitator motors, operator control panel, transfer pump manifolds, and drum staging pads.
3. **Rotogravure Printing Press:** Multi-unit color printing towers with dry chambers, chrome print cylinders, overhead web bridge, and unwinder/rewinder reels.
4. **Laminator:** Primary unwinder, adhesive coating station, drying tunnel hood, nip rollers, secondary unwinder, and rewinder.
5. **Slitter Rewinder:** Heavy unwind chucks, slitter knife arbor (rotary circular blades), trim extractors, dual differential rewind shafts with finished rolls.
6. **Bag Making Machine (Pouch Maker):** Roll unwind stand, folding triangular plate, seal bars (bottom/side sealing), cooling bars, guillotine cutter, and shingled outfeed conveyor producing stand-up pouches.
7. **Spout Applicator Machine:** Industrial light grey chassis, bowl vibratory feeder / hopper for spout fitments, vertical inserter chute, ultrasonic sealing horn, and transfer conveyor.
8. **Pouches & Spouted Pouches:** Stand-up pouches rendered with bottom gusset and realistic foil metallic sheen (`MeshStandardMaterial` metalness/roughness). Spouted pouches rendered with top-welded screw spout fitment caps.

### B. Yellow Demarcated Infeed & Outfeed Bays
Every machine station features dedicated yellow-line safety boxes stenciled on the factory floor:
- **`INFEED` Bay (Input side):** Staged raw material euro-pallets holding the required inputs (e.g. resin bags for Blown Film; base-color ink & solvent drums for Ink Mix; film rolls, cylinders, ink drums for Printing; adhesive & laminate film for Laminate; papercores for Slit; carton boxes for Bag; spout fitments for Spout).
- **`OUTFEED` Bay (Output side):** Staged pallets holding WIP products or finished goods (e.g. extruded film rolls, mixed ink drums, printed rolls, laminated rolls, slitted roll boxes, stand-up pouch boxes, spouted pouch boxes).

---

## 4. Warehouse RM Contents & Material Labels

### A. 3D Raw Material Models
1. **Cylinder** – Rotogravure cylinders: long chrome metal cylinders racked horizontally.
2. **Base-color ink drums** – Large industrial drums (`RM_INK`).
3. **Solvent drums** – Chemical solvent drums (`SOLVENT`).
4. **Adhesive drums** – Polyurethane lamination adhesive drums (`ADHESIVE`).
5. **Resin bags** – White polypropylene/polyethylene polymer sacks stacked on wooden pallets.
6. **Purchased Film** – Commercial polymer film reels on pallets, ready for printing.
7. **Paper cores (Papercore)** – Heavy spiral cardboard tubes in bundles.
8. **Corrugated boxes** – Folded/stacked brown shipping cartons with sealing tape.
9. **Spout caps** – Fitment boxes containing plastic spout caps.
10. **Blown Film rolls & Mixed Ink drums** – Intermediate stocks returned from PRD into RM.

### B. Material Name Labels
- **In Warehouse RM:** Floating name tags above each item stack showing material name, current stock quantity, and unit.
- **During Transport:** Each pallet moving with a forklift or hand pallet truck has a floating tag attached at $Y = 3.6$ showing the cargo description and quantity.
- **At Stations:** Demarcated `INFEED` and `OUTFEED` bay tags dynamically display active material types.
- **Toggle:** "Show material labels" checkbox in the UI allows hiding/showing tags at any time.

---

## 5. Production Processes & Routing

| # | Process Station | Location | Inputs | Processing Action | Output |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Blown Film** | Row 1, Col 1 ($X=-45, Z=-12$) | Resin bags | Melt & blow plastic bubble into tubular film | Blown Film roll → Stored in RM |
| **2** | **Ink Mix** | Row 2, Col 1 ($X=-45, Z=+12$) | Base ink drums, Solvent | Blend and color-match ink formula | Ready-to-use Ink → Stored in RM |
| **3** | **Printing** | Row 1, Col 2 ($X=-15, Z=-12$) | Film roll (Purchased or In-house Blown), Cylinder, Ink, Solvent | Multi-color rotogravure printing | Printing Roll → Stored/Cured in PRD WH |
| **4** | **Laminate** | Row 2, Col 3 ($X=+15, Z=+12$) | Printed Roll, Laminate Film, Adhesive | Dry-bond lamination of barrier layers | Laminate Roll → Curing in PRD WH |
| **5** | **Slit** | Row 2, Col 4 ($X=+45, Z=+12$) | Laminate Roll (cured), Papercores | Rotary slitting into custom widths | Slit Rolls (packed in boxes or rolls) |
| **6** | **Bag** | Row 1, Col 3 ($X=+15, Z=-12$) | Slit Roll, Corrugated Boxes | Pouch forming, side/bottom sealing | Stand-up Pouches (in cartons) |
| **7** | **Spout** | Row 1, Col 4 ($X=+45, Z=-12$) | Pouches from Bag, Spout fitments, Boxes | Ultrasonic welding of spout spout fitment | Spouted Pouches (in cartons) |
| **8** | **Warehouse FG** | FG Wing ($X=+75, Z=0$) | Finished Goods from PRD | Palletized storage in FG racks | Pallets loaded into Container Truck |

### Film Source Routing
- **In-house Blown Film:** Blown Film process runs first (consuming resin); extruded rolls return to Warehouse RM before issuance to Printing.
- **Purchased Film:** Blown Film step is **skipped** (greyed in stepper, 0 resin consumed); Printing directly draws **Purchased Film** rolls from Warehouse RM.

### Product Routing
- **FG Roll:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ Laminate $\rightarrow$ Slit $\rightarrow$ FG Warehouse.
- **FG Bag:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ Laminate $\rightarrow$ Slit $\rightarrow$ Bag $\rightarrow$ FG Warehouse.
- **FG Spout:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ Laminate $\rightarrow$ Slit $\rightarrow$ Bag $\rightarrow$ Spout $\rightarrow$ FG Warehouse.

---

## 6. User Interface & Controls

### A. Theme Switcher & Persistence
- **3-State Theme Toggle:** Light (`light`), Dark (`dark`), or System (`system`).
- **Persistence:** Remembers user selection in `localStorage` (`starflex_erp_theme`) and restores it upon reload. Automatically adjusts 3D scene background, fog, grid, and ambient lighting.

### B. Panels Visibility Toggle
- **Collapsible Panels Button:** Floating action button (`#togglePanelsBtn`) in the top bar to toggle visibility of floating UI panels (`#orderPanel`, `#detailPanel`), providing an unobstructed full-screen view of the 3D plant.

### C. Simulation Playback & Speed Controls
- **Combined Start / Pause Button:** Single button that dynamically toggles between Start (Play icon) and Pause (Pause icon) with appropriate status-based color styling.
- **Reset Button:** Styled with an outline red accent (`btn-outline-danger`) to prevent accidental clicks.
- **Default Speed:** Defaults to **1.0x** on page load with speed multiplier buttons (0.5x, 1x, 2x, 4x).
- **Keyboard Shortcut:** Pressing the **Spacebar** triggers Start, Pause, or Resume simulation.

### D. Order Input Modes
- **Minimal Mode (Default):** Streamlined inputs (Product Type, Quantity, Units with quick presets, Film Source, Assumptions Summary pill).
- **Detailed Mode:** Granular controls (Pieces per box, Roll spec length/weight conversions, Skip Slit toggle, and individual per-station Waste % inputs).

### E. Unified Bottom Stepper & Zone Bar
- Interactive zone quick-focus chips (`All Factory`, `Warehouse RM`, `PRD Line`, `PRD WH`, `Warehouse FG & Dock`).
- Visual process stepper node chain showing real-time execution status (Idle, Active, Done, or Skipped).

---

## 7. Technical Architecture & Constraints

- **Pure Client-Side:** Single HTML file containing inline CSS and JavaScript.
- **Three.js:** r128 UMD loaded via CDN (`cdnjs.cloudflare.com`). No external loaders (GLTFLoader, OrbitControls) required; all geometry and pointer controls are custom-coded with Three.js primitives and pointer events.
- **Responsive Layout:** Adaptive safe-area inset padding for desktop, tablet, and mobile views.
- **Zero Collision Navigation:** Explicit waypoint arrays for all vehicle routes (RM Forklift, Hand Pallet Truck, FG Forklift, Delivery Forklift, Container Truck) utilizing the $Z = 0.0$ Central Highway corridor.
