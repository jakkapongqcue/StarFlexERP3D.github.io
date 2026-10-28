# Prompt: Starflex ERP 3D – Flexible Packaging Factory Simulator

## 1. Goal

Build a single-page 3D ERP / production simulator for a **flexible packaging (plastic film) factory**.
The user configures a production order (product type, quantity, unit, waste %) and presses **Start**.
The simulator supports two distinct operating modes designed for different user objectives:

1. **Mode: Flow Only (Non-Linear / Concurrent Digital Twin Mode):**
   - Designed for high visual engagement and realistic factory operations.
   - Runs a **non-linear, concurrent, pipelined simulation** where machines operate simultaneously and multiple material handling vehicles move in parallel without waiting sequentially.
   - Raw materials are continuously shuttled from **RM WH** to machine Infeed bays, while **PRD WH** functions as the active central buffer where rolls are held, staged, and cured concurrently before subsequent slitting or pouch making.
   - Numeric ERP tables and event logs are hidden for a clean, uncluttered digital twin viewing experience.

2. **Mode: Flow Details (Linear / Step-by-Step ERP Ledger Mode):**
   - Designed for granular production planning, process engineering, and ERP reconciliation.
   - Runs a **deterministic linear, step-by-step simulation** (one process step at a time) allowing users to verify material traceability, station waste % deductions, and step-by-step lot flows.
   - Fully reveals the Factory Overview, Material Balance Summary, Station Waste Breakdown, and timestamped chronological Event Log.

**References & Visual Inspiration**

1. https://github.com/Boom-Vitt/boombignose-erp (3D ERP concept and structure)
2. WareTrack-style dashboard screenshot: light/dark theme support, KPI cards on top, collapsible floating panels, zone chips, inspector panel on the right, shipment-style stepper at the bottom, blue accent.
3. **Stylized Isometric Industrial Digital Twin Reference (Reference Image):** Clean open-floor digital twin, uniform concrete floors, selective pallet racks (blue uprights, orange load beams), yellow counterbalance forklifts, open ground-level truck loading yard, thin yellow staging boxes, cyan transit guide markings, and miniature workers in hi-vis vests.

**UI language:** English only (labels, buttons, tooltips, panels, logs).

---

## 2. 3D Visual & Art Direction (Stylized Isometric Industrial Digital Twin)

The entire 3D scene must adopt a modern, clean, stylized **Isometric Industrial Open-Floor / Digital Twin** aesthetic:

### A. Factory Environment & Ground
- **Open-Floor Layout (No Perimeter Walls & No Supervisor Office):** Completely open floorplan with no perimeter walls, no cutoff barriers, and no elevated control office, maximizing visibility and providing an unobstructed 360-degree digital twin view into all warehouse and manufacturing stations.
- **Factory Floor & Grounds:** All floors throughout the factory and exterior loading yard are uniform concrete (`#e2e8f0` / `#dce4ed` in light mode, `#1e293b` / `#172033` in dark mode) with subtle joints and crisp painted yellow/white demarcation markings. No separate asphalt road surfaces are created.
- **Truck Loading Yard (Open Level Ground - No Bays, No Roads):** An open, flat concrete parking and loading yard at ground level ($Y = 0.12$). No elevated dock platforms, no roll-up bay portals, no canopies, and no road meshes. Painted yellow parking stall boundaries, wheel stop curbs, and forklift loading approach lanes directly on the concrete floor allow the delivery forklift to load pallets directly onto the parked container truck.
- **Side-Door Container Truck (รถบรรทุกตู้เปิดข้างสำหรับโหลดพาเลท):** The blue dry freight cargo box features a wide 7.6-meter side loading opening on its left side facing the incoming Delivery Forklift. Dual side cargo doors are swung wide open ($105^\circ$ outward) with chrome locking bars and safety hazard yellow/black stripes along the door sill threshold. The hollow interior reveals a steel cargo bed, ceiling reinforcement ribs, and overhead cargo lamps, allowing the delivery forklift to insert finished goods pallets directly inside through the side doorway. Doors automatically swing closed when the truck departs.
- **Seamless Neutral Backdrop:** Clean, non-distracting studio background (`#edf2f7` in light mode, `#0f172a` in dark mode).

### B. Lighting, Shadows & Material Aesthetics
- **Soft Ambient & Directional Lighting & Full Factory Shadow Map (ระบบเงาสัมผัสพื้นสมจริง):**
  - High-performance `THREE.PCFSoftShadowMap` delivering smooth, antialiased ground contact shadows.
  - Directional light (`THREE.DirectionalLight`) positioned at `(70, 130, 85)` with a 4096×4096 shadow map and an orthographic shadow camera frustum spanning the entire $280\text{m} \times 140\text{m}$ factory layout (`left: -140, right: 140, top: 85, bottom: -85, near: 10, far: 360`, `bias: -0.0005`, `normalBias: 0.025`).
  - Soft, delicate lighting contrast (`ambientLight: 0.84`, `dirLight: 0.40`, `shadow.radius: 2.5`) providing clean, light-grey ground contact shadows with gentle diffused penumbra edges that do not look harsh or overly dark, giving depth without obscuring floor details.
  - Automated shadow flagging (`applyShadowFlags`) ensures all stationary equipment, moving fleet, mounted pallet cargo, and landscape elements cast and receive shadows, while floor surfaces cleanly receive shadows.
