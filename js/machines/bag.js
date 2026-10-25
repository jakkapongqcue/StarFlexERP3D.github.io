/* =========================================================================
   StarFlexERP 3D - Authentic Stand-Up Pouch Bag Making Machine (ST_BAG)
   Upgraded 5-Stage Converting Line based on Factory Reference Photos 1–5:
   1. Unwind & Festoon Tension Dancer System (นำม้วนฟิล์มใหญ่มาทำให้มี Tension ที่เหมาะสม):
      - Heavy stepped matte-black steel side frames (#15181e)
      - Upper Jumbo Master Printed Film Roll + Lower Secondary Gusset Roll with brake disc
      - Multi-roller vertical festoon tension dancer accumulator (6 upper + 6 lower rollers)
        with multi-pass weaving film web & reciprocating tension dancer bar
      - Side-mounted brushed stainless steel control cabinet with pushbuttons & air tubes
      - Upper black bridge beam with 5 circular lightening cutouts, 45° turn-bars & photocell sensor
   2. Triangular V-Plow Forming Assembly (นำไปขึ้นรูปซอง):
      - Brushed stainless steel triangular forming plow (V-folder) & bottom gusset former
      - 3D angled film web wrapping over the V-plow into a folded multi-layer pouch web
   3. 4-Station Heat Sealing & Cooling Press (และ Seal ประกบ):
      - Brushed stainless steel modular lower cabinet with 4 access doors
      - 4 heavy black reciprocating heat-sealing bridges (Longitudinal + Cross Seal + Chill Bar)
      - Dual top compression coil springs, pneumatic actuators & 4 front black spoked handwheels
   4. Edge-Trim Slitter, Scrap Extraction & Guillotine Cutter (และตัดส่วนไม่จำเป็นออก):
      - Rotary edge-trim shear knives separating excess film margins
      - Visible trimmed waste strip sucked through spiral extraction hose into trim waste bin
      - Enclosed brushed stainless steel cutter hood with side knobs & blue static-eliminator bar
   5. Green Belt Outfeed Conveyor & End-of-Line Operator (และออกมาตามสายพาน ที่มีพนักงานยืนอยู่ปลายทาง):
      - White articulated cantilever swing-arm with vertical HMI cabinet & flexible conduit
      - Stainless steel conveyor table with green elastic cord transfer & green PVC flat belt
      - Pair of bright blue corrugated guide baffles & white cardboard box on side ledge
      - Shingled stream of finished pouches moving to the end of the conveyor
      - Operator standing at the end of the conveyor inspecting & packing pouches into cartons
   ========================================================================= */

function buildBagMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Authentic Industrial Materials
  const stainlessSteel = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.32, metalness: 0.68 });
  const brushedSteel = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.26, metalness: 0.75 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const frameBlack = new THREE.MeshLambertMaterial({ color: 0x14171f });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.16, metalness: 0.88 });
  const bronzeRollMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.28, metalness: 0.78 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.30, metalness: 0.75 });
  const rubberBlack = new THREE.MeshLambertMaterial({ color: 0x111827 });
  const conveyorGreen = new THREE.MeshLambertMaterial({ color: 0x15803d }); // Photo 4 & 5 green PVC belt
  const blueBaffleMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }); // Photo 4 & 5 bright blue guide baffles
  const staticBarBlue = new THREE.MeshLambertMaterial({ color: 0x0284c7 }); // Photo 4 blue static bar on cutter
  const orangeSealMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });
  const whiteArmMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const yellowHoseMat = new THREE.MeshLambertMaterial({ color: 0xeab308 });
  const redMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
  const greenBtnMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });

  const filmTex = getHygieneFilmTexture();
  const printedWebMat = new THREE.MeshStandardMaterial({
    map: filmTex,
    roughness: 0.28,
    metalness: 0.14,
    side: THREE.DoubleSide
  });
  const silverFoilWebMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.20,
    metalness: 0.82,
    side: THREE.DoubleSide
  });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (typeof sceneObjects !== 'undefined' && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  /* =========================================================================
     STAGE 1: UNWIND STAND & MULTI-ROLLER FESTOON TENSION DANCER TOWER
     (Photo 1 & 2: x = -5.0 to -2.7)
     "นำม้วน film ใหญ่มาทำให้มี tension ที่เหมาะ"
     ========================================================================= */
  const unwindGroup = new THREE.Group();
  const towerW = 1.72;
  const halfW = towerW / 2;

  // 1A. Heavy Stepped Matte-Black Side Frames (Photo 1 profile)
  [-halfW + 0.06, halfW - 0.06].forEach(function (fz) {
    // Tall Rear Dancer Accumulator Tower Plate (x = -3.75 to -2.75, height = 2.48m)
    const rearTowerPlate = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.48, 0.08), frameBlack));
    rearTowerPlate.position.set(-3.25, 1.24, fz);
    unwindGroup.add(rearTowerPlate);

    // Vertical Chrome Linear Guide Shaft & Pneumatic Cylinder on tower side (Photo 1)
    const guideRod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 2.25, 12), chromeMat);
    guideRod.position.set(-3.05, 1.20, fz + (fz > 0 ? 0.06 : -0.06));
    unwindGroup.add(guideRod);

    // Stepped Mid-Upper Unwind Support Arm (x = -4.65 to -3.65, y = 0.85 to 1.65)
    const upperStepPlate = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.78, 0.08), frameBlack));
    upperStepPlate.position.set(-4.15, 1.26, fz);
    unwindGroup.add(upperStepPlate);

    // Lower Unwind Support Base Frame (x = -4.95 to -3.65, y = 0.06 to 0.86)
    const lowerStepPlate = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.80, 0.08), frameBlack);
    lowerStepPlate.position.set(-4.30, 0.46, fz);
    unwindGroup.add(lowerStepPlate);

    // Circular inspection hole ring in side plate (visible in Photo 1)
    const sideHole = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 16), brassMat);
    sideHole.rotation.x = Math.PI / 2;
    sideHole.position.set(-3.95, 1.45, fz);
    unwindGroup.add(sideHole);

    // Silver Leveling Feet under unwind frame
    [-4.80, -3.70, -2.85].forEach(function (lx) {
      const footPad = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.04, 14), chromeMat);
      footPad.position.set(lx, 0.02, fz);
      unwindGroup.add(footPad);
    });
  });

  // 1B. Upper Black Bridge Beam with 5 Circular Lightening Cutouts (Photo 2)
  const holeBridge = new THREE.Group();
  holeBridge.position.set(-2.78, 2.22, 0);
  const bridgeWeb = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.30, towerW - 0.08), frameBlack);
  holeBridge.add(bridgeWeb);
  [-0.60, -0.30, 0.0, 0.30, 0.60].forEach(function (hz) {
    const cutoutRim = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.13, 18), darkSteel);
    cutoutRim.rotation.x = Math.PI / 2;
    cutoutRim.position.set(0, 0, hz);
    holeBridge.add(cutoutRim);
    const cutoutVoid = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.135, 16), chromeMat);
    cutoutVoid.rotation.x = Math.PI / 2;
    cutoutVoid.position.set(0, 0, hz);
    holeBridge.add(cutoutVoid);
  });
  unwindGroup.add(holeBridge);

  // 1C. Upper Jumbo Master Printed Film Roll (Photo 1: Large roll at x = -4.35, y = 1.52)
  const mainAirShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, towerW + 0.16, 18), chromeMat);
  mainAirShaft.rotation.x = Math.PI / 2;
  mainAirShaft.position.set(-4.35, 1.52, 0);
  unwindGroup.add(mainAirShaft);

  const jumboRoll = createActiveFilmRollAssembly(
    0.56,
    1.38,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    filmTex,
    0xfbcfe8
  );
  tagSelectable(jumboRoll.bodyMesh);
  jumboRoll.group.position.set(-4.35, 1.52, 0);
  unwindGroup.add(jumboRoll.group);
  rollersOut.push(jumboRoll.group);
  if (typeof sceneObjects !== 'undefined' && sceneObjects.dynamicRollRefs && sceneObjects.dynamicRollRefs.bagUnwindRolls) {
    sceneObjects.dynamicRollRefs.bagUnwindRolls.push(jumboRoll);
  }

  // 1D. Lower Secondary Gusset Film Roll & Ventilated Brake Disc (Photo 1: x = -4.48, y = 0.50)
  const lowerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, towerW + 0.18, 16), darkSteel);
  lowerShaft.rotation.x = Math.PI / 2;
  lowerShaft.position.set(-4.48, 0.50, 0);
  unwindGroup.add(lowerShaft);

  // Ventilated brake rotor on far end of lower shaft (Photo 1 right side)
  const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 20), brushedSteel);
  brakeDisc.rotation.x = Math.PI / 2;
  brakeDisc.position.set(-4.48, 0.50, -halfW + 0.16);
  unwindGroup.add(brakeDisc);

  const secondaryRoll = createActiveFilmRollAssembly(
    0.22,
    0.92,
    0xbe185d,
    0xd97706,
    0x1e293b,
    filmTex,
    0xfbcfe8
  );
  secondaryRoll.group.position.set(-4.48, 0.50, 0);
  unwindGroup.add(secondaryRoll.group);
  rollersOut.push(secondaryRoll.group);

  // 1E. Multi-Roller Festoon Tension Dancer Accumulator Bank (Photo 1: 6 upper + 6 lower bronze/chrome rollers)
  const festoonXPositions = [-3.62, -3.48, -3.34, -3.20, -3.06, -2.92];
  festoonXPositions.forEach(function (rx, idx) {
    // Upper stationary accumulator roller
    const upRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, towerW - 0.18, 14),
      idx % 2 === 0 ? bronzeRollMat : chromeMat
    );
    upRoll.rotation.x = Math.PI / 2;
    upRoll.position.set(rx, 2.22, 0);
    unwindGroup.add(upRoll);
  });

  // Lower Floating Dancer Roller Carriage (reciprocates vertically to maintain constant web tension)
  const dancerCarriage = new THREE.Group();
  dancerCarriage.position.set(0, 0.68, 0);
  festoonXPositions.forEach(function (rx) {
    const lowRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, towerW - 0.18, 14), bronzeRollMat);
    lowRoll.rotation.x = Math.PI / 2;
    lowRoll.position.set(rx, 0, 0);
    dancerCarriage.add(lowRoll);
  });
  unwindGroup.add(dancerCarriage);
  reciprocatorsOut.push({ mesh: dancerCarriage, baseY: 0.68 });

  // Vertical Weaving Film Web Spans inside the Festoon Tension Tower (Photo 1 silver & printed web)
  for (let i = 0; i < festoonXPositions.length; i++) {
    const spanX = festoonXPositions[i];
    const spanMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.36, 1.52),
      i % 2 === 0 ? silverFoilWebMat : printedWebMat
    );
    spanMesh.rotation.y = Math.PI / 2;
    spanMesh.position.set(spanX, 1.45, 0);
    unwindGroup.add(spanMesh);
  }

  // Infeed Film Web from Upper Jumbo Roll into Tension Tower
  const infeedWebUpper = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.82), silverFoilWebMat);
  infeedWebUpper.rotation.y = Math.PI / 2;
  infeedWebUpper.rotation.z = -0.72;
  infeedWebUpper.position.set(-3.98, 2.02, 0);
  unwindGroup.add(infeedWebUpper);

  // Infeed Film Web from Lower Secondary Roll into Tension Rollers
  const infeedWebLower = new THREE.Mesh(new THREE.PlaneGeometry(0.90, 0.68), silverFoilWebMat);
  infeedWebLower.rotation.y = Math.PI / 2;
  infeedWebLower.rotation.z = 0.45;
  infeedWebLower.position.set(-4.15, 0.78, 0);
  unwindGroup.add(infeedWebLower);

  // 1F. Side-Mounted Brushed Stainless Steel Control Box on Unwind Frame (Photo 1 bottom-left)
  const unwindCtrlBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.52, 0.26), brushedSteel));
  unwindCtrlBox.position.set(-3.88, 0.58, halfW + 0.11);
  unwindGroup.add(unwindCtrlBox);

  // 6 Pushbuttons & Switches on top of the stainless control box (Photo 1)
  [-0.24, -0.14, -0.04, 0.06, 0.16, 0.26].forEach(function (bx, bIdx) {
    const btnColor = bIdx === 0 ? 0x16a34a : (bIdx === 1 ? 0xdc2626 : 0x1e293b);
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.025, 12),
      new THREE.MeshLambertMaterial({ color: btnColor })
    );
    btn.position.set(-3.88 + bx, 0.85, halfW + 0.12);
    unwindGroup.add(btn);
  });

  // 1G. Diagonal 45° Turn-Bars, Nip Rollers & Photocell Sensor (Photo 2: x = -2.75)
  [-0.38, 0.38].forEach(function (tz) {
    const turnBar = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.95, 16), chromeMat);
    turnBar.position.set(-2.65, 1.65, tz);
    turnBar.rotation.z = 0.65;
    turnBar.rotation.x = tz > 0 ? 0.45 : -0.45;
    unwindGroup.add(turnBar);
  });

  // Dual Black Rubber Pull/Nip Rollers with Chrome Adjustment Lever (Photo 2)
  [1.22, 1.35].forEach(function (ny) {
    const nipRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.42, 18), rubberBlack);
    nipRoll.rotation.x = Math.PI / 2;
    nipRoll.position.set(-2.72, ny, 0);
    unwindGroup.add(nipRoll);
  });

  // Optical Registration Photocell Sensor on yellow guide block (Photo 2)
  const sensorBlock = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.10), yellowHoseMat);
  sensorBlock.position.set(-2.55, 1.08, 0.38);
  unwindGroup.add(sensorBlock);

  mGroup.add(unwindGroup);

  /* =========================================================================
     STAGE 2: TRIANGULAR FORMING PLOW / V-FOLDER ASSEMBLY
     (Photo 3: x = -2.65 to -1.15)
     "นำไปขึ้นรูป"
     ========================================================================= */
  const formingGroup = new THREE.Group();

  // Slotted vertical support brackets holding the V-plow
  [-0.48, 0.48].forEach(function (bz) {
    const vPost = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.55, 0.07), darkSteel);
    vPost.position.set(-2.05, 1.15, bz);
    formingGroup.add(vPost);

    // Polished chrome diagonal stabilizer strut with black ball-joint clamp (Photo 3)
    const diagStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.72, 14), chromeMat);
    diagStrut.position.set(-1.85, 1.05, bz * 0.65);
    diagStrut.rotation.z = 0.55;
    diagStrut.rotation.x = bz > 0 ? -0.35 : 0.35;
    formingGroup.add(diagStrut);
  });

  // Upper & Lower Brushed Stainless Steel Converging Plow Plates (Photo 3 V-shape)
  const plowUpperBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.03), brushedSteel);
  plowUpperBar.position.set(-1.90, 1.42, 0.08);
  plowUpperBar.rotation.z = -0.38;
  formingGroup.add(plowUpperBar);

  const plowLowerBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.03), brushedSteel);
  plowLowerBar.position.set(-1.90, 0.92, 0.08);
  plowLowerBar.rotation.z = 0.22;
  formingGroup.add(plowLowerBar);

  // 3D Folding Film Web Panels converging to the V-Plow Apex at x = -1.22, y = 1.08
  const upperFoldWeb = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.78), printedWebMat);
  upperFoldWeb.position.set(-1.92, 1.38, 0);
  upperFoldWeb.rotation.x = Math.PI / 2 - 0.32;
  upperFoldWeb.rotation.y = 0.35;
  formingGroup.add(upperFoldWeb);

  const lowerFoldWeb = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.78), silverFoilWebMat);
  lowerFoldWeb.position.set(-1.92, 0.96, 0);
  lowerFoldWeb.rotation.x = Math.PI / 2 + 0.25;
  lowerFoldWeb.rotation.y = -0.22;
  formingGroup.add(lowerFoldWeb);

  // Polished Chrome Nip Rollers at the V-Plow Apex where pouch layers merge (Photo 3 right)
  [1.03, 1.13].forEach(function (ry) {
    const apexRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.18, 18), chromeMat);
    apexRoll.rotation.x = Math.PI / 2;
    apexRoll.position.set(-1.22, ry, 0);
    formingGroup.add(apexRoll);
  });

  mGroup.add(formingGroup);

  /* =========================================================================
     STAGE 3: MODULAR STAINLESS BED & 4 HEAT-SEALING / CHILL STATIONS
     (Photo 4: x = -1.15 to +1.55)
     "และ Seal ประกบ"
     ========================================================================= */
  const sealSectionGroup = new THREE.Group();
  const bedLen = 3.55;
  const bedW = 1.38;
  const bedH = 0.84;
  const bedCenterX = 0.55;

  // Dark recessed toe-kick base
  const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(bedLen, 0.08, bedW - 0.06), frameBlack);
  kickPlate.position.set(bedCenterX, 0.04, 0);
  sealSectionGroup.add(kickPlate);

  // Long Brushed Stainless Steel Lower Machine Body (Photo 4)
  const mainBed = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(bedLen, bedH - 0.08, bedW), stainlessSteel));
  mainBed.position.set(bedCenterX, 0.46, 0);
  sealSectionGroup.add(mainBed);

  // Recessed Stainless Cabinet Doors & Latches along Operator Side (z = +bedW/2)
  [-0.75, 0.05, 0.85, 1.65].forEach(function (dx) {
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.58, 0.02), brushedSteel);
    doorPanel.position.set(dx, 0.44, bedW / 2 + 0.01);
    sealSectionGroup.add(doorPanel);

    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.10, 0.03), chromeMat);
    latch.position.set(dx + 0.28, 0.44, bedW / 2 + 0.025);
    sealSectionGroup.add(latch);
  });

  // Continuous Folded Film Web running through the Sealing & Cutting Stations
  const mainPouchWeb = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.018, 0.86), printedWebMat);
  mainPouchWeb.position.set(0.50, bedH + 0.14, 0);
  sealSectionGroup.add(mainPouchWeb);

  // 4 Heavy Black Cast-Steel Reciprocating Heat-Sealing Bridges (Photo 4 top-right)
  const sealStationsX = [-0.85, -0.25, 0.35, 0.95];
  sealStationsX.forEach(function (sx, sIdx) {
    // Fixed side support uprights
    [-0.56, 0.56].forEach(function (sz) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.56, 0.08), darkSteel);
      upright.position.set(sx, bedH + 0.28, sz);
      sealSectionGroup.add(upright);
    });

    // Reciprocating Upper Sealing Head Assembly
    const sealHead = new THREE.Group();
    sealHead.position.set(sx, bedH + 0.28, 0);

    // Heavy Black Upper Press Beam
    const upperBeam = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 1.18), frameBlack));
    upperBeam.position.y = 0.08;
    sealHead.add(upperBeam);

    // Heated Brass / Silicone Sealing Jaw (or Aluminum Chill Bar on 4th station)
    const jawMat = sIdx === 3 ? brushedSteel : orangeSealMat;
    const sealJaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 1.02), jawMat);
    sealJaw.position.y = -0.04;
    sealHead.add(sealJaw);

    // Dual Silver Compression Coil Springs & Guide Studs on top of each bridge (Photo 4)
    [-0.42, 0.42].forEach(function (spz) {
      const springCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.18, 14), chromeMat);
      springCoil.position.set(0, 0.25, spz);
      sealHead.add(springCoil);

      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14), frameBlack);
      topCap.position.set(0, 0.35, spz);
      sealHead.add(topCap);
    });

    sealSectionGroup.add(sealHead);
    reciprocatorsOut.push({ mesh: sealHead, baseY: bedH + 0.28 });

    // Authentic Black Spoked Adjustment Handwheel along Operator Side (Photo 4)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(sx, bedH + 0.16, bedW / 2 + 0.12);
    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.018, 10, 20), frameBlack);
    wheelGroup.add(wheelRim);
    const wheelShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 12), chromeMat);
    wheelShaft.rotation.x = Math.PI / 2;
    wheelShaft.position.z = -0.08;
    wheelGroup.add(wheelShaft);
    const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.018), frameBlack);
    wheelGroup.add(spoke1);
    const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.18, 0.018), frameBlack);
    wheelGroup.add(spoke2);
    sealSectionGroup.add(wheelGroup);
  });

  mGroup.add(sealSectionGroup);

  /* =========================================================================
     STAGE 4: EDGE-TRIM SLITTER, SCRAP REMOVAL & GUILLOTINE CUTTER HOOD
     (Photo 4: x = +1.45 to +2.35)
     "และตัดส่วนไม่จำเป็นออก"
     ========================================================================= */
  const trimCutGroup = new THREE.Group();

  // 4A. Rotary Edge-Trim Slitter & Die-Cut Scrap Separation (x = 1.48)
  const slitterShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.16, 14), chromeMat);
  slitterShaft.rotation.x = Math.PI / 2;
  slitterShaft.position.set(1.48, bedH + 0.22, 0);
  trimCutGroup.add(slitterShaft);

  [-0.44, 0.44].forEach(function (tz) {
    // Circular Rotary Trim Knife
    const knifeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 20), chromeMat);
    knifeDisc.rotation.x = Math.PI / 2;
    knifeDisc.position.set(1.48, bedH + 0.20, tz);
    trimCutGroup.add(knifeDisc);

    // Separated Edge-Trim Waste Strip peeling downward into scrap chute
    const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.008, 0.045), printedWebMat);
    trimStrip.position.set(1.56, bedH + 0.04, tz * 1.08);
    trimStrip.rotation.z = -0.65;
    trimCutGroup.add(trimStrip);
  });

  // Yellow Spiral Scrap Extraction Hose & Trim Waste Bin beside machine (Photo 2 & 4)
  const suctionHose = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.68, 14), yellowHoseMat);
  suctionHose.position.set(1.52, 0.58, -bedW / 2 - 0.12);
  suctionHose.rotation.x = -0.25;
  trimCutGroup.add(suctionHose);

  const scrapBin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.52, 18), darkSteel);
  scrapBin.position.set(1.52, 0.26, -bedW / 2 - 0.26);
  trimCutGroup.add(scrapBin);

  // 4B. Enclosed Brushed Stainless Steel Guillotine Cutter Safety Hood (Photo 4 center)
  const cutterHood = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 1.24), brushedSteel));
  cutterHood.position.set(1.96, bedH + 0.28, 0);
  trimCutGroup.add(cutterHood);

  // Side Stainless Electrical/Gear Box on Cutter with 2 Black Knobs (Photo 4)
  const cutterSideBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.24), stainlessSteel);
  cutterSideBox.position.set(1.98, bedH + 0.24, bedW / 2 + 0.10);
  trimCutGroup.add(cutterSideBox);

  [bedH + 0.32, bedH + 0.18].forEach(function (ky) {
    const blackKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.04, 12), frameBlack);
    blackKnob.rotation.x = Math.PI / 2;
    blackKnob.position.set(2.04, ky, bedW / 2 + 0.23);
    trimCutGroup.add(blackKnob);
  });

  // Internal High-Speed Reciprocating Guillotine Cross-Cutting Blade
  const guillotineBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 1.08), chromeMat);
  guillotineBlade.position.set(2.18, bedH + 0.20, 0);
  trimCutGroup.add(guillotineBlade);
  reciprocatorsOut.push({ mesh: guillotineBlade, baseY: bedH + 0.20 });

  // Signature Bright Blue Static-Eliminator Bar across Cutter Exit (Photo 4 & 5)
  const blueStaticBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, 1.18), staticBarBlue);
  blueStaticBar.position.set(2.29, bedH + 0.24, 0);
  trimCutGroup.add(blueStaticBar);

  mGroup.add(trimCutGroup);

  /* =========================================================================
     STAGE 5: GREEN BELT OUTFEED CONVEYOR, BLUE BAFFLES, SWING-ARM HMI & OPERATOR
     (Photos 4 & 5: x = +2.30 to +5.15)
     "และออกมาตามสายพาน ที่มีพนักงานยืนอยู่ปลายทาง"
     ========================================================================= */
  const outfeedGroup = new THREE.Group();
  const convH = 0.80;

  // 5A. White Articulated Cantilever Swing-Arm & Vertical HMI Control Box (Photo 5)
  const swingArmGroup = new THREE.Group();
  swingArmGroup.position.set(2.38, convH, bedW / 2 + 0.08);

  // Vertical white square support column
  const armPost = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.56, 0.11), whiteArmMat);
  armPost.position.set(0, 0.28, 0);
  swingArmGroup.add(armPost);

  // Black pivot joint cap
  const jointCap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), frameBlack);
  jointCap.position.set(0, 0.57, 0);
  swingArmGroup.add(jointCap);

  // Horizontal white cantilever arm extending toward operator/conveyor
  const horizArm = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.09, 0.09), whiteArmMat);
  horizArm.position.set(0.32, 0.52, -0.18);
  horizArm.rotation.y = 0.42;
  swingArmGroup.add(horizArm);

  // Vertical White/Light-Grey HMI & Electrical Enclosure suspended at end of arm (Photo 5)
  const hmiCabinet = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.58, 0.26), whiteArmMat));
  hmiCabinet.position.set(0.62, 0.82, -0.34);
  swingArmGroup.add(hmiCabinet);

  // Dark front bezel & HMI screen on cabinet
  const hmiBezel = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.52, 0.02), darkSteel);
  hmiBezel.position.set(0.62, 0.82, -0.205);
  swingArmGroup.add(hmiBezel);

  // Red Warning Beacon Light on bracket (Photo 5 top-left)
  const redTowerLight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 14), redMat);
  redTowerLight.position.set(0.0, 0.72, 0.0);
  swingArmGroup.add(redTowerLight);

  outfeedGroup.add(swingArmGroup);

  // 5B. First-Stage Elastic Cord Transfer Roller Table (Photo 4: x = 2.30 to 2.85)
  const cordRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.92, 16), darkSteel);
  cordRoller.rotation.x = Math.PI / 2;
  cordRoller.position.set(2.78, convH + 0.08, 0);
  outfeedGroup.add(cordRoller);

  [-0.32, -0.16, 0.0, 0.16, 0.32].forEach(function (cz) {
    const greenCord = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.012, 0.016), conveyorGreen);
    greenCord.position.set(2.54, convH + 0.12, cz);
    outfeedGroup.add(greenCord);
  });

  // 5C. Stainless Steel Outfeed Table & Green PVC Flat Conveyor Belt (Photos 4 & 5: x = 2.80 to 4.65)
  const tableLen = 2.25;
  const tableW = 1.24;
  const tableCenterX = 3.45;

  const stainlessTable = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(tableLen, 0.06, tableW), brushedSteel));
  stainlessTable.position.set(tableCenterX, convH - 0.03, 0);
  outfeedGroup.add(stainlessTable);

  // Lower stainless support cabinet & legs under conveyor
  const tableSupport = new THREE.Mesh(new THREE.BoxGeometry(tableLen - 0.2, convH - 0.06, tableW - 0.25), stainlessSteel);
  tableSupport.position.set(tableCenterX, (convH - 0.06) / 2, 0);
  outfeedGroup.add(tableSupport);

  // Authentic Flat Green PVC Conveyor Belt running along the center of the stainless table
  const greenBelt = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.022, 0.68), conveyorGreen);
  greenBelt.position.set(3.62, convH + 0.012, -0.05);
  outfeedGroup.add(greenBelt);

  // End Conveyor Roller at x = 4.58
  const endRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.72, 16), chromeMat);
  endRoller.rotation.x = Math.PI / 2;
  endRoller.position.set(4.58, convH, -0.05);
  outfeedGroup.add(endRoller);
  rollersOut.push(endRoller);

  // 5D. Pair of Bright Blue Corrugated Plastic Guide Baffles (Photos 4 & 5)
  [-0.38, 0.26].forEach(function (bz) {
    const baffleGroup = new THREE.Group();
    baffleGroup.position.set(2.92, convH + 0.13, bz);

    const vWall = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.24, 0.018), blueBaffleMat);
    vWall.rotation.x = bz > 0 ? -0.18 : 0.18;
    baffleGroup.add(vWall);

    const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.015, 0.12), blueBaffleMat);
    baseFoot.position.y = -0.11;
    baffleGroup.add(baseFoot);

    outfeedGroup.add(baffleGroup);
  });

  // 5E. White Open-Top Cardboard Box on Front-Left Conveyor Table Ledge (Photo 5 foreground)
  const whiteSampleBox = new THREE.Group();
  whiteSampleBox.position.set(2.68, convH + 0.18, 0.44);
  const wBoxBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.34, 0.32), whiteArmMat);
  whiteSampleBox.add(wBoxBody);
  const wBoxInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.32, 0.29),
    new THREE.MeshLambertMaterial({ color: 0xb48352 })
  );
  wBoxInner.position.y = 0.02;
  whiteSampleBox.add(wBoxInner);
  outfeedGroup.add(whiteSampleBox);

  // 5F. Front Edge Push-Button Switch Strip & Red Emergency Stop (Photo 4 bottom-left)
  const switchPanel = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.06), darkSteel);
  switchPanel.position.set(2.88, convH - 0.09, tableW / 2 - 0.02);
  outfeedGroup.add(switchPanel);

  [
    { dx: -0.15, c: 0xdc2626, r: 0.026 }, // Red E-Stop
    { dx: -0.05, c: 0xef4444, r: 0.018 }, // Red Stop
    { dx:  0.04, c: 0x16a34a, r: 0.018 }, // Green Start
    { dx:  0.13, c: 0xeab308, r: 0.018 }  // Yellow Reset
  ].forEach(function (sw) {
    const swMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(sw.r, sw.r, 0.03, 12),
      new THREE.MeshLambertMaterial({ color: sw.c })
    );
    swMesh.rotation.x = Math.PI / 2;
    swMesh.position.set(2.88 + sw.dx, convH - 0.09, tableW / 2 + 0.02);
    outfeedGroup.add(swMesh);
  });

  // 5G. Stream of Shingled Finished Pouches emerging along the Green Belt (Photos 4 & 5)
  [2.55, 2.88, 3.22, 3.56, 3.90, 4.24].forEach(function (px, idx) {
    const pouch = createPouchMesh({
      hasSpout: false,
      width: 0.38,
      height: 0.50,
      depth: 0.055
    });
    pouch.rotation.x = Math.PI / 2;
    pouch.rotation.z = -Math.PI / 2 + (idx % 2 === 0 ? 0.04 : -0.04);
    pouch.position.set(px, convH + 0.045 + idx * 0.005, -0.05);
    outfeedGroup.add(pouch);
  });

  // Open Corrugated Carton Box at the End of the Conveyor collecting Pouches
  const endCartonStand = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.85), darkSteel);
  endCartonStand.position.set(4.98, 0.225, -0.05);
  outfeedGroup.add(endCartonStand);

  const openCarton = createKraftCartonBox({
    width: 0.78,
    height: 0.54,
    depth: 0.88,
    openTop: true
  });
  openCarton.position.set(4.98, 0.45, -0.05);
  outfeedGroup.add(openCarton);

  mGroup.add(outfeedGroup);

  /* =========================================================================
     STAGE 6: FINISHED GOODS SHRINK-WRAPPED BOX PALLET BESIDE OUTFEED
     ========================================================================= */
  const bagPalletGroup = createStandardBoxPallet({
    width: 1.85,
    depth: 1.45,
    tiers: 2,
    hasWrap: true
  });
  bagPalletGroup.position.set(4.75, 0.0, -1.85);
  bagPalletGroup.rotation.y = -0.05;
  mGroup.add(bagPalletGroup);

  return mGroup;
}
