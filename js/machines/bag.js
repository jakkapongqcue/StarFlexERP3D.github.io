/* =========================================================================
   StarFlexERP 3D - Authentic Stand-Up Pouch Bag Making Machine (ST_BAG)
   5-Stage Converting Line (Upgraded & Geometrically Verified):
   1. Unwind & Festoon Tension Dancer System (นำม้วนฟิล์มใหญ่มาทำให้มี Tension ที่เหมาะ):
      - Stepped matte-black steel side frames (#15181e)
      - Upper Jumbo Master Printed Film Roll + Lower Secondary Gusset Roll
      - Multi-roller vertical festoon tension dancer accumulator (6 upper + 6 lower rollers)
      - Clean axis-aligned film web feeding from jumbo roll into tension tower (no twisted planes)
      - Side-mounted brushed stainless steel control cabinet with pushbuttons
      - Upper black bridge beam with 5 circular lightening cutouts & nip rollers
   2. Triangular V-Plow Forming Assembly (นำไปขึ้นรูปซอง):
      - Integrated structural frame connecting the tension tower to the main sealing bed
      - Clean stainless steel V-plow forming plate & side folding guide rails folding the wide web
        smoothly into the pouch web without any protruding/skewed geometry
   3. 4-Station Heat Sealing & Cooling Press (และ Seal ประกบ):
      - Bright brushed stainless steel modular lower cabinet with 4 access doors
      - 4 heavy black reciprocating heat-sealing bridges (Longitudinal + Cross Seal + Chill Bar)
      - Dual top compression coil springs & 4 front black spoked handwheels
   4. Edge-Trim Slitter, Scrap Extraction & Guillotine Cutter (และตัดส่วนไม่จำเป็นออก):
      - Rotary edge-trim shear knives separating excess film margins into yellow suction hose & bin
      - Enclosed brushed stainless steel cutter hood with side knobs & blue static-eliminator bar
   5. Green Belt Outfeed Conveyor & End-of-Line Operator (และออกมาตามสายพาน ที่มีพนักงานยืนอยู่ปลายทาง):
      - White articulated cantilever swing-arm with vertical HMI cabinet & red beacon
      - Stainless steel conveyor table with green PVC flat belt
      - Pair of bright blue guide baffles cleanly framing the belt + white sample box on side ledge
      - 3 clearly separated finished pouches spaced apart along the green conveyor belt
      - Operator standing at the end of the conveyor inspecting & packing pouches into cartons
   ========================================================================= */

function buildBagMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Bright, Crisp Industrial Materials (low metalness so they never render black without envMap)
  const stainlessSteel = new THREE.MeshPhongMaterial({ color: 0xdbe2ea, specular: 0x475569, shininess: 45 });
  const brushedSteel = new THREE.MeshPhongMaterial({ color: 0xeef2f6, specular: 0x64748b, shininess: 60 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const frameBlack = new THREE.MeshLambertMaterial({ color: 0x181c24 });
  const chromeMat = new THREE.MeshPhongMaterial({ color: 0xf8fafc, specular: 0x94a3b8, shininess: 80 });
  const bronzeRollMat = new THREE.MeshPhongMaterial({ color: 0xd97706, specular: 0xfbbf24, shininess: 50 });
  const brassMat = new THREE.MeshPhongMaterial({ color: 0xeab308, specular: 0xfef08a, shininess: 55 });
  const rubberBlack = new THREE.MeshLambertMaterial({ color: 0x111827 });
  const conveyorGreen = new THREE.MeshLambertMaterial({ color: 0x15803d }); // Photo 4 & 5 green PVC belt
  const blueBaffleMat = new THREE.MeshLambertMaterial({ color: 0x2563eb }); // Photo 4 & 5 bright blue guide baffles
  const staticBarBlue = new THREE.MeshLambertMaterial({ color: 0x0284c7 }); // Photo 4 blue static bar on cutter
  const orangeSealMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });
  const whiteArmMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const yellowHoseMat = new THREE.MeshLambertMaterial({ color: 0xeab308 });
  const redMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });

  const filmTex = getHygieneFilmTexture();
  const printedWebMat = new THREE.MeshLambertMaterial({
    map: filmTex,
    side: THREE.DoubleSide
  });
  const silverFoilWebMat = new THREE.MeshPhongMaterial({
    color: 0xe2e8f0,
    specular: 0x94a3b8,
    shininess: 65,
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

    // Vertical Chrome Linear Guide Shaft on tower side (Photo 1)
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
    0.55,
    1.36,
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

  // 1E. Multi-Roller Festoon Tension Dancer Accumulator Bank (6 upper + 6 lower bronze/chrome rollers)
  const festoonXPositions = [-3.62, -3.48, -3.34, -3.20, -3.06, -2.92];
  festoonXPositions.forEach(function (rx, idx) {
    const upRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, towerW - 0.18, 14),
      idx % 2 === 0 ? bronzeRollMat : chromeMat
    );
    upRoll.rotation.x = Math.PI / 2;
    upRoll.position.set(rx, 2.16, 0);
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

  // Vertical Weaving Film Web Spans inside the Festoon Tension Tower (pure BoxGeometry - never twists)
  for (let i = 0; i < festoonXPositions.length; i++) {
    const spanX = festoonXPositions[i];
    const spanMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 1.48, 1.34),
      i % 2 === 0 ? silverFoilWebMat : printedWebMat
    );
    spanMesh.position.set(spanX, 1.42, 0);
    unwindGroup.add(spanMesh);
  }

  // FIXED RED CIRCLE 1: Clean Axis-Aligned Film Web Bridge from Top of Jumbo Roll (x=-4.35, y=2.06) to First Upper Roller (x=-3.62, y=2.16)
  const infeedWebUpper = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.010, 1.34), printedWebMat);
  infeedWebUpper.position.set(-3.98, 2.11, 0);
  infeedWebUpper.rotation.z = 0.13; // Gentle upward pitch along X from roll crown to top roller
  unwindGroup.add(infeedWebUpper);

  // Clean Axis-Aligned Film Web from Lower Secondary Roll (x=-4.48, y=0.71) into Lower Guide Roller (x=-3.62, y=0.68)
  const infeedWebLower = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.008, 0.90), silverFoilWebMat);
  infeedWebLower.position.set(-4.05, 0.70, 0);
  infeedWebLower.rotation.z = -0.04;
  unwindGroup.add(infeedWebLower);

  // 1F. Side-Mounted Brushed Stainless Steel Control Box on Unwind Frame (Photo 1 bottom-left)
  const unwindCtrlBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.52, 0.26), brushedSteel));
  unwindCtrlBox.position.set(-3.88, 0.58, halfW + 0.11);
  unwindGroup.add(unwindCtrlBox);

  [-0.24, -0.14, -0.04, 0.06, 0.16, 0.26].forEach(function (bx, bIdx) {
    const btnColor = bIdx === 0 ? 0x16a34a : (bIdx === 1 ? 0xdc2626 : 0x1e293b);
    const btn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.025, 12),
      new THREE.MeshLambertMaterial({ color: btnColor })
    );
    btn.position.set(-3.88 + bx, 0.85, halfW + 0.12);
    unwindGroup.add(btn);
  });

  // Dual Black Rubber Pull/Nip Rollers exiting the Tension Tower (Photo 2)
  [1.12, 1.24].forEach(function (ny) {
    const nipRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.42, 18), rubberBlack);
    nipRoll.rotation.x = Math.PI / 2;
    nipRoll.position.set(-2.75, ny, 0);
    unwindGroup.add(nipRoll);
  });

  // Optical Registration Photocell Sensor on yellow guide bracket (Photo 2)
  const sensorBlock = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.10), yellowHoseMat);
  sensorBlock.position.set(-2.62, 1.28, 0.42);
  unwindGroup.add(sensorBlock);

  mGroup.add(unwindGroup);

  /* =========================================================================
     STAGE 2: INTEGRATED FORMING FRAME & TRIANGULAR V-PLOW FOLDER
     (FIXED RED CIRCLE 2: Photo 3: x = -2.75 to -1.15)
     "นำไปขึ้นรูป"
     ========================================================================= */
  const formingGroup = new THREE.Group();
  const formFrameW = 1.38;

  // 2A. Solid Black Structural Frame Rails connecting Unwind Tower (-2.75) to Sealing Bed (-1.15)
  [-formFrameW / 2 + 0.05, formFrameW / 2 - 0.05].forEach(function (rz) {
    // Lower horizontal base rail
    const lowerRail = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.10, 0.08), frameBlack);
    lowerRail.position.set(-1.95, 0.05, rz);
    formingGroup.add(lowerRail);

    // Mid-height table rail supporting the forming assembly
    const midRail = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.09, 0.08), frameBlack);
    midRail.position.set(-1.95, 0.84, rz);
    formingGroup.add(midRail);

    // Vertical support column at mid-section (x = -1.95)
    const centerPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 0.08), frameBlack);
    centerPost.position.set(-1.95, 0.725, rz);
    formingGroup.add(centerPost);
  });

  // Transverse Chrome Guide Rollers at entrance (x = -2.35) and exit (x = -1.25) of Forming Zone
  [-2.35, -1.25].forEach(function (gx, gIdx) {
    const gy = gIdx === 0 ? 1.15 : 1.00;
    const gRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, formFrameW - 0.12, 16), chromeMat);
    gRoll.rotation.x = Math.PI / 2;
    gRoll.position.set(gx, gy, 0);
    formingGroup.add(gRoll);
  });

  // 2B. Brushed Stainless Steel Triangular Forming Plow Plate (V-Plow Folder - Photo 3)
  // Built as a clean, flat, tapered V-plate and side folding rails that sit neatly inside the frame
  const vPlowPlate = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.025, 0.86), brushedSteel);
  vPlowPlate.position.set(-1.95, 1.08, 0);
  vPlowPlate.rotation.z = -0.10; // Smooth downward slope from x=-2.65 (y=1.15) to x=-1.25 (y=1.00)
  formingGroup.add(vPlowPlate);

  // Converging Stainless Steel V-Plow Side Folding Guide Bars (taper from wide 1.32m to folded 0.86m)
  [-1, 1].forEach(function (sideSign) {
    const foldBar = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.045, 0.045), chromeMat);
    foldBar.position.set(-1.95, 1.12, sideSign * 0.54);
    foldBar.rotation.y = sideSign * 0.16; // Converges inward along X toward the sealing section
    foldBar.rotation.z = -0.10;
    formingGroup.add(foldBar);

    // Side Gusset Tucking Wheel (creates the stand-up bottom/side fold)
    const tuckDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 18), brushedSteel);
    tuckDisc.position.set(-1.65, 1.05, sideSign * 0.46);
    formingGroup.add(tuckDisc);
  });

  // 2C. Clean, Untwisted Film Web Travelling Through the Forming Plow (from x=-2.75 to x=-1.15)
  // Upper printed layer & lower folded barrier layer converging smoothly into the nip rollers
  const formingWebTop = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.012, 1.06), printedWebMat);
  formingWebTop.position.set(-1.95, 1.11, 0);
  formingWebTop.rotation.z = -0.10;
  formingGroup.add(formingWebTop);

  const formingWebBottom = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.010, 0.88), silverFoilWebMat);
  formingWebBottom.position.set(-1.95, 0.99, 0);
  formingWebBottom.rotation.z = 0.02;
  formingGroup.add(formingWebBottom);

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
    [-0.56, 0.56].forEach(function (sz) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.56, 0.08), darkSteel);
      upright.position.set(sx, bedH + 0.28, sz);
      sealSectionGroup.add(upright);
    });

    const sealHead = new THREE.Group();
    sealHead.position.set(sx, bedH + 0.28, 0);

    const upperBeam = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 1.18), frameBlack));
    upperBeam.position.y = 0.08;
    sealHead.add(upperBeam);

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
    const knifeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 20), chromeMat);
    knifeDisc.rotation.x = Math.PI / 2;
    knifeDisc.position.set(1.48, bedH + 0.20, tz);
    trimCutGroup.add(knifeDisc);

    const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.008, 0.045), printedWebMat);
    trimStrip.position.set(1.56, bedH + 0.04, tz * 1.08);
    trimStrip.rotation.z = -0.65;
    trimCutGroup.add(trimStrip);
  });

  // Yellow Spiral Scrap Extraction Hose & Trim Waste Bin beside machine
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
     STAGE 5: GREEN BELT OUTFEED CONVEYOR, BLUE BAFFLES, SWING-ARM HMI & 3 SPACED POUCHES
     (FIXED RED CIRCLE 3: Photos 4 & 5: x = +2.30 to +5.15)
     "และตอนที่ถุงออกมา อยากให้แสดงอยู่ 3 ถุง และอยู่ห่างกัน ให้ดูได้ง่าย"
     ========================================================================= */
  const outfeedGroup = new THREE.Group();
  const convH = 0.80;

  // 5A. White Articulated Cantilever Swing-Arm & Vertical HMI Control Box (Photo 5)
  const swingArmGroup = new THREE.Group();
  swingArmGroup.position.set(2.38, convH, bedW / 2 + 0.08);

  const armPost = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.56, 0.11), whiteArmMat);
  armPost.position.set(0, 0.28, 0);
  swingArmGroup.add(armPost);

  const jointCap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), frameBlack);
  jointCap.position.set(0, 0.57, 0);
  swingArmGroup.add(jointCap);

  const horizArm = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.09, 0.09), whiteArmMat);
  horizArm.position.set(0.26, 0.52, -0.10);
  horizArm.rotation.y = 0.28;
  swingArmGroup.add(horizArm);

  const hmiCabinet = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.56, 0.24), whiteArmMat));
  hmiCabinet.position.set(0.54, 0.82, -0.18);
  swingArmGroup.add(hmiCabinet);

  const hmiBezel = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.50, 0.02), darkSteel);
  hmiBezel.position.set(0.54, 0.82, -0.055);
  swingArmGroup.add(hmiBezel);

  const redTowerLight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 14), redMat);
  redTowerLight.position.set(0.0, 0.72, 0.0);
  swingArmGroup.add(redTowerLight);

  outfeedGroup.add(swingArmGroup);

  // 5B. First-Stage Elastic Cord Transfer Roller Table (Photo 4: x = 2.30 to 2.75)
  const cordRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.88, 16), darkSteel);
  cordRoller.rotation.x = Math.PI / 2;
  cordRoller.position.set(2.72, convH + 0.04, -0.05);
  outfeedGroup.add(cordRoller);

  [-0.28, -0.14, 0.0, 0.14, 0.28].forEach(function (cz) {
    const greenCord = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.016), conveyorGreen);
    greenCord.position.set(2.50, convH + 0.08, cz - 0.05);
    outfeedGroup.add(greenCord);
  });

  // 5C. Stainless Steel Outfeed Table & Green PVC Flat Conveyor Belt (Photos 4 & 5: x = 2.70 to 4.65)
  const tableLen = 2.25;
  const tableW = 1.24;
  const tableCenterX = 3.48;

  const stainlessTable = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(tableLen, 0.06, tableW), brushedSteel));
  stainlessTable.position.set(tableCenterX, convH - 0.03, 0);
  outfeedGroup.add(stainlessTable);

  const tableSupport = new THREE.Mesh(new THREE.BoxGeometry(tableLen - 0.2, convH - 0.06, tableW - 0.25), stainlessSteel);
  tableSupport.position.set(tableCenterX, (convH - 0.06) / 2, 0);
  outfeedGroup.add(tableSupport);

  // Authentic Flat Green PVC Conveyor Belt running along the center of the stainless table
  const greenBelt = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.022, 0.66), conveyorGreen);
  greenBelt.position.set(3.64, convH + 0.012, -0.05);
  outfeedGroup.add(greenBelt);

  // End Conveyor Roller at x = 4.60
  const endRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.70, 16), chromeMat);
  endRoller.rotation.x = Math.PI / 2;
  endRoller.position.set(4.60, convH, -0.05);
  outfeedGroup.add(endRoller);
  rollersOut.push(endRoller);

  // 5D. Pair of Bright Blue Corrugated Plastic Guide Baffles (Cleanly flanking the belt without clipping pouches)
  [-0.37, 0.27].forEach(function (bz) {
    const baffleGroup = new THREE.Group();
    baffleGroup.position.set(2.92, convH + 0.11, bz);

    const vWall = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.20, 0.016), blueBaffleMat);
    baffleGroup.add(vWall);

    const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.015, 0.09), blueBaffleMat);
    baseFoot.position.y = -0.095;
    baffleGroup.add(baseFoot);

    outfeedGroup.add(baffleGroup);
  });

  // 5E. White Open-Top Cardboard Box on Front-Left Conveyor Table Ledge (Photo 5 foreground)
  const whiteSampleBox = new THREE.Group();
  whiteSampleBox.position.set(2.65, convH + 0.16, 0.46);
  const wBoxBody = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.30, 0.28), whiteArmMat);
  whiteSampleBox.add(wBoxBody);
  const wBoxInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.31, 0.28, 0.25),
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
    { dx: -0.15, c: 0xdc2626, r: 0.026 },
    { dx: -0.05, c: 0xef4444, r: 0.018 },
    { dx:  0.04, c: 0x16a34a, r: 0.018 },
    { dx:  0.13, c: 0xeab308, r: 0.018 }
  ].forEach(function (sw) {
    const swMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(sw.r, sw.r, 0.03, 12),
      new THREE.MeshLambertMaterial({ color: sw.c })
    );
    swMesh.rotation.x = Math.PI / 2;
    swMesh.position.set(2.88 + sw.dx, convH - 0.09, tableW / 2 + 0.02);
    outfeedGroup.add(swMesh);
  });

  // 5G. 3 Finished Pouches Centered on the Green Belt (Belt Center z = -0.05)
  // In createPouchMesh: local Y spans 0..height, which with rotation.x = -Math.PI/2 maps to world Z = pz - y.
  // Setting pz = -0.05 + pouchH / 2 perfectly centers the pouch span (-0.27 to +0.17) right at z = -0.05!
  const pouchH = 0.44;
  [2.98, 3.62, 4.26].forEach(function (px) {
    const pouch = createPouchMesh({
      hasSpout: false,
      width: 0.32,
      height: pouchH,
      depth: 0.05
    });
    pouch.rotation.x = -Math.PI / 2;
    pouch.position.set(px, convH + 0.048, -0.05 + pouchH / 2);
    outfeedGroup.add(pouch);
  });

  // Open Corrugated Carton Box at the End of the Conveyor collecting Pouches
  const endCartonStand = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.85), darkSteel);
  endCartonStand.position.set(5.02, 0.225, -0.05);
  outfeedGroup.add(endCartonStand);

  const openCarton = createKraftCartonBox({
    width: 0.78,
    height: 0.54,
    depth: 0.88,
    openTop: true
  });
  openCarton.position.set(5.02, 0.45, -0.05);
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