- **Geometric Precision:** Clean, stylized low-to-mid poly geometry with chamfered edges, avoiding noisy photorealistic textures in favor of smooth, modern industrial matte and metallic materials (`MeshStandardMaterial` with tuned roughness and metalness).

### C. Standardized Industrial Color Palette
- **Pallet Racks (Model Reference):** 3-tier modular industrial selective racks featuring Royal Blue upright corner posts (`#1d4ed8`), horizontal white steel cross-bracing ties (`#f8fafc` / `#e2e8f0`), Safety Orange horizontal load beams (`#f97316` / `#ea580c`) with wrap-around post brackets, and crisp white wire/steel shelf decking platforms (`#f8fafc`) on all tiers. Stored items feature signature burgundy/crimson drums with white wrap-around graphic labels and kraft corrugated cardboard boxes with white center tape strips.
- **Material Handling Forklifts (Model Reference):** Industrial Safety Yellow chassis (`#facc15` / `#eab308`) with a heavy elevated black rear counterweight block, 4-post black overhead protective roll cage with solid roof canopy, a seated 3D driver wearing a high-visibility yellow safety vest (`#facc15`) with dark blue arms holding the steering wheel and controls, dual black vertical mast rails, front carriage plate, **two long horizontal black ground-level forks extending out in front**, and 4 sturdy dark wheels.
- **Truck Loading Yard:** Open level concrete yard with yellow painted truck parking stall outlines, wheel stop curbs, and forklift loading lane demarcations (no bay portals, canopies, or raised dock platforms).
- **Logistics Trucks:** Clean white delivery container truck (`#f8fafc`) parked directly on the level concrete yard.
- **Floor Demarcation:** Crisp, thin safety yellow bounding boxes (`#facc15`) defining pallet drop bays and staging zones; yellow dashed corridor centerlines and white pedestrian crossings directly on the concrete floor.
- **Conveyor & Material Handling:** Charcoal black modular belt conveyors (`#1e293b`) with silver support legs and blue control consoles.
- **Human Operators:** Stylized miniature low-poly human models wearing high-visibility yellow safety vests (`#facc15`), safety hard hats, and dark trousers stationed at machines, inspection desks, and driving forklifts.
- **Solid, Clean UI Panels (No Backdrop Blur):** All floating UI panels (banner, brand box, KPI cards, order input panel, detail panel, and bottom stepper bar) use clean solid backgrounds without `backdrop-filter: blur()`, eliminating blur distortion and unnecessary GPU rendering overhead.
- **Landscaped Perimeter Tree Clusters (3 Clustered Exterior Groves):** Instead of solitary trees spaced in straight rows, trees are arranged into 3 distinct lush architectural clusters situated on the outer perimeter:
  1. **Spot 1 (Northwest Perimeter, $X = -88, Z = -33$):** Behind RM WH.
  2. **Spot 2 (Northeast Perimeter, $X = +88, Z = -33$):** Behind Warehouse FG.
  3. **Spot 3 (South Perimeter, $X = 0, Z = +35$):** Front exterior perimeter garden.
  Each cluster features an organic circular green turf mound with stone curbing, 5 stylized low-poly trees of varied canopy heights ($3.5\text{m} - 5.2\text{m}$) and 5 distinct natural foliage hues (emerald `#059669`, jade `#10b981`, forest `#047857`, spring `#34d399`, and leaf green `#16a34a`), along with 4 low decorative shrubs.

---

## 3. Factory Layout & Zones (Isometric 3D View)

The factory is arranged horizontally along the X-axis ($X = -130$ to $+130$) with a wide central transit spine along $Z = 0.0$:

| Zone | Area & Coordinates | Role & Equipment | Material Handling |
| :--- | :--- | :--- | :--- |
| **Zone 1 – RM WH (Raw Material Warehouse)** | West wing ($X \approx -110$ to $-65$, $Z \approx -22$ to $+22$) | Structured into specialized sub-warehouses:<br>1. **Cylinder WH:** Printing cylinders on horizontal racks.<br>2. **Chemical WH:** Drums of base ink, solvent, adhesive, and returned mixed ink.<br>3. **Supplies Used WH:** Paper cores, corrugated boxes, spout caps.<br>4. **Resin & Film Storage:** Polymer resin sacks and purchased/blown film rolls. | **RM Forklift** delivers materials from RM WH sub-warehouses along the Central Highway to PRD station Infeed bays. |
| **Zone 2 – PRD (Production Floor)** | Center floor ($X \approx -65$ to $+65$, $Z \approx -22$ to $+22$) | **Two-row layout (Row 1 North, Row 2 South)** with a wide Central Transit Highway ($Z = 0.0$) in between: <br>• **Row 1 (North, $Z = -12.0$):** Blown Film ($X=-45$), Printing ($X=-15$), Bag Making ($X=+15$), Spout ($X=+45$)<br>• **Row 2 (South, $Z = +12.0$):** Ink Mix ($X=-45$), **PRD WH** ($X=-15$), Laminate ($X=+15$), Slit ($X=+45$) | WIP is transported between stations and PRD WH via a **Manual Hand Pallet Truck (HPT)** with walking operator along the Central Highway. |
| **Zone 2.5 – PRD WH (Central Staging & Buffer Warehouse)** | PRD Row 2, Col 2 ($X = -15.0$, $Z = +12.0$) | **Central intermediate warehouse in the production area for holding, resting, and staging materials & WIP.** Functions as the central buffer for rolls undergoing curing/adhesive development and WIP rolls/boxes waiting for subsequent processing.<br>• **Dual Staging Yellow Demarcation Boxes:** Two hollow bright yellow outline boxes ($2.4\text{m} \times 2.4\text{m}$) directly on the concrete floor facing the Central Transit Corridor at world $Z = +5.2$ (Left = Infeed at $X = -17.4$, Right = Outfeed at $X = -12.6$).<br>• **Operator:** Standing warehouse operator centered behind the yellow boxes ($X = -15.0, Z = +7.2$) facing the corridor.<br>• **Dual Side-by-Side Selective Racks:** Two industrial racks behind the operator on a yellow equipment base pad (`#facc15`). Built with royal blue uprights (`#1d4ed8`), safety orange load beams (`#f97316`), and white shelf decking (`#f8fafc`). Lower shelves hold wooden euro-pallets with burgundy drums with white wrap-around graphic labels.<br>• **Left Printed Roll Stand:** Roll stand holding a flexible packaging printed film roll (Hygiene Expert Care pattern with pink end face and dark core).<br>• **Floating 3D Tag:** Styled pill `• PRD WH`. | Hand Pallet Truck moves rolls into PRD WH for staging/curing and transfers rested materials to subsequent production stations. |
| **Zone 3 – Warehouse FG & Yard** | East wing ($X \approx +65$ to $+130$, $Z \approx -22$ to $+22$) | **(a) FG Storage Racks:** Multilevel pallet racks for finished goods.<br>**(b) Open Truck Loading Yard ($Z = -4.0$):** Flat level concrete parking yard (no bays, no canopies, no elevated platform, no roads). Features yellow painted truck stall boundaries, wheel stop curbs, forklift loading approach lines, and container truck parked on concrete floor. | **FG Forklift** collects finished goods from Outfeed bays into FG racks; **Delivery Forklift** loads pallets directly onto the parked container truck. |

