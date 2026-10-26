/* =========================================================================
   StarFlexERP 3D - Machine: Automatic Ultrasonic Spout Inserter & Welder (ST_SPOUT)
   Modeled directly from authentic factory photos (1:1 High-Fidelity Twin):
   1. Open industrial design without glass enclosure (per user request)
   2. Dual-tier base cabinet in industrial pale sage-grey with flush handles & dark kickplate
   3. Vibratory bowl feeder: white cylindrical drive base, stainless spiral bowl filled
      with white plastic spouts, overhead bulk hopper with support post, and linear vibrating track
   4. Triple digital temperature/pressure controllers with bright red LED 7-segment readouts
   5. Ultrasonic welding press head with vertical slide guide, dual foreground cylinders & reciprocating horn
   7. Outfeed green flat belt conveyor oriented parallel to production line (West to East)
   8. 3-ring hold-down roller assembly riding on exiting pouches, angled operator console with red E-Stop
   9. Finished Hygiene pouches with white corner spouts spaced on the green belt
   10. Articulated PC monitor workstation showing green NCA machine UI & keyboard tray
   11. Authentic factory details: corrugated packaging carton boxes, pallets, and worker
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

  // Green flat conveyor belt (forest green PVC belt as in factory photo)
  const greenBeltMat = new THREE.MeshLambertMaterial({ color: 0x15803d });

  // White plastic spout fitment material
  const whiteSpoutMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

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
  // 2. VIBRATORY BOWL FEEDER ASSEMBLY (Matching Factory Photo)
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
  hopper.position.set(feederCenterX + 0.48, baseH + 1.95, feederCenterZ - 0.40);
  mGroup.add(hopper);

  const hopperChute = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), chromeMat);
  hopperChute.position.set(feederCenterX + 0.36, baseH + 1.62, feederCenterZ - 0.28);
  hopperChute.rotation.z = -0.35;
  mGroup.add(hopperChute);

  // Vertical stainless support post for bulk hopper mounted on deck
  const hopperPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.95, 12), chromeMat);
  hopperPost.position.set(feederCenterX + 0.48, baseH + 0.04 + 1.95 / 2, feederCenterZ - 0.40);
  mGroup.add(hopperPost);

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

  // =========================================================================
  // 5. ULTRASONIC WELDING COLUMN & RECIPROCATING HORN (Left Workstation)
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
    fgCyl.position.set(weldX + cyOff, baseH + 0.24, baseD / 2 - 0.12);
    mGroup.add(fgCyl);

    const fgRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12), chromeMat);
    fgRod.rotation.x = Math.PI / 2;
    fgRod.position.set(weldX + cyOff, baseH + 0.24, baseD / 2 + 0.16);
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
  // SPOUT POUCHES ON GREEN BELT
  // Pouch 1: Exiting under hold-down roller, lying flat
  // Pouch 2: Finished Spouted Stand-Up Pouch sample standing upright on belt!
  //          Shifted downstream away from the machine body (per user request)
  // -------------------------------------------------------------------------
  // 1. Pouch exiting under roller (lying flat)
  const flatSpoutPouch = createPouchMesh({
    hasSpout: true,
    spoutColor: 0xffffff, // White screw cap matching factory photos
    width: 0.44,
    height: 0.58,
    depth: 0.085,
    isCornerSpout: true
  });
  flatSpoutPouch.position.set(rollerStationX + 0.25, convH + 0.045, convCenterZ + 0.02);
  flatSpoutPouch.rotation.x = -Math.PI / 2;
  flatSpoutPouch.rotation.z = -0.06;
  mGroup.add(flatSpoutPouch);

  // 2. Sample Spouted Stand-Up Pouch (standing upright, spaced away from machine)
  const sampleSpoutPouch = createPouchMesh({
    hasSpout: true,
    spoutColor: 0xffffff,
    width: 0.44,
    height: 0.58,
    depth: 0.085,
    isCornerSpout: true
  });
  sampleSpoutPouch.position.set(rollerStationX + 1.25, convH + 0.045, convCenterZ);
  sampleSpoutPouch.rotation.set(0, 0.18, 0); // Upright stand-up pouch sample facing viewer
  mGroup.add(sampleSpoutPouch);

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
  // 6. PC WORKSTATION WITH MACHINE HMI MONITOR (Image 3 signature)
  // Mounted on articulated arm on right side of machine base
  // =========================================================================
  const pcArmGroup = new THREE.Group();
  pcArmGroup.position.set(baseW / 2 + 0.15, baseH + 0.95, baseD / 2 - 0.25);

  // Vertical mounting post from base deck
  const pcPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 12), darkSteel);
  pcPost.position.set(baseW / 2 + 0.15, baseH + 0.95 / 2, baseD / 2 - 0.25);
  mGroup.add(pcPost);

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

    // Industrial Wooden Pallet loaded with Finished Spout Pouch Cartons beside the machine (media_1792732066355)
  const palX = 3.6;
  const palZ = 2.15;
  // 3 Kraft Corrugated Carton Boxes with white tape along front-left edge resting on floor (matching Bag workstation style)
  [-3.0, -1.9, -0.8].forEach(function (bx) {
    const fBox = createKraftCartonBox(1.05, 0.82, 1.05, 'z');
    fBox.position.set(bx, 0.0, 2.2);
    mGroup.add(fBox);
  });

  const spoutPalletGroup = createStandardBoxPallet({ width: 1.9, depth: 1.45, tiers: 2, hasWrap: true });
  spoutPalletGroup.position.set(palX, 0.0, palZ);
  spoutPalletGroup.rotation.y = 0.08;
  mGroup.add(spoutPalletGroup);

  return mGroup;
}
