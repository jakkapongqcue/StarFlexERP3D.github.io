/* =========================================================================
   StarFlexERP 3D - Machine: Automatic Ultrasonic Spout Inserter & Welder (ST_SPOUT)
   Modeled directly from authentic factory photos (1:1 High-Fidelity Twin):
   1. Cleanroom-grade extruded aluminum safety enclosure with transparent glass panels
   2. Front double glass doors with vertical handles, taped SOP procedure sheet & yellow hazard sign
   3. Dual-tier base cabinet in industrial pale sage-grey with flush handles & dark kickplate
   4. Vibratory bowl feeder: white cylindrical drive base, stainless spiral bowl filled
      with white plastic spouts, overhead bulk hopper, and linear vibrating track
   5. Triple digital temperature/pressure controllers with bright red LED 7-segment readouts
   6. Bundles of flexible red & blue polyurethane pneumatic tubes, solenoid manifold, and blue plug
   7. Ultrasonic welding press head with vertical slide guide, dual foreground cylinders & reciprocating horn
   8. Outfeed green flat belt conveyor oriented parallel to production line (West to East)
   9. 3-ring hold-down roller assembly riding on exiting pouches, angled operator console with red E-Stop
   10. Finished Hygiene pouches with white corner spouts spaced on the green belt
   11. Articulated PC monitor workstation showing green NCA machine UI & keyboard tray
   12. Authentic factory details: insulated overhead chiller pipe with red valve,
       industrial pedestal oscillating fan, and corrugated packaging carton boxes
   ========================================================================= */

function buildSpoutMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // -------------------------------------------------------------------------
  // Materials Palette
  // -------------------------------------------------------------------------
  const aluminumFrameMat = new THREE.MeshStandardMaterial({
    color: 0xb0b8c4,
    metalness: 0.55,
    roughness: 0.35
  });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.85,
    roughness: 0.18
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.70,
    roughness: 0.30
  });

  // Base cabinet pale sage-grey / olive-cream sheet metal (matching factory photo)
  const baseCabinetMat = new THREE.MeshLambertMaterial({ color: 0xc8d1c7 });
  const baseKickMat = new THREE.MeshLambertMaterial({ color: 0x475569 });

  // Safety glass panels (clean transparent acrylic / tempered glass)
  const safetyGlassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.35,
    roughness: 0.08,
    metalness: 0.15,
    depthWrite: false
  });

  // Green flat conveyor belt (forest green PVC belt as in factory photo)
  const greenBeltMat = new THREE.MeshLambertMaterial({ color: 0x15803d });

  // White plastic spout fitment material
  const whiteSpoutMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

  // Pneumatic polyurethane lines (flexible tubes)
  const blueTubeMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
  const redTubeMat  = new THREE.MeshLambertMaterial({ color: 0xdc2626 });

  // Corrugated cardboard box material
  const kraftBoxMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // =========================================================================
  // 1. LOWER MACHINE BASE CABINETS (Pale Sage-Grey Sheet Metal with Kickplate)
  // =========================================================================
  const baseW = 5.2;
  const baseH = 1.32;
  const baseD = 2.4;

  // Dark kickplate
  const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(baseW, 0.12, baseD), baseKickMat);
  kickPlate.position.set(0, 0.06, 0);
  mGroup.add(kickPlate);

  // Main cabinet body
  const baseBody = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(baseW, baseH - 0.12, baseD), baseCabinetMat));
  baseBody.position.set(0, (baseH + 0.12) / 2, 0);
  mGroup.add(baseBody);

  // Cabinet access doors & flush handles on the front face (z = baseD / 2)
  const doorWidth = baseW / 4 - 0.08;
  const doorHeight = baseH - 0.28;
  for (let d = 0; d < 4; d++) {
    const dx = -baseW / 2 + (d + 0.5) * (baseW / 4);
    // Door panel relief
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.02), baseCabinetMat);
    doorPanel.position.set(dx, baseH / 2 + 0.04, baseD / 2 + 0.012);
    mGroup.add(doorPanel);

    // Recessed stainless handle (like factory photo)
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.03), chromeMat);
    handle.position.set(dx + doorWidth * 0.35, baseH / 2 + 0.18, baseD / 2 + 0.025);
    mGroup.add(handle);
  }

  // Stainless steel internal table top deck
  const stainlessDeck = new THREE.Mesh(new THREE.BoxGeometry(baseW + 0.08, 0.04, baseD + 0.08), chromeMat);
  stainlessDeck.position.set(0, baseH + 0.02, 0);
  mGroup.add(stainlessDeck);

  // Blue industrial socket mounted on lower frame (seen in Image 2)
  const bluePlug = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.08), new THREE.MeshLambertMaterial({ color: 0x2563eb }));
  bluePlug.position.set(0.65, baseH + 0.08, baseD / 2 - 0.15);
  mGroup.add(bluePlug);

  // =========================================================================
  // 2. TRANSPARENT SAFETY GLASS & EXTRUDED ALUMINUM MODULAR ENCLOSURE
  // =========================================================================
  const encH = 2.45;
  const encTopY = baseH + encH;
  const encHalfW = baseW / 2;
  const encHalfD = baseD / 2;
  const postThick = 0.07;

  // Aluminum Vertical Corner Posts (4 corners)
  [
    [-encHalfW, -encHalfD],
    [ encHalfW, -encHalfD],
    [-encHalfW,  encHalfD],
    [ encHalfW,  encHalfD]
  ].forEach(function (pt) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(postThick, encH, postThick), aluminumFrameMat);
    post.position.set(pt[0], baseH + encH / 2, pt[1]);
    mGroup.add(post);
  });

  // Intermediate vertical mullions (dividing into Left Bay and Right Double-Door Bay)
  [0].forEach(function (mx) {
    const frontMullion = new THREE.Mesh(new THREE.BoxGeometry(postThick, encH, postThick), aluminumFrameMat);
    frontMullion.position.set(mx, baseH + encH / 2, encHalfD);
    mGroup.add(frontMullion);

    const backMullion = new THREE.Mesh(new THREE.BoxGeometry(postThick, encH, postThick), aluminumFrameMat);
    backMullion.position.set(mx, baseH + encH / 2, -encHalfD);
    mGroup.add(backMullion);
  });

  // Horizontal Aluminum Perimeter Rails (Top header & Bottom sill)
  [-encHalfD, encHalfD].forEach(function (rz) {
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(baseW, postThick, postThick), aluminumFrameMat);
    topRail.position.set(0, encTopY - postThick / 2, rz);
    mGroup.add(topRail);

    const botRail = new THREE.Mesh(new THREE.BoxGeometry(baseW, postThick, postThick), aluminumFrameMat);
    botRail.position.set(0, baseH + postThick / 2, rz);
    mGroup.add(botRail);
  });

  [-encHalfW, encHalfW].forEach(function (rx) {
    const topSideRail = new THREE.Mesh(new THREE.BoxGeometry(postThick, postThick, baseD), aluminumFrameMat);
    topSideRail.position.set(rx, encTopY - postThick / 2, 0);
    mGroup.add(topSideRail);

    const botSideRail = new THREE.Mesh(new THREE.BoxGeometry(postThick, postThick, baseD), aluminumFrameMat);
    botSideRail.position.set(rx, baseH + postThick / 2, 0);
    mGroup.add(botSideRail);
  });

  // Front Enclosure:
  // Left Bay (x: -baseW/4): Sealed glass panel
  const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(baseW / 2 - 0.08, encH - 0.14, 0.015), safetyGlassMat);
  leftGlass.position.set(-baseW / 4, baseH + encH / 2, encHalfD);
  mGroup.add(leftGlass);

  // Right Bay (x: +baseW/4): Double Glass Doors (Image 3 signature)
  const doorW = (baseW / 2 - 0.12) / 2;
  [-doorW / 2 + baseW / 4, doorW / 2 + baseW / 4].forEach(function (dx, dIdx) {
    // Glass door panel
    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, encH - 0.18, 0.015), safetyGlassMat);
    doorGlass.position.set(dx, baseH + encH / 2, encHalfD);
    mGroup.add(doorGlass);

    // Aluminum door frame outline
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.02, 0.04, 0.03), aluminumFrameMat);
    frameTop.position.set(dx, encTopY - 0.10, encHalfD + 0.01);
    mGroup.add(frameTop);
    const frameBtm = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.02, 0.04, 0.03), aluminumFrameMat);
    frameBtm.position.set(dx, baseH + 0.10, encHalfD + 0.01);
    mGroup.add(frameBtm);

    // Vertical stainless door handle (meeting in the center)
    const handleX = (dIdx === 0) ? (dx + doorW / 2 - 0.06) : (dx - doorW / 2 + 0.06);
    const vHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.45, 0.04), chromeMat);
    vHandle.position.set(handleX, baseH + encH * 0.48, encHalfD + 0.03);
    mGroup.add(vHandle);

    // Door hinges
    const hgX = (dIdx === 0) ? (dx - doorW / 2 + 0.03) : (dx + doorW / 2 - 0.03);
    [baseH + 0.45, encTopY - 0.45].forEach(function (hy) {
      const hg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.10, 0.04), chromeMat);
      hg.position.set(hgX, hy, encHalfD + 0.02);
      mGroup.add(hg);
    });
  });

  // Back Glass Panels
  const glassBack = new THREE.Mesh(new THREE.BoxGeometry(baseW - 0.15, encH - 0.14, 0.015), safetyGlassMat);
  glassBack.position.set(0, baseH + encH / 2, -encHalfD);
  mGroup.add(glassBack);

  // Left Side Glass Panel (with opening for infeed if needed)
  const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(0.015, encH - 0.14, baseD - 0.15), safetyGlassMat);
  glassLeft.position.set(-encHalfW, baseH + encH / 2, 0);
  mGroup.add(glassLeft);

  // Right Side Glass Panel (with lower slot opening for Outfeed Conveyor)
  const glassRightTop = new THREE.Mesh(new THREE.BoxGeometry(0.015, encH - 0.95, baseD - 0.15), safetyGlassMat);
  glassRightTop.position.set(encHalfW, baseH + 0.95 + (encH - 0.95) / 2, 0);
  mGroup.add(glassRightTop);

  // Top Glass Roof
  const glassRoof = new THREE.Mesh(new THREE.BoxGeometry(baseW - 0.15, 0.015, baseD - 0.15), safetyGlassMat);
  glassRoof.position.set(0, encTopY, 0);
  mGroup.add(glassRoof);

  // Internal Ceiling White LED Strip Lights
  [-0.45, 0.45].forEach(function (lz) {
    const ledFixture = new THREE.Mesh(new THREE.BoxGeometry(baseW - 0.8, 0.06, 0.12), chromeMat);
    ledFixture.position.set(0, encTopY - 0.06, lz);
    mGroup.add(ledFixture);
    const ledTube = new THREE.Mesh(new THREE.BoxGeometry(baseW - 1.0, 0.02, 0.08), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    ledTube.position.set(0, encTopY - 0.09, lz);
    mGroup.add(ledTube);
  });

  // =========================================================================
  // 3. FACTORY GLASS SIGNAGE: SOP PROCEDURE DOCUMENT & YELLOW SAFETY PLACARDS
  // (Visible directly in factory photo Image 1 & 3 on front glass doors)
  // =========================================================================
  // (a) Taped Standard Operating Procedure (SOP) Sheet on Left Glass Door
  const sopPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.50, 0.008),
    new THREE.MeshLambertMaterial({ color: 0xf8fafc })
  );
  sopPaper.position.set(baseW / 4 - doorW / 2 + 0.05, baseH + encH * 0.70, encHalfD + 0.018);
  mGroup.add(sopPaper);

  // Header banner on SOP paper
  const sopHeader = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 0.002), new THREE.MeshLambertMaterial({ color: 0x3b82f6 }));
  sopHeader.position.set(baseW / 4 - doorW / 2 + 0.05, baseH + encH * 0.70 + 0.19, encHalfD + 0.023);
  mGroup.add(sopHeader);

  // Simulated process photos on SOP (seen in Image 3)
  [-0.20, 0, 0.20].forEach(function (px) {
    const idPhoto = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.002), new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
    idPhoto.position.set(baseW / 4 - doorW / 2 + 0.05 + px, baseH + encH * 0.70 + 0.05, encHalfD + 0.023);
    mGroup.add(idPhoto);
  });

  // Simulated SOP table lines
  for (let row = 0; row < 4; row++) {
    const tableLine = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.018, 0.002), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    tableLine.position.set(baseW / 4 - doorW / 2 + 0.05, baseH + encH * 0.70 - 0.07 - row * 0.05, encHalfD + 0.023);
    mGroup.add(tableLine);
  }

  // (b) Yellow Triangular Safety Warning Placard ("Pinch Point / Moving Parts" Triangle from Image 1)
  const warnSign = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.008, 3),
    new THREE.MeshLambertMaterial({ color: 0xfacc15 })
  );
  warnSign.rotation.z = Math.PI; // point facing up
  warnSign.position.set(baseW / 4, baseH + encH * 0.40, encHalfD + 0.018);
  mGroup.add(warnSign);

  const warnInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 0.002, 3),
    new THREE.MeshLambertMaterial({ color: 0x0f172a })
  );
  warnInner.rotation.z = Math.PI;
  warnInner.position.set(baseW / 4, baseH + encH * 0.40, encHalfD + 0.023);
  mGroup.add(warnInner);

  // =========================================================================
  // 4. VIBRATORY BOWL FEEDER ASSEMBLY (Inside Right Enclosure - Matching Image 2 & 3)
  // =========================================================================
  const feederCenterX = 1.35;
  const feederCenterZ = -0.15;
  const feederBaseY = baseH + 0.04;

  // Heavy white cylindrical vibration drive base (Image 2 & 3 signature)
  const vibDriveBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.70, 0.78, 28),
    new THREE.MeshLambertMaterial({ color: 0xf8fafc })
  );
  vibDriveBase.position.set(feederCenterX, feederBaseY + 0.39, feederCenterZ);
  mGroup.add(vibDriveBase);

  // Dark vibration dampening rubber ring at bottom of drive
  const dampRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.73, 0.08, 28),
    darkSteel
  );
  dampRing.position.set(feederCenterX, feederBaseY + 0.04, feederCenterZ);
  mGroup.add(dampRing);

  // Polished Stainless Steel Vibratory Spiral Bowl
  const bowlOuter = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(1.00, 0.82, 0.60, 32),
    chromeMat
  ));
  bowlOuter.position.set(feederCenterX, feederBaseY + 0.78 + 0.30, feederCenterZ);
  mGroup.add(bowlOuter);
  rollersOut.push(bowlOuter);

  // Inner Bowl Cavity
  const bowlInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.58, 0.56, 28),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.25 })
  );
  bowlInner.position.set(feederCenterX, feederBaseY + 0.78 + 0.34, feederCenterZ);
  mGroup.add(bowlInner);

  // Spiral Helical Track inside bowl populated with WHITE plastic spout fitments
  for (let s = 0; s < 22; s++) {
    const ang = s * 0.40;
    const rad = 0.58 + (s / 22) * 0.32;
    const sy = feederBaseY + 0.78 + 0.16 + (s / 22) * 0.38;

    const spoutFit = new THREE.Group();
    // Spout nozzle tube
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.085, 10), whiteSpoutMat);
    nozzle.position.y = 0.042;
    spoutFit.add(nozzle);
    // Welded weld flange ring
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12), whiteSpoutMat);
    flange.position.y = 0.01;
    spoutFit.add(flange);

    spoutFit.position.set(
      feederCenterX + Math.cos(ang) * rad,
      sy,
      feederCenterZ + Math.sin(ang) * rad
    );
    spoutFit.rotation.y = ang + Math.PI / 2;
    mGroup.add(spoutFit);
  }

  // Stainless Steel Bulk Supply Hopper (Overhead funnel feeding raw spouts into bowl)
  const hopper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.18, 0.65, 18),
    chromeMat
  );
  hopper.position.set(feederCenterX + 0.48, encTopY - 0.45, feederCenterZ - 0.40);
  mGroup.add(hopper);

  const hopperChute = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), chromeMat);
  hopperChute.position.set(feederCenterX + 0.36, encTopY - 0.78, feederCenterZ - 0.28);
  hopperChute.rotation.z = -0.35;
  mGroup.add(hopperChute);

  // Linear Vibrating Feeder Track exiting bowl towards the left welding station
  const linearTrack = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.16), chromeMat);
  linearTrack.position.set(feederCenterX - 0.88, feederBaseY + 1.10, feederCenterZ + 0.40);
  linearTrack.rotation.z = -0.06;
  linearTrack.rotation.y = 0.10;
  mGroup.add(linearTrack);

  // Spouts marching along the linear track
  for (let lt = 0; lt < 5; lt++) {
    const trackSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.08, 10), whiteSpoutMat);
    trackSpout.position.set(feederCenterX - 0.40 - lt * 0.24, feederBaseY + 1.12 - lt * 0.014, feederCenterZ + 0.38 + lt * 0.028);
    mGroup.add(trackSpout);
  }

  // =========================================================================
  // 5. TRIPLE DIGITAL CONTROLLERS WITH RED LED 7-SEGMENT READOUTS (Image 3)
  // (3 digital temperature/pressure controllers mounted side-by-side inside)
  // =========================================================================
  const controllerBracket = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.04), aluminumFrameMat);
  controllerBracket.position.set(feederCenterX + 0.75, baseH + 0.38, feederCenterZ + 0.65);
  mGroup.add(controllerBracket);

  [-0.16, 0, 0.16].forEach(function (ctrlX, cIdx) {
    // Controller box body
    const ctrlBody = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.24, 0.10), darkSteel);
    ctrlBody.position.set(feederCenterX + 0.75 + ctrlX, baseH + 0.38, feederCenterZ + 0.72);
    mGroup.add(ctrlBody);

    // Front digital LED display panel
    const ledPanel = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.01), charcoalMat);
    ledPanel.position.set(feederCenterX + 0.75 + ctrlX, baseH + 0.44, feederCenterZ + 0.775);
    mGroup.add(ledPanel);

    // Bright Red 7-Segment LED digital readout
    const redDigits = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.005), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redDigits.position.set(feederCenterX + 0.75 + ctrlX, baseH + 0.44, feederCenterZ + 0.782);
    mGroup.add(redDigits);

    // Green status LED under digital display
    const grnDot = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.005, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    grnDot.rotation.x = Math.PI / 2;
    grnDot.position.set(feederCenterX + 0.75 + ctrlX - 0.03, baseH + 0.34, feederCenterZ + 0.78);
    mGroup.add(grnDot);
  });

  // White cloth worker glove resting on deck (Authentic factory detail from Image 2)
  const glove = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.24), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
  glove.position.set(feederCenterX - 0.65, baseH + 0.05, feederCenterZ + 0.75);
  glove.rotation.y = 0.42;
  mGroup.add(glove);

  // Bundles of Red & Blue Flexible Pneumatic Polyurethane Tubing (Matching factory photo Image 2)
  const tubeClusterX = 0.15;
  const tubeClusterZ = -0.30;
  [-0.08, -0.03, 0.03, 0.08].forEach(function (tx, idx) {
    const mat = (idx % 2 === 0) ? blueTubeMat : redTubeMat;
    const tubeGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.95, 8);
    const tube = new THREE.Mesh(tubeGeo, mat);
    tube.position.set(tubeClusterX + tx, baseH + 0.55, tubeClusterZ);
    tube.rotation.z = (idx - 1.5) * 0.08;
    mGroup.add(tube);
  });

  // =========================================================================
  // 6. ULTRASONIC WELDING COLUMN & RECIPROCATING HORN (Left Enclosure)
  // =========================================================================
  const weldX = -0.95;
  const weldZ = 0.15;

  // Heavy Vertical Linear Slide Guide Pillar (Blue industrial finish)
  const slidePillar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.65, 0.42), new THREE.MeshLambertMaterial({ color: 0x1e40af }));
  slidePillar.position.set(weldX, baseH + 0.95, weldZ - 0.35);
  mGroup.add(slidePillar);

  // Twin Chrome Guide Rods
  [-0.14, 0.14].forEach(function (gx) {
    const guideRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 12), chromeMat);
    guideRod.position.set(weldX + gx, baseH + 0.95, weldZ - 0.12);
    mGroup.add(guideRod);
  });

  // Top Pneumatic Cylinder
  const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.55, 16), aluminumFrameMat);
  cylBody.position.set(weldX, baseH + 1.85, weldZ - 0.12);
  mGroup.add(cylBody);

  // Reciprocating Ultrasonic Booster & Welding Horn (Animated via reciprocatorsOut)
  const hornGroup = new THREE.Group();
  hornGroup.position.set(weldX, baseH + 0.75, weldZ + 0.15);

  const booster = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.35, 16), aluminumFrameMat);
  booster.position.y = 0.28;
  hornGroup.add(booster);

  const titaniumHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.07, 0.38, 14), chromeMat);
  titaniumHorn.position.y = -0.05;
  hornGroup.add(titaniumHorn);

  mGroup.add(hornGroup);
  reciprocatorsOut.push({ mesh: hornGroup, baseY: baseH + 0.75 });

  // Anvil nest holding pouch neck directly underneath welding horn
  const anvilNest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.28), darkSteel);
  anvilNest.position.set(weldX, baseH + 0.09, weldZ + 0.15);
  mGroup.add(anvilNest);

  // Twin Horizontal Foreground Pneumatic Cylinders with Chrome Rods (Foreground of Image 3)
  [-0.32, 0.32].forEach(function (cyOff) {
    const fgCyl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.42), aluminumFrameMat);
    fgCyl.position.set(weldX + cyOff, baseH + 0.24, encHalfD - 0.12);
    mGroup.add(fgCyl);

    const fgRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12), chromeMat);
    fgRod.rotation.x = Math.PI / 2;
    fgRod.position.set(weldX + cyOff, baseH + 0.24, encHalfD + 0.16);
    mGroup.add(fgRod);
  });

  // =========================================================================
  // 7. OUTFEED GREEN FLAT CONVEYOR (Parallel to Production Line: West to East)
  // (Matching User Answer A2 & A3: running from x = 0.5 eastward towards +X)
  // =========================================================================
  const convL = 3.6;  // Length along X
  const convW = 0.68; // Width along Z
  const convH = 0.78; // Height from ground (ergonomic belt level)
  const convStartX = 0.6; // starts inside machine under feeder/sealing exit
  const convCenterX = convStartX + convL / 2; // centers at x = 2.4
  const convCenterZ = 0.28; // placed slightly forward for clear visibility

  // Extruded Aluminum Conveyor Frame Bed
  const convFrame = new THREE.Mesh(new THREE.BoxGeometry(convL, 0.12, convW), aluminumFrameMat);
  convFrame.position.set(convCenterX, convH - 0.06, convCenterZ);
  mGroup.add(convFrame);

  // Forest Green PVC Conveyor Belt (Image 1 signature)
  const greenBelt = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(convL + 0.04, 0.025, convW - 0.06), greenBeltMat));
  greenBelt.position.set(convCenterX, convH + 0.012, convCenterZ);
  mGroup.add(greenBelt);

  // Adjustable Aluminum Conveyor Support Legs (4 legs with dark leveling feet)
  [
    [convCenterX - convL / 2 + 0.35, convCenterZ - convW / 2 + 0.08],
    [convCenterX + convL / 2 - 0.35, convCenterZ - convW / 2 + 0.08],
    [convCenterX - convL / 2 + 0.35, convCenterZ + convW / 2 - 0.08],
    [convCenterX + convL / 2 - 0.35, convCenterZ + convW / 2 - 0.08]
  ].forEach(function (lp) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, convH - 0.12, 0.06), aluminumFrameMat);
    leg.position.set(lp[0], (convH - 0.12) / 2, lp[1]);
    mGroup.add(leg);

    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.03, 12), darkSteel);
    foot.position.set(lp[0], 0.015, lp[1]);
    mGroup.add(foot);
  });

  // Stainless Steel Side Guide Rails along both sides of conveyor
  [-convW / 2 + 0.02, convW / 2 - 0.02].forEach(function (rz) {
    const sRail = new THREE.Mesh(new THREE.BoxGeometry(convL, 0.06, 0.02), chromeMat);
    sRail.position.set(convCenterX, convH + 0.055, convCenterZ + rz);
    mGroup.add(sRail);
  });

  // -------------------------------------------------------------------------
  // 3-RING HOLD-DOWN ROLLER ASSEMBLY (Image 1 signature)
  // Located at exit point from machine (x = baseW/2 = 2.6)
  // -------------------------------------------------------------------------
  const rollerStationX = baseW / 2 - 0.15; // exactly at machine enclosure discharge exit

  // Inclined stainless steel discharge guide plate
  const dischargePlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, convW), chromeMat);
  dischargePlate.position.set(rollerStationX - 0.22, convH + 0.06, convCenterZ);
  dischargePlate.rotation.z = -0.18;
  mGroup.add(dischargePlate);

  // Transverse stainless steel roller axle shaft spanning across conveyor
  const crossShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, convW + 0.14, 16), chromeMat);
  crossShaft.rotation.x = Math.PI / 2;
  crossShaft.position.set(rollerStationX, convH + 0.22, convCenterZ);
  mGroup.add(crossShaft);
  rollersOut.push(crossShaft);

  // End Pillow-Block Flange Bearings on both sides
  [-convW / 2 - 0.05, convW / 2 + 0.05].forEach(function (bz) {
    const pBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.06), darkSteel);
    pBlock.position.set(rollerStationX, convH + 0.22, convCenterZ + bz);
    mGroup.add(pBlock);
  });

  // 3 White Hold-Down Roller Rings riding on exiting pouches (seen in Image 1)
  [-0.12, 0, 0.12].forEach(function (ringZ) {
    const holdDownRing = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.035, 16), whiteSpoutMat);
    holdDownRing.rotation.x = Math.PI / 2;
    holdDownRing.position.set(rollerStationX, convH + 0.22, convCenterZ + ringZ);
    mGroup.add(holdDownRing);
    rollersOut.push(holdDownRing);
  });

  // -------------------------------------------------------------------------
  // SPOUT POUCHES LYING FLAT ON GREEN BELT (Image 1 signature & User Answer A3)
  // Hygiene Refill pouches with white corner spouts, spaced along the belt
  // -------------------------------------------------------------------------
  [
    rollerStationX - 0.55, // just exiting under hold-down roller
    rollerStationX + 0.35, // traveling along belt
    rollerStationX + 1.25  // approaching packaging end
  ].forEach(function (pxOff, pIdx) {
    const convPouch = createPouchMesh({
      hasSpout: true,
      spoutColor: 0xffffff, // White screw cap matching factory photos
      width: 0.44,
      height: 0.58,
      depth: 0.085,
      isCornerSpout: true
    });
    // Lying flat on the green belt
    convPouch.position.set(pxOff, convH + 0.045, convCenterZ + (pIdx % 2 === 0 ? 0.03 : -0.03));
    convPouch.rotation.x = -Math.PI / 2;
    convPouch.rotation.z = (pIdx % 2 === 0 ? -0.06 : 0.06);
    mGroup.add(convPouch);
  });

  // -------------------------------------------------------------------------
  // ANGLED OPERATOR CONTROL PUSH-BUTTON CONSOLE (Image 1 signature)
  // Mounted on the side of the conveyor opening
  // -------------------------------------------------------------------------
  const consolePanel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.16), aluminumFrameMat);
  consolePanel.position.set(rollerStationX + 0.18, convH + 0.24, convCenterZ + convW / 2 + 0.08);
  consolePanel.rotation.y = -0.32;
  mGroup.add(consolePanel);

  // Big Red Mushroom Emergency Stop Button on Yellow Collar (Prominent in Image 1)
  const eStopBase = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
  eStopBase.rotation.x = Math.PI / 2;
  eStopBase.position.set(rollerStationX + 0.18, convH + 0.34, convCenterZ + convW / 2 + 0.18);
  mGroup.add(eStopBase);

  const eStopButton = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.03, 14), new THREE.MeshLambertMaterial({ color: 0xdc2626 }));
  eStopButton.rotation.x = Math.PI / 2;
  eStopButton.position.set(rollerStationX + 0.18, convH + 0.34, convCenterZ + convW / 2 + 0.20);
  mGroup.add(eStopButton);

  // Illuminated push buttons (Green START & Blue JOG)
  const grnBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10), new THREE.MeshLambertMaterial({ color: 0x22c55e }));
  grnBtn.rotation.x = Math.PI / 2;
  grnBtn.position.set(rollerStationX + 0.18, convH + 0.22, convCenterZ + convW / 2 + 0.18);
  mGroup.add(grnBtn);

  const bluBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10), new THREE.MeshLambertMaterial({ color: 0x2563eb }));
  bluBtn.rotation.x = Math.PI / 2;
  bluBtn.position.set(rollerStationX + 0.18, convH + 0.14, convCenterZ + convW / 2 + 0.18);
  mGroup.add(bluBtn);

  // =========================================================================
  // 8. PC WORKSTATION WITH MACHINE HMI MONITOR (Image 3 signature)
  // Mounted on articulated arm on right side of enclosure
  // =========================================================================
  const pcArmGroup = new THREE.Group();
  pcArmGroup.position.set(baseW / 2 + 0.15, baseH + 0.95, encHalfD - 0.25);

  // Articulated mounting pipe bracket
  const pcArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 12), darkSteel);
  pcArm1.rotation.z = Math.PI / 2;
  pcArm1.position.set(0.20, 0, 0);
  pcArmGroup.add(pcArm1);

  const pcArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.35, 12), darkSteel);
  pcArm2.position.set(0.40, 0.15, 0);
  pcArmGroup.add(pcArm2);

  // LCD Monitor Body (Wide Aspect)
  const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 0.06), darkSteel);
  monitorBody.position.set(0.40, 0.48, 0);
  monitorBody.rotation.y = -0.22;
  pcArmGroup.add(monitorBody);

  // Glowing Green Machine UI Screen (Like NCA software screen in Image 3)
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x064e3b });
  const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.38), screenMat);
  screenFace.position.set(0.40, 0.48, 0.032);
  screenFace.rotation.y = -0.22;
  pcArmGroup.add(screenFace);

  // Green NCA software header bar
  const ncaBar = new THREE.Mesh(new THREE.PlaneGeometry(0.60, 0.06), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
  ncaBar.position.set(0.40, 0.62, 0.035);
  ncaBar.rotation.y = -0.22;
  pcArmGroup.add(ncaBar);

  // Keyboard and mouse tray beneath monitor
  const kbTray = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.02, 0.24), darkSteel);
  kbTray.position.set(0.40, 0.22, 0.10);
  kbTray.rotation.y = -0.22;
  pcArmGroup.add(kbTray);

  // Keyboard block
  const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.015, 0.16), charcoalMat);
  kbMesh.position.set(0.36, 0.23, 0.10);
  kbMesh.rotation.y = -0.22;
  pcArmGroup.add(kbMesh);

  mGroup.add(pcArmGroup);

  // =========================================================================
  // 9. AUTHENTIC FACTORY SURROUNDINGS (Packaging Carton Boxes)
  // =========================================================================
  // Corrugated Cardboard Packing Carton Boxes on floor / table
  // Box 1: Open carton next to conveyor being filled with finished pouches
  const packBox1 = createKraftCartonBox({ width: 0.95, height: 0.72, depth: 0.85, openTop: true });
  packBox1.position.set(convCenterX + convL / 2 + 0.35, 0.0, convCenterZ);
  mGroup.add(packBox1);

  // Finished spouted pouches standing packed inside box
  for (let pb = 0; pb < 3; pb++) {
    const packedPouch = createPouchMesh({
      hasSpout: true,
      spoutColor: 0xffffff,
      width: 0.38,
      height: 0.52,
      depth: 0.075,
      isCornerSpout: true
    });
    packedPouch.position.set(convCenterX + convL / 2 + 0.20 + pb * 0.15, 0.62, convCenterZ);
    packedPouch.rotation.z = -0.15;
    mGroup.add(packedPouch);
  }

    // Industrial Wooden Pallet loaded with Finished Spout Pouch Cartons beside the machine
  const palW = 1.9;
  const palD = 1.45;
  const palH = 0.15;
  const palX = 3.6;
  const palZ = 2.15;

  const spoutPalletGroup = new THREE.Group();
  spoutPalletGroup.position.set(palX, 0.0, palZ);
  spoutPalletGroup.rotation.y = 0.08;

  // Wooden Pallet Deck & Stringer Runners
  const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
  const woodBlockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });

  const plankCount = 6;
  const plankD = (palD - 0.08) / plankCount;
  for (let p = 0; p < plankCount; p++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.028, plankD * 0.88), woodMat);
    plank.position.set(0, palH - 0.014, -palD / 2 + plankD / 2 + p * plankD);
    plank.castShadow = true;
    plank.receiveShadow = true;
    spoutPalletGroup.add(plank);
  }

  [-palW / 2 + 0.10, 0, palW / 2 - 0.10].forEach(function (rx) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.14, palH - 0.05, palD), woodBlockMat);
    runner.position.set(rx, (palH - 0.05) / 2 + 0.02, 0);
    runner.castShadow = true;
    runner.receiveShadow = true;
    spoutPalletGroup.add(runner);
  });

  for (let p = 0; p < 3; p++) {
    const btmPlank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.02, palD * 0.22), woodMat);
    btmPlank.position.set(0, 0.01, -palD / 2 + 0.18 + p * (palD - 0.36) / 2);
    spoutPalletGroup.add(btmPlank);
  }

  // Stacked Shipping Boxes of Finished Spout Pouches (2 tiers of 2x2 boxes)
  const boxW = 0.88;
  const boxD = 0.65;
  const boxH = 0.46;
  const whiteTapeMat = getWhiteTapeMaterial();
  const labelMat = new THREE.MeshBasicMaterial({ map: getBoxStarflexLabelTexture() });

  const bOffsetsX = [-palW / 4, palW / 4];
  const bOffsetsZ = [-palD / 4, palD / 4];

  for (let tier = 0; tier < 2; tier++) {
    const curY = palH + tier * boxH;
    bOffsetsX.forEach(function (bx, xi) {
      bOffsetsZ.forEach(function (bz, zi) {
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftBoxMat);
        boxMesh.position.set(bx, curY + boxH / 2, bz);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        spoutPalletGroup.add(boxMesh);

        const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), whiteTapeMat);
        tape.position.set(bx, curY + boxH + 0.005, bz);
        spoutPalletGroup.add(tape);

        if (bz > 0) {
          const label = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.20), labelMat);
          label.position.set(bx, curY + boxH * 0.52, bz + boxD / 2 + 0.003);
          spoutPalletGroup.add(label);
        }
      });
    });
  }

  // Transparent stretch film shrink-wrap enclosing the pallet load
  const totalStackH = 2 * boxH;
  const wrapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(palW - 0.06, totalStackH + 0.04, palD - 0.06),
    getStretchWrapMaterial()
  );
  wrapMesh.position.set(0, palH + totalStackH / 2, 0);
  spoutPalletGroup.add(wrapMesh);

  mGroup.add(spoutPalletGroup);

  return mGroup;
}