### Central Transit Corridor ($Z = 0.0$)
- High-visibility concrete thoroughfare running east-west dividing Row 1 (North / $Z = -12.0$) and Row 2 (South / $Z = +12.0$).
- Clean concrete floor at the same uniform level throughout the entire factory (no separate asphalt road mesh, no pedestrian zebra crossings).
- Yellow dashed centerline ($X = -86$ to $+82$ at $Z = 0.0$) dividing the corridor into two dedicated opposing lanes:
  - **Westbound North Lane ($Z = -1.8$):** Dedicated lane for **RM Forklift** heading towards RM WH (West / $-X$).
  - **Eastbound South Lane ($Z = +1.8$):** Dedicated lane for **Hand Pallet Truck** heading towards PRD stations, PRD WH, and FG Warehouse (East / $+X$).
  - Center-to-center distance between vehicles is $3.6\text{m}$ (with $> 2.0\text{m}$ clearance between passing vehicle bodies), ensuring 100% collision-free transit when running simultaneously in opposite directions.
- All machine infeed/outfeed demarcation boxes face this corridor directly at $Z = -5.2$ (Row 1) and $Z = +5.2$ (Row 2), leaving an 8.0-meter wide unobstructed central highway.

---

## 4. RM WH Structure & Material Catalog

RM WH is organized into dedicated functional sub-warehouses:

### A. Sub-Warehouse Classification & 4-Quadrant Visual Layout
RM WH is laid out in 4 distinct quadrants separated by a central cross-aisle with yellow floor demarcation boundaries:

1. **Top-Left / NW Quadrant – Cylinder WH (Gravure Cylinder Storage):**
   - Industrial selective rack with 4 royal blue upright corner posts (`#1d4ed8`) and dual-tier safety orange horizontal load beams (`#f97316`).
   - Slotted white storage platform deck holding **8 vertical black gravure printing cylinders** standing upright in a 2x4 grid, extending above the top rack beams.
   - 3D Tag: `Cylinder WH` floating above the rack.

2. **Top-Right / NE Quadrant – Chemical WH (Inks, Solvents & Adhesives):**
   - **4 Large Navy / Dark Slate Drums (`#1e293b`):** 2x2 grid of heavy 200L base-color ink and solvent drums with top lid rims and bung plugs.
   - **2 Teal / Green Drums (`#10b981`):** Lamination adhesives and specialty solvents.
   - **Front Row of 4 Yellow & Orange Drums:** 2 bright safety yellow drums (`#facc15`), 1 orange drum (`#f97316`), and 1 burnt orange/red drum (`#c2410c`) for ready-to-use inks and additives.
   - 3D Tag: `Chemical WH` floating above the drums.

3. **Bottom-Left / SW Quadrant – Supplies Used WH (Packaging & Operating Supplies):**
   - **Paper Core Rack:** Blue upright rack structure with orange crossbeams holding **4 brown cardboard paper cores** (`#c28b52`).
   - **Corrugated Carton Boxes:** Stack of 2 kraft cardboard boxes (`#d97706`) with crisp white central packing tape strips (`#f8fafc`).
   - **Spout Caps Tray:** Clean white molded tote/tray containing white spout fitments and caps.
   - 3D Tag: `Supplies Used WH` floating above.

