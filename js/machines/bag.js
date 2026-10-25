/* =========================================================================
   StarFlexERP 3D - High-Precision Stand-Up Pouch Bag Making Machine (ST_BAG)
   Faithfully modeled based on actual factory reference photos:
   - Photo 1 & 2: Large Master Film Roll Unwinder & Tension Dancer Roller System
     * Jumbo roll on pneumatic air shaft with expansion chucks
     * Heavy black steel frame with tension dancer rollers & accumulator rack
     * Upper bridge beam with circular lightening holes
     * Local push-button control station on pedestal
   - Photo 3: Triangular Forming Plow (Plow Folder / V-Folder)
     * Angled triangular forming plow folding flat printed film in half
     * Polished diagonal forming rods & gusset bottom former
     * Chrome pneumatic adjustment cylinders
   - Photo 4 & 5: Sealing, Trimming, Cutting & Outfeed Conveyor Line
     * Modular stainless steel machine bed with lower access doors
     * Progressive Heat Sealing units (Bottom Gusset, Side Seal, Chill Block)
     * Top pneumatic press cylinders & spring-loaded pressure blocks
     * Micrometric side adjustment handwheels
     * Rotary edge trim slitters & scrap vacuum suction hoses
     * High-speed guillotine cross-cutting knife
     * Green flat belt delivery conveyor with Blue acrylic stacking divider tents
     * Stream of shingled finished flexible pouches on the green belt
     * Packing table extension & open corrugated carton box
     * Factory operator (cleanroom cap & uniform) packing pouches into carton
     * Articulated swing-arm HMI touch console
     * Finished goods wooden pallet with shrink-wrapped cartons
   ========================================================================= */

function buildBagMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Materials & Finishes
  const stainlessSteel = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.35, metalness: 0.65 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const frameBlack = new THREE.MeshLambertMaterial({ color: 0x0f172a });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.18, metalness: 0.85 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.30, metalness: 0.75 });
  const rubberBlack = new THREE.MeshLambertMaterial({ color: 0x111827 });
  const conveyorGreen = new THREE.MeshLambertMaterial({ color: 0x15803d }); // Authentic green PVC belt from Photos 4 & 5
  const blueAcrylic = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }); // Blue divider tents from Photos 4 & 5
  const orangeSealMat = new THREE.MeshLambertMaterial({ color: 0xf97316 }); // Heat seal silicone release strip
  const pneumaticBlue = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
  const whiteEnclosure = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
  const aluminumFoil = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (typeof sceneObjects !== 'undefined' && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  /* =========================================================================
     1. MACHINE BED & LOWER MODULAR ENCLOSURE (Center: x = 0.2, y = 0.38, z = 0)
     ========================================================================= */
  const bedLength = 4.2;
  const bedWidth = 1.45;
  const bedHeight = 0.76;

  // Recessed dark kick-plate base
  const kickBase = new THREE.Mesh(new THREE.BoxGeometry(bedLength + 0.1, 0.08, bedWidth + 0.05), frameBlack);
  kickBase.position.set(0.1, 0.04, 0);
  mGroup.add(kickBase);

  // Main stainless steel machine chassis bed
  const bedMesh = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(bedLength, bedHeight - 0.08, bedWidth), stainlessSteel));
  bedMesh.position.set(0.1, 0.42, 0);
  mGroup.add(bedMesh);

  // 4 Lower Stainless Steel Access / Inspection Doors with Chrome Pull Handles (Front / Operator side at z = +0.73)
  const doorW = 0.95;
  const doorH = 0.60;
  [-1.4, -0.4, 0.6, 1.6].forEach(function (dx) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, doorH, 0.025), stainlessSteel);
    door.position.set(dx, 0.42, bedWidth / 2 + 0.013);
    mGroup.add(door);

    // Chrome bar handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.04), chromeMat);
    handle.position.set(dx, 0.62, bedWidth / 2 + 0.038);
    mGroup.add(handle);
  });

  // Leveling Foot Pads under machine corners
  [
    [-1.9, -bedWidth / 2 + 0.1], [-1.9, bedWidth / 2 - 0.1],
    [2.1, -bedWidth / 2 + 0.1], [2.1, bedWidth / 2 - 0.1]
  ].forEach(function ([fx, fz]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), darkSteel);
    foot.position.set(fx, 0.03, fz);
    mGroup.add(foot);
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), chromeMat);
    stud.position.set(fx, 0.08, fz);
    mGroup.add(stud);
  });

  /* =========================================================================
     2. REAR JUMBO UNWIND STAND & TENSION DANCER TOWER (Photos 1 & 2: x = -4.8 to -2.6)
     ========================================================================= */
  const towerGroup = new THREE.Group();
  const towerH = 2.45;
  const towerW = 1.70;

  // 4 Heavy Black Steel Upright Columns (Box Beams 80x80mm)
  [
    [-4.5, -towerW / 2 + 0.1], [-4.5, towerW / 2 - 0.1],
    [-3.1, -towerW / 2 + 0.1], [-3.1, towerW / 2 - 0.1]
  ].forEach(function ([cx, cz]) {
    const col = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.12, towerH, 0.12), frameBlack));
    col.position.set(cx, towerH / 2, cz);
    towerGroup.add(col);
  });

  // Longitudinal & Transverse Connecting Beams
  [-towerW / 2 + 0.1, towerW / 2 - 0.1].forEach(function (bz) {
    const topLong = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.10, 0.10), frameBlack);
    topLong.position.set(-3.8, towerH - 0.05, bz);
    towerGroup.add(topLong);

    const midLong = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.08, 0.08), frameBlack);
    midLong.position.set(-3.8, 1.25, bz);
    towerGroup.add(midLong);
  });

  // Distinctive Upper Bridge Beam with Circular Lightening Holes (Photo 2)
  const holeBeamGroup = new THREE.Group();
  holeBeamGroup.position.set(-3.1, towerH - 0.18, 0);
  const beamPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, towerW - 0.2), frameBlack);
  holeBeamGroup.add(beamPlate);

  // 4 Circular Cutout Rings on the crossbeam
  [-0.55, -0.18, 0.18, 0.55].forEach(function (hz) {
    const holeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.145, 18), darkSteel);
    holeRing.rotation.x = Math.PI / 2;
    holeRing.position.set(0, 0, hz);
    holeBeamGroup.add(holeRing);
    const innerHole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.15, 16), chromeMat);
    innerHole.rotation.x = Math.PI / 2;
    innerHole.position.set(0, 0, hz);
    holeBeamGroup.add(innerHole);
  });
  towerGroup.add(holeBeamGroup);

  // Heavy-duty A-frame Bearing Pedestals for the Unwind Shaft
  [-towerW / 2 + 0.05, towerW / 2 - 0.05].forEach(function (pz) {
    const bearingBlock = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.40, 0.14), darkSteel);
    bearingBlock.position.set(-4.1, 1.35, pz);
    towerGroup.add(bearingBlock);

    // Brass expansion core safety chuck
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 18), brassMat);
    chuck.rotation.x = Math.PI / 2;
    chuck.position.set(-4.1, 1.35, pz + (pz > 0 ? -0.14 : 0.14));
    towerGroup.add(chuck);
  });

  // Large Master Film Roll (Jumbo Roll: diameter 1.2m, width 1.45m)
  const jumboRollAssembly = createActiveFilmRollAssembly(
    0.60,
    1.45,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(jumboRollAssembly.bodyMesh);
  jumboRollAssembly.group.position.set(-4.1, 1.35, 0);
  towerGroup.add(jumboRollAssembly.group);
  rollersOut.push(jumboRollAssembly.group);
  if (typeof sceneObjects !== 'undefined' && sceneObjects.dynamicRollRefs && sceneObjects.dynamicRollRefs.bagUnwindRolls) {
    sceneObjects.dynamicRollRefs.bagUnwindRolls.push(jumboRollAssembly);
  }

  // Floating Dancer Tension Roller & Counterbalance Arms (Photo 1)
  const dancerGroup = new THREE.Group();
  dancerGroup.position.set(-4.1, 0.48, 0);

  // Dancer Roller
  const dancerRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.45, 20), chromeMat);
  dancerRoll.rotation.x = Math.PI / 2;
  dancerGroup.add(dancerRoll);

  // Pivot arms & pneumatic cylinder
  [-0.75, 0.75].forEach(function (dz) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.04), darkSteel);
    arm.position.set(0.12, 0.08, dz);
    arm.rotation.z = -0.35;
    dancerGroup.add(arm);
  });
  const pneuCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 14), pneumaticBlue);
  pneuCyl.position.set(0.24, 0.22, 0.76);
  dancerGroup.add(pneuCyl);
  towerGroup.add(dancerGroup);

  // Vertical Accumulator Roller Bank between uprights at x = -3.1
  [0.85, 1.35, 1.85].forEach(function (ry) {
    const guideRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.45, 18), chromeMat);
    guideRoll.rotation.x = Math.PI / 2;
    guideRoll.position.set(-3.1, ry, 0);
    towerGroup.add(guideRoll);
  });
  // Black rubber nip rollers
  [1.10, 1.60].forEach(function (ny) {
    const nipRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.45, 20), rubberBlack);
    nipRoll.rotation.x = Math.PI / 2;
    nipRoll.position.set(-3.16, ny, 0);
    towerGroup.add(nipRoll);
  });

  // Top Guide Roller exiting tension section
  const topGuide = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.45, 18), chromeMat);
  topGuide.rotation.x = Math.PI / 2;
  topGuide.position.set(-2.65, towerH - 0.15, 0);
  towerGroup.add(topGuide);

  // Continuous Film Web in Tension Section
  const webMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.15,
    side: THREE.DoubleSide
  });

  // Web Segment 1: from Jumbo roll bottom down to dancer roll
  const web1Geo = new THREE.PlaneGeometry(1.42, 0.90);
  const web1 = new THREE.Mesh(web1Geo, webMat);
  web1.rotation.y = Math.PI / 2;
  web1.position.set(-4.1, 0.92, 0);
  towerGroup.add(web1);

  // Web Segment 2: from dancer up to top guide
  const web2Geo = new THREE.PlaneGeometry(1.42, 1.95);
  const web2 = new THREE.Mesh(web2Geo, webMat);
  web2.rotation.y = Math.PI / 2;
  web2.rotation.z = -0.15;
  web2.position.set(-3.35, 1.30, 0);
  towerGroup.add(web2);

  // Local Push-Button Control Station on Pedestal (Photo 1)
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.65, 14), darkSteel);
  pedestal.position.set(-3.85, 0.32, towerW / 2 + 0.15);
  towerGroup.add(pedestal);

  const buttonBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.18), stainlessSteel));
  buttonBox.position.set(-3.85, 0.72, towerW / 2 + 0.15);
  towerGroup.add(buttonBox);

  // Buttons on the panel
  [
    { y: 0.82, color: 0x16a34a }, // Green Start
    { y: 0.74, color: 0xdc2626 }, // Red Stop
    { y: 0.66, color: 0xfacc15 }  // Yellow Jog
  ].forEach(function (btn) {
    const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.03, 12), new THREE.MeshLambertMaterial({ color: btn.color }));
    bMesh.rotation.x = Math.PI / 2;
    bMesh.position.set(-3.85, btn.y, towerW / 2 + 0.25);
    towerGroup.add(bMesh);
  });
  // Emergency Stop Mushroom Button
  const eStop = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.04, 16), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
  eStop.rotation.x = Math.PI / 2;
  eStop.position.set(-3.85, 0.58, towerW / 2 + 0.25);
  towerGroup.add(eStop);

  mGroup.add(towerGroup);

  /* =========================================================================
     3. TRIANGULAR FORMING PLOW (PLOW FOLDER / V-FOLDER) (Photo 3: x = -2.6 to -1.2)
     ========================================================================= */
  const plowGroup = new THREE.Group();

  // Polished Stainless Steel Diagonal Guide Tubes forming the V-wedge
  const plowTubeMat = chromeMat;
  const plowTubeLen = 1.75;

  // Upper sloping guide tube
  const tubeUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, plowTubeLen, 16), plowTubeMat);
  tubeUpper.position.set(-1.95, 1.48, -0.28);
  tubeUpper.rotation.z = 0.78;
  tubeUpper.rotation.y = 0.24;
  plowGroup.add(tubeUpper);

  // Lower sloping guide tube
  const tubeLower = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, plowTubeLen, 16), plowTubeMat);
  tubeLower.position.set(-1.95, 1.48, 0.28);
  tubeLower.rotation.z = 0.78;
  tubeLower.rotation.y = -0.24;
  plowGroup.add(tubeLower);

  // Apex folding nose block where film reaches full fold
  const noseBlock = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.24), darkSteel);
  noseBlock.position.set(-1.32, 0.86, 0);
  plowGroup.add(noseBlock);

  // Pneumatic Gusset Insertion Disc & Adjuster Cylinder (creates the W-fold bottom for stand-up pouches)
  const gussetDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 24), chromeMat);
  gussetDisc.rotation.z = Math.PI / 2;
  gussetDisc.position.set(-1.45, 0.88, -0.32);
  plowGroup.add(gussetDisc);

  // Chrome support struts & black mounting clamp blocks (Photo 3)
  [-0.35, 0.35].forEach(function (pz) {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.95, 14), chromeMat);
    strut.position.set(-2.15, 1.45, pz);
    strut.rotation.x = (pz > 0 ? -0.45 : 0.45);
    plowGroup.add(strut);

    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), frameBlack);
    clamp.position.set(-2.15, 1.85, pz);
    plowGroup.add(clamp);
  });

  // Folded Continuous Web emerging from the V-plow
  const foldedWebGeo = new THREE.BoxGeometry(1.25, 0.025, 0.82);
  const foldedWeb = new THREE.Mesh(foldedWebGeo, webMat);
  foldedWeb.position.set(-1.25, 0.86, 0);
  plowGroup.add(foldedWeb);

  mGroup.add(plowGroup);

  /* =========================================================================
     4. MODULAR HEAT SEALING & COOLING STATIONS (Photo 4 & 5: x = -1.2 to +1.6)
     ========================================================================= */
  const sealGroup = new THREE.Group();

  // Top Horizontal Overhead Bridge Beam supported on 4 chrome guide columns
  const bridgeH = 1.72;
  [-0.95, 1.45].forEach(function (bx) {
    [-0.55, 0.55].forEach(function (bz) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, bridgeH - 0.76, 16), chromeMat);
      pillar.position.set(bx, (bridgeH + 0.76) / 2, bz);
      sealGroup.add(pillar);
    });
  });

  const bridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.12, 1.25), darkSteel);
  bridgeBeam.position.set(0.25, bridgeH, 0);
  sealGroup.add(bridgeBeam);

  // Station 1: Bottom Gusset Longitudinal Heat Sealer (x = -0.75)
  const gussetSealer = new THREE.Group();
  gussetSealer.position.set(-0.75, 1.05, -0.28);
  const gCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16), pneumaticBlue);
  gCyl.position.y = 0.38;
  gussetSealer.add(gCyl);
  const gBar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.22), brassMat);
  gussetSealer.add(gBar);
  sealGroup.add(gussetSealer);

  // Station 2: Main Transverse Side Heat Sealing Bar (x = 0.05) - Reciprocating Stamping Motion
  const sideSealer = new THREE.Group();
  sideSealer.position.set(0.05, 1.05, 0);

  // Dual top pneumatic press cylinders
  [-0.32, 0.32].forEach(function (cz) {
    const pressCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 16), pneumaticBlue);
    pressCyl.position.set(0, 0.36, cz);
    sideSealer.add(pressCyl);
  });

  // Upper heated seal bar with orange thermal silicone strip
  const sealBarBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 1.15), darkSteel);
  sideSealer.add(sealBarBody);
  const orangeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 1.05), orangeSealMat);
  orangeStrip.position.y = -0.10;
  sideSealer.add(orangeStrip);

  sealGroup.add(sideSealer);
  reciprocatorsOut.push({ mesh: sideSealer, baseY: 1.05 });

  // Station 3: Water-Cooled Chill Press Block (x = 0.85) - Reciprocating Stamping Motion
  const chillSealer = new THREE.Group();
  chillSealer.position.set(0.85, 1.05, 0);

  [-0.32, 0.32].forEach(function (cz) {
    const cCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16), pneumaticBlue);
    cCyl.position.set(0, 0.36, cz);
    chillSealer.add(cCyl);
  });
  const chillBlock = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 1.15), stainlessSteel);
  chillSealer.add(chillBlock);

  sealGroup.add(chillSealer);
  reciprocatorsOut.push({ mesh: chillSealer, baseY: 1.05 });

  // Micrometric Adjustment Handwheels along the operator side (Photo 4)
  [-0.75, -0.20, 0.35, 0.85].forEach(function (hx) {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(hx, 1.05, bedWidth / 2 + 0.04);

    // Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 12, 24), darkSteel);
    wheelGroup.add(rim);

    // Spokes & Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 14), chromeMat);
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(hub);

    // Revolving handle knob
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 12), chromeMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0.07, 0.07, 0.04);
    wheelGroup.add(knob);

    sealGroup.add(wheelGroup);
  });

  // Articulated Swing-Arm Overhead HMI Touch Console (Photo 5)
  const hmiGroup = new THREE.Group();
  hmiGroup.position.set(0.35, bridgeH, bedWidth / 2 - 0.1);

  // Vertical pivot post
  const hmiPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 14), chromeMat);
  hmiPost.position.y = 0.22;
  hmiGroup.add(hmiPost);

  // Horizontal swing arm
  const hmiArm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), whiteEnclosure);
  hmiArm.position.set(0.22, 0.45, 0.15);
  hmiArm.rotation.y = 0.42;
  hmiGroup.add(hmiArm);

  // Industrial Touchscreen Cabinet
  const hmiBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.12), whiteEnclosure));
  hmiBox.position.set(0.48, 0.35, 0.32);
  hmiGroup.add(hmiBox);

  // Touch display screen
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const hmiScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), screenMat);
  hmiScreen.position.set(0.48, 0.35, 0.385);
  hmiGroup.add(hmiScreen);

  sealGroup.add(hmiGroup);
  mGroup.add(sealGroup);

  /* =========================================================================
     5. EDGE TRIMMING SLITTERS & GUILLOTINE CUTTING KNIFE (Photo 4: x = +1.5 to +2.1)
     ========================================================================= */
  const cutGroup = new THREE.Group();
  cutGroup.position.set(1.75, 0.88, 0);

  // Rotary Edge Trimming Shear Discs (Trims unprinted margin)
  [-0.52, 0.52].forEach(function (tz) {
    const slitterDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.015, 20), chromeMat);
    slitterDisc.rotation.z = Math.PI / 2;
    slitterDisc.position.set(0, 0.06, tz);
    cutGroup.add(slitterDisc);

    // Flexible Spiral Vacuum Scrap Suction Hose
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 14), chromeMat);
    hose.position.set(0.08, -0.15, tz);
    hose.rotation.x = (tz > 0 ? 0.35 : -0.35);
    cutGroup.add(hose);
  });

  // Guillotine Cross-Cutting Knife (Reciprocating shear motion)
  const knifeGroup = new THREE.Group();
  knifeGroup.position.set(0.22, 0.16, 0);

  const knifeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.32, 14), pneumaticBlue);
  knifeCyl.position.y = 0.32;
  knifeGroup.add(knifeCyl);

  const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 1.15), chromeMat);
  knifeGroup.add(knifeBlade);

  cutGroup.add(knifeGroup);
  reciprocatorsOut.push({ mesh: knifeGroup, baseY: 0.16 });

  // Transparent Protective Guard Hood over cutter (Photo 4)
  const hoodMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.15,
    metalness: 0.1
  });
  const guardHood = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 1.25), hoodMat);
  guardHood.position.set(0.12, 0.22, 0);
  cutGroup.add(guardHood);

  // Yellow Hazard Caution Stripe on guard
  const hazardBar = new THREE.Mesh(new THREE.BoxGeometry(0.49, 0.04, 1.26), hazardYellow);
  hazardBar.position.set(0.12, 0.36, 0);
  cutGroup.add(hazardBar);

  mGroup.add(cutGroup);

  /* =========================================================================
     6. GREEN FLAT BELT CONVEYOR & PACKAGING OPERATOR (Photos 4 & 5: x = +2.1 to +4.6)
     ========================================================================= */
  const conveyorGroup = new THREE.Group();
  const convLen = 2.40;
  const convWidth = 0.88;
  const convHeight = 0.82;
  const convCenterX = 3.25;

  // Extruded Aluminum Conveyor Frame & Support Legs
  const convBase = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(convLen, 0.12, convWidth), stainlessSteel));
  convBase.position.set(convCenterX, convHeight - 0.06, 0);
  conveyorGroup.add(convBase);

  // 4 Tubular Support Legs with Adjustable Leveling Feet
  [
    [convCenterX - convLen / 2 + 0.15, -convWidth / 2 + 0.08],
    [convCenterX - convLen / 2 + 0.15, convWidth / 2 - 0.08],
    [convCenterX + convLen / 2 - 0.15, -convWidth / 2 + 0.08],
    [convCenterX + convLen / 2 - 0.15, convWidth / 2 - 0.08]
  ].forEach(function ([lx, lz]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, convHeight - 0.12, 14), chromeMat);
    leg.position.set(lx, (convHeight - 0.12) / 2, lz);
    conveyorGroup.add(leg);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14), darkSteel);
    pad.position.set(lx, 0.015, lz);
    conveyorGroup.add(pad);
  });

  // Flat Vibrant Green Conveyor Belt (Authentic green from Photos 4 & 5)
  const beltMesh = new THREE.Mesh(new THREE.BoxGeometry(convLen - 0.06, 0.02, convWidth - 0.08), conveyorGreen);
  beltMesh.position.set(convCenterX, convHeight + 0.01, 0);
  conveyorGroup.add(beltMesh);

  // Side Guide Rails along the conveyor
  [-convWidth / 2 + 0.02, convWidth / 2 - 0.02].forEach(function (rz) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(convLen, 0.06, 0.025), stainlessSteel);
    rail.position.set(convCenterX, convHeight + 0.05, rz);
    conveyorGroup.add(rail);
  });

  // Blue Acrylic "Tent" Stacking Dividers on Conveyor Belt (Photos 4 & 5)
  // Two angled royal blue guide tents sitting on the belt to neatly align the stream of pouches
  [convCenterX - 0.55, convCenterX + 0.15].forEach(function (tx) {
    const tentGroup = new THREE.Group();
    tentGroup.position.set(tx, convHeight + 0.10, 0);

    // Front flap
    const flap1 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.44), blueAcrylic);
    flap1.rotation.z = -0.55;
    flap1.position.set(-0.06, 0, 0);
    tentGroup.add(flap1);

    // Back flap
    const flap2 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.44), blueAcrylic);
    flap2.rotation.z = 0.55;
    flap2.position.set(0.06, 0, 0);
    tentGroup.add(flap2);

    conveyorGroup.add(tentGroup);
  });

  // Stream of Shingled Finished Hygiene Pouches moving along the green belt
  const pouchStreamX = [2.35, 2.75, 3.15, 3.55, 3.95];
  pouchStreamX.forEach(function (px, idx) {
    const pouch = createPouchMesh({
      hasSpout: false,
      width: 0.42,
      height: 0.58,
      depth: 0.065
    });
    // Laying flat/shingled on the green conveyor
    pouch.rotation.x = Math.PI / 2;
    pouch.rotation.z = -Math.PI / 2 + (idx % 2 === 0 ? 0.03 : -0.03);
    pouch.position.set(px, convHeight + 0.05 + idx * 0.008, 0);
    conveyorGroup.add(pouch);
  });

  // Stainless Packing Extension Shelf Table at exit (Photos 4 & 5)
  const packTable = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.76, 1.25), stainlessSteel);
  packTable.position.set(4.55, 0.38, 0);
  conveyorGroup.add(packTable);

  // Open Corrugated Carton Box collecting finished pouches from conveyor
  const openCarton = createKraftCartonBox({
    width: 0.90,
    height: 0.65,
    depth: 1.05,
    openTop: true
  });
  openCarton.position.set(4.55, 0.76, 0);
  conveyorGroup.add(openCarton);

  // Finished Hygiene pouches stacked inside the carton box ready for sealing
  for (let row = 0; row < 4; row++) {
    const boxPouch = createPouchMesh({
      hasSpout: false,
      width: 0.38,
      height: 0.52,
      depth: 0.065
    });
    boxPouch.position.set(4.38 + row * 0.11, 1.05, 0);
    boxPouch.rotation.z = -0.18;
    conveyorGroup.add(boxPouch);
  }

  // Factory Operator / Packaging Worker (Photo 5: grey polo uniform with white hygienic hair net cap)
  const packerWorker = createWorkerMesh(0x475569, 0xf8fafc);
  packerWorker.position.set(4.55, 0.0, 0.95);
  packerWorker.rotation.y = Math.PI; // Facing North towards the packing table and conveyor exit
  conveyorGroup.add(packerWorker);
  extraWorkersOut.push(packerWorker);

  mGroup.add(conveyorGroup);

  /* =========================================================================
     7. FINISHED GOODS WOODEN PALLET BESIDE OUTFEED (media_1792732066355)
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