4. **Bottom-Right / SE Quadrant – Resin & Film Storage (Polymers & Substrate Films):**
   - **Resin Bags:** Neatly stacked white polymer resin sacks (`#f8fafc`) in multiple layers on the left side.
   - **Vertical Standing Film Rolls:** 6 upright standing cylindrical film rolls grouped in 3 pairs with central dark core holes:
     - 2 White / Light-Grey rolls (`#f8fafc`) – Base Purchased Substrate Film
     - 2 Pastel Sky-Blue rolls (`#7dd3fc`) – In-House Blown Film
     - 2 Pastel Lavender / Light-Purple rolls (`#c4b5fd`) – Barrier / Laminate Film
   - 3D Tag: `Resin & Film Storage` floating above.

5. **Aisles & RM Forklift:**
   - Double yellow demarcation lines divide the cross-aisles ($Z = 0.0$ and $X = -86.0$).
   - Yellow RM Forklift is parked on the right-hand entrance between Chemical WH and Resin & Film Storage, facing west into the warehouse.

### B. Material Name Labels & Tags
- **In RM WH:** Floating 3D tags indicate sub-warehouse zones (`Cylinder WH`, `Chemical WH`, `Supplies Used WH`, `Resin/Film`) along with material stock quantities and units.
- **During Transport:** Every pallet on a forklift or hand pallet truck carries a dynamic 3D tag at $Y = 3.6$ displaying cargo name and quantity.
- **At Stations:** Demarcated `INFEED` and `OUTFEED` yellow-boxed bays dynamically display active input/output materials.
- **UI Toggle:** "Show material labels" checkbox allows toggling label visibility.

---

## 5. PRD WH: Central Staging & Buffer Warehouse Role

**PRD WH** ($X = -15.0, Z = +12.0$) serves as the **Central Production Staging & Buffer Warehouse (คลังกลางสำหรับวางของที่เอาไว้รอหรือพักวัตถุดิบและชิ้นงาน)**:
1. **WIP Buffer & Holding:** Accommodates intermediate products waiting for machine availability (e.g. printed rolls waiting for lamination, laminated rolls waiting for slitting).
2. **Curing & Chemical Bonding:** Houses printed and laminated film rolls under controlled room conditions to allow lamination adhesive curing and ink solvent evaporation before slitting or bag making.
3. **Staging for Sequential Steps:** Holds staging boxes and auxiliary materials close to production stations, reducing transit time along the Central Highway.
4. **Physical Layout:** Equipped with dual-level industrial selective racks (blue uprights, orange load beams), floor staging bays, and cyan traffic guide arrows.

---

## 6. Machine Models & Demarcated Infeed / Outfeed Bays

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

### B. Demarcated Infeed (Yellow Frame / Left) & Outfeed (Green Frame / Right) Bays
Every machine station (including PRD WH) features a dedicated pair of hollow outline demarcation boxes ($2.4\text{m} \times 2.4\text{m}$) directly on the clean concrete floor facing the Central Transit Corridor (Row 1 at $Z = -5.2$, Row 2 at $Z = +5.2$):
- **Left Yellow Box = `INFEED` Bay ($X = X_{\text{station}} - 2.4$):** Always on the **LEFT** with a bright Safety Yellow (`#facc15`) frame and subtle yellow floor tint. All input materials (raw materials delivered by RM Forklift or WIP rolls from upstream stations / PRD WH) **MUST enter and drop at this yellow frame**.
- **Right Green Box = `OUTFEED` Bay ($X = X_{\text{station}} + 2.4$):** Always on the **RIGHT** with a bright Safety Green (`#22c55e`) frame and subtle green floor tint. When output/produced goods are dispatched anywhere (transferred to the next station, PRD WH buffer, returned to RM WH, or collected by FG Forklift into Warehouse FG), **they MUST depart from / be picked up from this green frame only**.
- **Station Operator:** Stands centered directly behind the two demarcation boxes facing the central corridor ($Z = -7.2$ for Row 1 facing South, $Z = +7.2$ for Row 2 facing North).
- **Floor & Cargo Appearance:** Hollow frame sitting on clean concrete. Empty boxes display the clean concrete floor with translucent epoxy tint; populated boxes hold wooden euro-pallets with authentic 3D materials (e.g. Blown Film Outfeed and Ink Mix Outfeed). Floating 3D tags `In: ...` and `Out: ...` hover directly over their respective demarcation boxes.

---

## 7. Production Processes & Routing

| # | Process Station | Location | Inputs (from RM WH / PRD WH) | Processing Action | Output (to PRD WH / RM WH / FG) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Blown Film** | Row 1, Col 1 ($X=-45, Z=-12$) | Resin bags (Resin Storage) | Melt & blow plastic bubble into tubular film | Blown Film roll $\rightarrow$ Stored in RM WH |
| **2** | **Ink Mix** | Row 2, Col 1 ($X=-45, Z=+12$) | Base ink drums, Solvent (Chemical WH) | Blend and color-match ink formula | Ready-to-use Ink $\rightarrow$ Stored in Chemical WH |
| **3** | **Printing** | Row 1, Col 2 ($X=-15, Z=-12$) | Film roll (Purchased or Blown), Cylinder (Cylinder WH), Ink & Solvent (Chemical WH) | Multi-color rotogravure printing | Printing Roll $\rightarrow$ Staged/Cured in **PRD WH** |
| **4** | **Laminate** | Row 2, Col 3 ($X=+15, Z=+12$) | Printed Roll (from PRD WH), Laminate Film, Adhesive (Chemical WH) | Dry-bond lamination of barrier layers | Laminate Roll $\rightarrow$ Curing in **PRD WH** |
| **5** | **Slit** | Row 2, Col 4 ($X=+45, Z=+12$) | Cured Laminate Roll (from PRD WH), Papercores (Supplies Used WH) | Rotary slitting into custom widths | Slit Rolls (packed in boxes or rolls) |
| **6** | **Bag** | Row 1, Col 3 ($X=+15, Z=-12$) | Slit Roll (from PRD WH / Slit), Boxes (Supplies Used WH) | Pouch forming, side/bottom sealing | Stand-up Pouches (in cartons) |
| **7** | **Spout** | Row 1, Col 4 ($X=+45, Z=-12$) | Pouches from Bag, Spout caps & Boxes (Supplies Used WH) | Ultrasonic welding of spout fitment | Spouted Pouches (in cartons) |
| **8** | **Warehouse FG** | FG Wing ($X=+75, Z=0$) | Finished Goods from PRD | Palletized storage in FG racks | Pallets loaded into Container Truck |

### Film Source Routing
- **In-house Blown Film:** Blown Film process runs first (consuming resin); extruded rolls return to RM WH before issuance to Printing.
- **Purchased Film:** Blown Film step is **skipped** (greyed in stepper, 0 resin consumed); Printing directly draws **Purchased Film** rolls from RM WH.

### Product Routing
- **FG Roll:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ PRD WH (Staging) $\rightarrow$ Laminate $\rightarrow$ PRD WH (Curing) $\rightarrow$ Slit $\rightarrow$ Warehouse FG.
- **FG Bag:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ PRD WH $\rightarrow$ Laminate $\rightarrow$ PRD WH $\rightarrow$ Slit $\rightarrow$ Bag $\rightarrow$ Warehouse FG.
- **FG Spout:** Blown Film + Ink Mix $\rightarrow$ Printing $\rightarrow$ PRD WH $\rightarrow$ Laminate $\rightarrow$ PRD WH $\rightarrow$ Slit $\rightarrow$ Bag $\rightarrow$ Spout $\rightarrow$ Warehouse FG.

---

## 8. Simulation Modes & User Interface Controls

### A. Dual Simulation Engines: `Flow Only` vs `Flow Details`

The top of the Order Panel features a dedicated mode switcher tab bar:

#### 1. Mode: Flow Only (Non-Linear / Concurrent Digital Twin)
- **Concept:** Continuous, non-blocking pipelined factory operations.
- **Concurrent Vehicle Movement:**
  - RM Forklift, Hand Pallet Truck, FG Forklift, and Delivery Forklift operate concurrently without waiting for sequential blocking steps.
  - Vehicles navigate the Central Highway corridor ($Z = 0.0$) using dynamic right-of-way and priority passing to prevent collisions.
- **Parallel Machine Processing:**
  - As soon as a station's `INFEED` bay contains required materials, it transitions into `RUNNING` status with rotating cylinders, running webs, and animated workers.
  - Upstream and downstream stations can operate simultaneously (e.g. Blown Film and Printing operating concurrently while Lamination cures in PRD WH).
- **PRD WH Dynamic Staging:**
  - Multiple rolls can be staged in PRD WH racks at the same time, visually demonstrating queueing, buffer capacity, and curing hold time.
- **Delivery Yard Dispatch Cycling:**
  - The container truck receives pallet loads directly from the delivery forklift in the yard and departs in continuous logistical dispatch cycles across the concrete yard.
- **Clean Visual Presentation:**
  - Hides numeric waste calculation tables, inventory ledger rows, and timestamped event logs for a full-immersion 3D digital twin presentation.

#### 2. Mode: Flow Details (Linear / Step-by-Step ERP Ledger)
- **Concept:** Granular, deterministic ERP order tracking.
- **Strict Sequential Order Execution:**
  - Follows explicit step-by-step route progression (Step 1 $\rightarrow$ Step 2 $\rightarrow$ ... $\rightarrow$ Step 8).
  - One task executes at a time with exact cargo weight and quantity tracking.
- **Full ERP Controls & Visibility:**
  - Reveals granular parameter controls: Pieces per box, Roll spec conversions (length/weight), Skip Slit toggle, and per-station Waste % inputs.
  - Displays the full Station Waste Table, Real-time RM Inventory Ledger, and chronological Event Log recording every pallet transport and deduction.

### B. Theme Switcher & Persistence
- **3-State Theme Toggle:** Light (`light`), Dark (`dark`), or System (`system`).
- **Persistence:** Remembers user selection in `localStorage` (`starflex_erp_theme`) and restores it upon reload. Automatically adjusts 3D scene background, fog, grid, and ambient lighting.

### C. Panels Visibility Toggle
- **Collapsible Panels Button:** Floating action button (`#togglePanelsBtn`) in the top bar to toggle visibility of floating UI panels (`#orderPanel`, `#detailPanel`), providing an unobstructed full-screen view of the 3D plant.

### D. Simulation Playback & Speed Controls
- **Combined Start / Pause Button:** Single button that dynamically toggles between Start (Play icon) and Pause (Pause icon) with appropriate status-based color styling.
- **Reset Button:** Styled with an outline red accent (`btn-outline-danger`) to prevent accidental clicks.
- **Default Speed:** Defaults to **1.0x** on page load with speed multiplier buttons (0.5x, 1x, 2x, 4x).
- **Keyboard Shortcut:** Pressing the **Spacebar** triggers Start, Pause, or Resume simulation.

### E. Unified Bottom Stepper & Zone Bar
- Interactive zone quick-focus chips (`All Factory`, `RM WH`, `PRD Line`, `PRD WH`, `Warehouse FG & Dock`).
- Visual process stepper node chain showing real-time execution status (Idle, Active, Done, or Skipped).
- **Interactive Camera Focus & Inspector Sync:** Clicking any zone chip or process step node (`1. Blown Film` through `9. Delivered`):
  - Smoothly interpolates the 3D camera to frame the selected equipment, buffer, or yard at an un-occluded isometric angle with designated zoom radius, elevation phi, and azimuth theta.
  - Automatically deactivates vehicle follow mode (`followFlow = false`) so manual focus remains locked on the target.
  - Displays a high-contrast glowing safety-yellow focus ring (`.focused-cam` / `.zone-chip.active`) around the focused chip or step.
  - Updates the top **Process Focus Banner** with stage summary, input materials, and output goods.
  - Populates the right-hand **Inspector Panel** with machine specs, live runtime status, and material handling details.
  - Utilizes delegated click listeners and persistent DOM elements (zero DOM thrashing during animation frames) ensuring clicks always register instantly.

---

## 9. Technical Architecture & Constraints

- **Pure Client-Side:** Single HTML file containing inline CSS and JavaScript.
- **Three.js:** r128 UMD loaded via CDN (`cdnjs.cloudflare.com`). No external loaders (GLTFLoader, OrbitControls) required; all geometry and pointer controls are custom-coded with Three.js primitives and pointer events.
- **Responsive Layout:** Adaptive safe-area inset padding for desktop, tablet, and mobile views.
- **Zero Collision Navigation:** Explicit waypoint arrays for all vehicle routes (RM Forklift, Hand Pallet Truck, FG Forklift, Delivery Forklift, Container Truck) utilizing the $Z = 0.0$ Central Highway corridor.

---

## 10. Authentic Packaging Pattern & Continuous Downstream Flow

- **Photorealistic Packaging Graphics (Hygiene Expert Care Refill Pouch):**
  - Modeled faithfully after real gravure printed flexible packaging film (`media_1792566882965_84548cc7.jpg`):
    - **Back Panel:** Vibrant fuchsia / magenta gradient (`#be185d`), Thai oval brand badge "ไฮยีน", user instruction text, washing machine icons, crisp black-and-white barcode block, CMYK color registration test marks, and photo-electric optical eye-marks along web margins.
    - **Front Panel:** Sweeping sky blue / cyan to pearlescent white gradient (`#0284c7` $\rightarrow$ `#38bdf8` $\rightarrow$ `#ffffff`), curved golden divider ribbons, deep royal navy "Hygiene" cursive script logo with white halo, golden 8X Freshness quality rosette, blooming pink-ruby rose bouquet, and bottom "REFILL 500 ml" badge.
    - **Roll Winding Faces:** Soft blush pink (`#fbcfe8`) circular concentric wound edge faces with dark steel core shaft.
- **Continuous Product Flow Through Downstream Operations:**
  1. **ST_PRINT (Printing):** Output rewinder roll and outgoing film web display the Hygiene printed pattern.
  2. **ZONE_PRD_WH (Buffer & Curing):** The staging roll stand and staged rolls feature the Hygiene printed roll model.
  3. **ST_LAM (Lamination):** Primary unwinder feeds the Hygiene printed roll; rewinder outputs high-gloss laminated barrier Hygiene rolls.
  4. **ST_SLIT (Slitting):** Master unwinder feeds the laminated Hygiene roll; outfeed produces 4 narrow slit Hygiene rolls, and the staging pallet holds 3 upright slit rolls.
  5. **ST_BAG (Bag Making):** Unwinds slit Hygiene film and forms authentic **Hygiene Stand-up Refill Pouches** with magenta body, gusset, top seal, and full graphics along the conveyor and packed into outfeed cartons.
  6. **ST_SPOUT (Spout Applicator):** Infeed receives Hygiene refill pouches; ultrasonic welder attaches green corner screw caps, outputting finished **Hygiene Spout Pouches**.
  7. **ZONE_FG & Dispatch:** Finished goods storage racks, forklifts, and container truck transport pallets holding boxed Hygiene pouches and rolls.

---

## 11. Authentic Horizontal Resin Sack Models & Interlocking Pallet Stacks

- **25kg Industrial Polymer Resin Valve Sacks Lying Horizontally:**
  - Faithfully modeled after authentic industrial petrochemical resin sack packaging (`media_1792574981508_08358252.png`).
  - **Procedural Canvas Texture:**
    - High-density virgin woven polypropylene fabric background (`#f8fafc`) with subtle woven crosshatch grid lines (`#e2e8f0`).
    - High-contrast industrial Royal Blue brand banner (`#1d4ed8` $\rightarrow$ `#1e40af`) with sky-blue accent line across the sack face.
    - Crisp typography: bold white "POLYMER RESIN", "VIRGIN PELLETS • BLOWN FILM GRADE", dark slate "NET WT. 25.0 KG (55.1 LBS)", batch lot code "LOT: 2026-HDPE-9942A | MFI: 2.1 g/10min", and recycling polymer code `[PE-HD 02]`.
    - End seam industrial blue crepe tape backing with dashed red stitch thread indicators.
  - **Organic Pillowed Sack Form:**
    - Pillowed cushion core (`BoxGeometry(0.99m, 0.18m, 0.54m)`) displaying the printed packaging on top.
    - Soft bulging side rounding cylinders along the length for organic filled-sack curvature.
    - Pinched sewn seam flanges and royal-blue crepe tape at both ends.
- **Interlocking Pallet Stack Configuration:**
  - Placed neatly on standard wooden Euro pallets (`2.4m x 0.26m x 2.0m`) rather than resting directly on the concrete floor.
  - **Layer 1 (Bottom):** 6 horizontal sacks arranged along the X axis ($2 \times 3$ grid).
  - **Layer 2:** 6 horizontal sacks cross-stacked along the Z axis (rotated $90^\circ$ for authentic interlocking anti-topple binding).
  - **Layer 3:** 6 horizontal sacks along the X axis.
  - **Layer 4 (Top):** 4 horizontal sacks cross-stacked on top, completing a realistic 22-sack pallet load.
- **Applied Universally Across the Factory:**
  - **RM Warehouse (SE Quadrant):** Replaced the crude white rectangular block steps with two full wooden pallet stacks of horizontal resin sacks (`Pallet 1` and `Pallet 2`), dynamically tied to inventory stock counts (`resinStock`).
  - **Cargo Transport:** Transported by RM Forklift and Hand Pallet Truck as realistic horizontal sack stacks from RM Warehouse to Blown Film machine infeed bays.

---

## 12. RM WH 1-Row Industrial Racking & Floor Storage Layout

- **1 Row of Racks & Direct Floor Storage Configuration (`media_1792574981508_08358252.png`):**
  - **1 Row of Multi-Tier Steel Racks (West Side):**
    - High-durability blue upright corner posts (`0x1d4ed8`), safety-orange horizontal load beams (`0xf97316`), and 3 white shelf decks (`0xf8fafc`).
    - Lower tier ($y = 1.20\text{m}$) and middle tier ($y = 2.60\text{m}$) shelves hold 2 rows of standing brown kraft paper core cylinders (`PAPERCORE`) with dark hollow cores.
    - Aligned in a single neat row along the West side of RM WH.
  - **Goods Placed Directly on the Floor:**
    - **Corrugated Cardboard Boxes (`BOX`):** Stack of 3 kraft boxes (`2.4m x 0.52m x 2.0m`) placed directly on the concrete floor immediately to the right of the rack, featuring white center sealing tape across the top.
    - **White Supply Fitment Boxes (`SPOUT`):** Stack of 2 white rectangular boxes (`1.8m x 0.52m x 1.6m`) placed directly on the floor to the right of the cardboard boxes.
    - **Resin & Substrate Films:** Pallets of horizontal resin sacks and vertical standing rolls positioned on the floor across the aisle.
    - **Liquid Chemicals:** Base ink, solvent, and adhesive drums placed directly on the floor in the chemical storage quadrant.

---

## 13. Dynamic Material Bay Animation Details & Speed Regulation

- **3 Core Realism Animation Rules:**
  1. **RM Vehicles Unload Cargo Directly into the Yellow Infeed Bay:**
     - Whenever transport equipment (RM Forklift or Hand Pallet Truck) brings raw materials (resin sacks, ink drums, substrate film rolls, adhesive drums, paper cores, carton boxes, spout fitments) from RM WH to a processing station's Infeed Bay (left hollow yellow demarcation frame `0xfacc15`), the cargo unmounts from the vehicle (`mountCargoOnVehicle(veh, null, [])`) and appears situated inside the Yellow Infeed bay (`setBayCargo(st.infeedBay, matKey)`). The transport vehicle becomes empty to return or begin its next route.
  2. **Subsequent Transports Lift Cargo and Clear the Green Outfeed Bay Immediately:**
     - When a processing stage finishes, its output goods are placed into the station's Outfeed Bay (right hollow green demarcation frame `0x22c55e`).
     - As soon as a downstream vehicle or operator picks up goods from the green Outfeed frame to deliver to the next processing stage or warehouse racks, the goods disappear from the green Outfeed Bay immediately (`clearBayCargo(st.outfeedBay)`) and mount onto the moving vehicle forks or operator truck.
  3. **Dual Machine Operational Speeds (Idle Gentle Rotation vs Active Fast Production):**
     - Dynamic check via `isStationInputReady(stationId)` (returns true if input materials exist in the yellow Infeed bay or station status is `RUNNING`):
     - **Waiting / No Input (Yellow bay empty and status IDLE):**
       - Rollers and shafts rotate gently at slow idle speed (`dt * 1.0` rad/s) for baseline mechanism lubrication.
       - Reciprocators remain at base height (`baseY`).
       - Operators stand ready with arms relaxed, and status beacon shows neutral slate gray (`#94a3b8`).
     - **Input Ready / Running (Yellow bay contains cargo or status is RUNNING):**
       - Machine immediately accelerates to high production speed (`scaledDt * 7.2` rad/s).
       - All rollers spin rapidly clockwise.
       - Reciprocating seal bars and printing cylinders reciprocate dynamically (`Math.sin(nowSec * 14) * 0.16`).
       - Machine operators actively animate arms operating control levers, and the status beacon illuminates bright green (`#22c55e`).

---

## 14. Multi-Layer Blown Film Extrusion Line Architecture & White Unprinted Film Specification

- **Bespoke Multi-Layer Blown Film Extrusion Line (`media_1792577328506_4e13179b.png`):**
  - **Co-Extrusion System & Gravimetric Dosing Feeder (Right Side +X):**
    - 3 parallel horizontal extruder barrels wrapped in royal blue thermal insulation jackets (`#1e40af`) with chrome heater bands, driven by rear AC induction motors and heavy reduction gearboxes.
    - Above each barrel throat sits a gravimetric loss-in-weight blending station featuring 4 vertical stainless feeder cylinders (12 dosing cylinders total) with blue caps.
    - Heated melt pipes curve into the central die head.
  - **3 Stacked Horizontal Resin Sacks:**
    - 3 authentic 25kg polymer resin valve sacks (`createSingleResinSack`) stacked neatly on the concrete pad right beside the extruder feed throat (2 bottom, 1 on top).
  - **Extrusion Die & Aerodynamic Cooling Ring:**
    - Heavy cylindrical die base and spiral die head.
    - High-efficiency dual-lip air ring in royal blue with chrome lips and 4 directional air blower distribution ducts.
    - Lower stabilizing cage with 3 blue circular hoops, 8 vertical Teflon guide rollers, and blue spiral helix surrounding the lower bubble.
    - Mid-level motorized calibration basket (IBC sizing cage) with 8 radial adjustment arms and silicone contact rollers, plus ultrasonic thickness gauge scanner ring.
  - **White Tubular Film Bubble:**
    - Translucent white virgin polymer bubble (`#ffffff`, `opacity: 0.60`) expanding from the air ring up to the tower summit.
  - **Haul-Off Mezzanine & Collapsing Frame:**
    - Top mezzanine platform deck with blue safety handrails.
    - Inverted V-shaped A-frame collapsing boards with horizontal composite roller slats pressing the round bubble flat.
    - Driven chrome/rubber top haul-off nip rollers and oscillating haul-off drive.
  - **Descending Zig-Zag Dancer Web Path:**
    - Flat white film web exits the top nip rollers horizontally, then weaves down a vertical ladder frame across 5 alternating idler rollers in a zig-zag cooling path, leading over a bridge to the winder.
  - **Dual Turret Surface Winder (Left Side -X):**
    - White industrial cabinet frames with royal blue chamfered accent trims, front HMI touchscreen console, contact lay-on roller, secondary standby air shaft, and active wound roll.
- **Pure White Film Roll Requirement (All Pre-Printed Film Rolls):**
  - **The wound film roll output by the Blown Film machine MUST BE PURE WHITE ONLY (`#ffffff`).**
  - **All film rolls that have not yet passed through the Printing process MUST BE PURE WHITE (`#ffffff` / `#f8fafc`):**
    - Blown Film rolls stored in RM WH
    - Purchased Substrate Film rolls stored in RM WH
    - Raw film rolls transported by forklifts/pallet trucks before printing
    - The active film roll mounted on the Printing machine Unwinder (Station 3)
    - The incoming film web feeding into the printing towers before ink application
- **Station Base Pad Removal (`media_1792580255743_2e7de20c.png`):**
  - The dark grey raised rectangular base slab (`baseMesh`, 14.0 wide x 8.4 deep x 0.32 high) under the machinery has been completely removed across all process stations.
  - Machinery models now stand cleanly directly on the factory concrete floor, matching the user reference photo where the dark pad was circled in red to be deleted.
  - Demarcated yellow Infeed bays and green Outfeed bays remain clearly painted on the floor.
- **Event-Driven Machine Operating Logic & Material Prerequisites:**
  - **Prerequisite Input Check (Requirement 1):**
    - A machine will NOT run its production cycle if its dedicated yellow Infeed Bay is empty.
    - While waiting for input, the station operates in gentle idle mode (rollers spin slowly at 1.0 rad/s, beacon remains grey, worker does not animate).
    - Once material is deposited into the yellow Infeed Bay by transport vehicles (RM Forklift or Hand Pallet Truck), the machine immediately begins its active processing cycle (accelerating to fast production speed at 7.2 rad/s, beacon turns green, worker animates).
  - **Downstream Waiting for Output Completion (Requirement 2):**
    - Downstream transport vehicles (Hand Pallet Truck or FG Forklift) cannot transfer material to the next process until the upstream station's output is actually finished and deposited into the green Outfeed Bay.
    - If the vehicle arrives or is queued to pick up before output is ready, it waits at the dock / station.
    - Once output is produced into the green Outfeed Bay, the vehicle collects the cargo, clears the green bay, and transports it to the next station's yellow Infeed Bay or the FG warehouse racks.
  - **Configurable Machine Cycle Durations (Requirement 3):**
    - Each machine has two user-configurable operational durations in minutes:
      - `inputMin`: Time (in minutes) from cycle start until input material in the yellow bay is completely consumed and cleared.
      - `outputMin`: Time (in minutes) from cycle start until finished output material is produced and deposited into the green Outfeed Bay.
    - Default Station Timing Map:
      - Blown Film: 15 min input, 18 min output
      - Ink Mix: 10 min input, 12 min output
      - Printing: 20 min input, 25 min output
      - Laminate: 18 min input, 22 min output
      - Slit: 12 min input, 15 min output
      - Bag: 15 min input, 20 min output
      - Spout: 12 min input, 16 min output
    - Configurable in:
      - Left Control Panel: `#stationTimingGrid` with dedicated number inputs for `In (min)` and `Out (min)` per active station, plus "Reset default" button.
      - Inspector Panel: Editable `Input Consumed` and `Output Ready` minute inputs, with live countdown status (`⚡ RUNNING`, `Infeed consuming (Xm left)`, `Output ready in Ym`).
    - Seamlessly implemented across both Dual Engines: Linear Step-by-Step Order Queue and Concurrent Digital Twin Pipeline.
