/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - Matches Real Factory Photo (media_1792685158811_232e01a9.jpg)
   - Unwind Side (Left / -X): 1 Large Master Film Roll (Laminated Hygiene Roll)
   - Middle Slitting Unit: Black guide rollers, rotary slitting knives &
     distinctive Safety Yellow swing arm with drag chain
   - Output Side (Right / +X): 2 Short Slit Rolls (Duplex Upper & Lower Shafts)
     with segmented chrome friction rings & split film ribbons
   - Overhead Bridge: White arch with red digital LED "Running Speed 320 m/min"
   - Foreground: Square pallet with 3 tiers of rolls & cardboard interlayers
   ========================================================================= */

let _cachedSlitLedTexture = null;
function getSlitLedDisplayTexture() {
  if (_cachedSlitLedTexture) return _cachedSlitLedTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark matte display screen background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle LED matrix grid background pattern
  ctx.fillStyle = '#141d2e';
  for (let x = 6; x < canvas.width; x += 10) {
    for (let y = 6; y < canvas.height; y += 10) {
      ctx.fillRect(x, y, 3, 3);
    }
  }

  // Glowing red digital LED lettering matching real factory photo ("Running Speed 004 m/min")
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 36px "Courier New", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 12;
  ctx.fillText('Running Speed 320 m/min', canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  _cachedSlitLedTexture = texture;
  return texture;
}

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const slateMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.82, roughness: 0.18 });
  const darkChromeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.75, roughness: 0.35 });
  const safetyYellowMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
  const redButtonMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
  const cyanBadgeMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // =========================================================================
  // 1. UNWIND SIDE (LEFT / -X): 1 LARGE MASTER ROLL (ม้วนใหญ่จากฝั่ง Unwind)
  // Matching Laminated Hygiene Roll Output (wide master web before slitting)
  // =========================================================================
  const masterRadius = 1.25;
  const masterWidth = 2.70;
  const masterX = -3.70;
  const masterY = 1.85;
  const masterZ = -0.70;

  const masterRollObj = createActiveFilmRollAssembly(
    masterRadius,
    masterWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(masterRollObj.bodyMesh);
  masterRollObj.group.position.set(masterX, masterY, masterZ);
  mGroup.add(masterRollObj.group);
  rollersOut.push(masterRollObj.group);

  // Heavy-duty Unwind Stanchion Arms with pneumatic disc brake
  [-2.25, 0.85].forEach(function (zArm) {
    const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.3, 0.30), charcoalMat);
    standArm.position.set(masterX, 1.15, zArm);
    mGroup.add(standArm);

    // Brake caliper & spindle chuck
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 16), chromeMat);
    chuck.rotation.x = Math.PI / 2;
    chuck.position.set(masterX, masterY, zArm + (zArm > 0 ? -0.16 : 0.16));
    mGroup.add(chuck);
  });

  // Full-width Master Film Web traveling into slitter entrance
  const masterWebIn = createFilmWebSpan(masterX + 0.3, masterY - 0.2, -1.6, 1.70, masterZ, masterWidth - 0.1, 0xbe185d, 0.92);
  mGroup.add(masterWebIn);

  // =========================================================================
  // 2. MAIN SLITTER REWINDER ARCHITECTURE (Matching Factory Photo)
  // Overhead White Bridge, Side Towers & Digital LED Speed Banner
  // =========================================================================
  const zSpanCenter = -0.70;
  const zSpanWidth = 2.90;

  // (a) Left Machine Frame Upright Cabinet (Charcoal body + White front bezel)
  const leftTower = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.8, zSpanWidth + 0.3), charcoalMat));
  leftTower.position.set(-1.40, 1.90, zSpanCenter);
  mGroup.add(leftTower);

  const leftBezel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.8, zSpanWidth + 0.32), whiteSteel);
  leftBezel.position.set(-1.05, 1.90, zSpanCenter);
  mGroup.add(leftBezel);

  // Cyan vertical branding badge ("INTELLIGENT DIVIDING AND CUTTING")
  const brandStripe = new THREE.Mesh(new THREE.BoxGeometry(0.10, 2.2, 0.14), cyanBadgeMat);
  brandStripe.position.set(-1.03, 1.95, zSpanCenter + 0.95);
  mGroup.add(brandStripe);

  // (b) Right Machine Frame Upright Tower (White Steel)
  const rightTower = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.8, zSpanWidth + 0.3), whiteSteel));
  rightTower.position.set(2.45, 1.90, zSpanCenter);
  mGroup.add(rightTower);

  // (c) Heavy-Duty Overhead Bridge (Arch connecting left & right towers)
  const bridgeWidth = 3.90; // spans from x = -1.40 to +2.50
  const bridgeBeam = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(bridgeWidth, 0.62, zSpanWidth + 0.35), whiteSteel));
  bridgeBeam.position.set(0.52, 3.65, zSpanCenter);
  mGroup.add(bridgeBeam);

  // Chamfered top roof cap
  const bridgeRoof = new THREE.Mesh(new THREE.BoxGeometry(bridgeWidth - 0.3, 0.22, zSpanWidth + 0.2), whiteSteel);
  bridgeRoof.position.set(0.52, 4.02, zSpanCenter);
  mGroup.add(bridgeRoof);

  // Digital LED Speed Banner on top front face (Matching Photo: "Running Speed 004 m/min")
  const ledTex = getSlitLedDisplayTexture();
  const ledDisplayMat = ledTex
    ? new THREE.MeshBasicMaterial({ map: ledTex })
    : new THREE.MeshBasicMaterial({ color: 0x090d16 });

  const ledBezel = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.44, 0.08), darkSteel);
  ledBezel.position.set(0.55, 3.65, zSpanCenter + (zSpanWidth + 0.35) / 2 + 0.03);
  mGroup.add(ledBezel);

  const ledScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.36), ledDisplayMat);
  ledScreen.position.set(0.55, 3.65, zSpanCenter + (zSpanWidth + 0.35) / 2 + 0.075);
  mGroup.add(ledScreen);

  // Under-bridge task lighting strip
  const lightBar = new THREE.Mesh(new THREE.BoxGeometry(bridgeWidth - 0.8, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  lightBar.position.set(0.52, 3.32, zSpanCenter);
  mGroup.add(lightBar);

  // (d) Distinctive Safety Yellow Swing Arm on Left Side (Signature from Photo!)
  const yellowArmGroup = new THREE.Group();
  yellowArmGroup.position.set(0.20, 1.85, zSpanCenter + (zSpanWidth / 2) + 0.08);

  // Main vertical yellow arm bracket
  const yellowBeam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.70, 0.24), safetyYellowMat);
  yellowBeam.position.set(0, 0, 0);
  yellowArmGroup.add(yellowBeam);

  // Diagonal support bracket
  const diagKnuckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.80, 0.18), safetyYellowMat);
  diagKnuckle.position.set(-0.24, -0.42, 0);
  diagKnuckle.rotation.z = Math.PI / 4;
  yellowArmGroup.add(diagKnuckle);

  // Black drag chain / cable carrier running along the yellow arm
  const dragChain = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.65, 0.10), darkSteel);
  dragChain.position.set(0.12, 0, 0);
  yellowArmGroup.add(dragChain);

  // Emergency Stop button & switch box on the arm
  const eStopBox = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.12), darkSteel);
  eStopBox.position.set(-0.10, 0.65, 0.10);
  yellowArmGroup.add(eStopBox);

  const eStopBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12), redButtonMat);
  eStopBtn.rotation.x = Math.PI / 2;
  eStopBtn.position.set(-0.10, 0.68, 0.18);
  yellowArmGroup.add(eStopBtn);

  mGroup.add(yellowArmGroup);

  // =========================================================================
  // 3. INTERNAL GUIDE ROLLERS & ROTARY SLITTING KNIVES (Web Splitting Center)
  // =========================================================================
  const rollerZLen = 2.70;
  // Black rubber guide rollers spanning along Z
  [-0.60, 0.15, 0.90].forEach(function (rx, idx) {
    const rShaftGrp = new THREE.Group();
    rShaftGrp.rotation.x = Math.PI / 2;
    rShaftGrp.position.set(rx, idx === 1 ? 1.60 : 1.95, zSpanCenter);

    const rShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, rollerZLen, 16), darkSteel);
    rShaftGrp.add(rShaft);

    // Rotary slitting shear knives at center (x = 0.15)
    if (idx === 1) {
      // Slitting knife collars at cut lines
      [-0.70].forEach(function (ky) {
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16), chromeMat);
        blade.position.y = ky;
        rShaftGrp.add(blade);
      });
    }

    mGroup.add(rShaftGrp);
    rollersOut.push(rShaftGrp);
  });

  // =========================================================================
  // 4. OUTPUT REWIND SECTION (DUPLEX SHAFTS: 2 SHORT SLIT ROLLS)
  // (ฝั่ง Output จะมีลักษณะเป็นม้วนสั้น 2 ม้วน จากม้วนใหญ่ที่อยู่อีกฝั่ง)
  // =========================================================================
  const rewindX = 1.75;
  const shaftLength = 2.70;
  const slitRollRadius = 0.62;
  const slitRollWidth = 0.85; // Short slit roll (approx 1/3 of master width)

  // Helper: Create a Segmented Chrome Differential Friction Shaft (เพลาแรงเสียดทานแบบปลอก)
  function createFrictionShaftMesh(xPos, yPos) {
    const shaftGrp = new THREE.Group();
    shaftGrp.position.set(xPos, yPos, zSpanCenter);
    shaftGrp.rotation.x = Math.PI / 2;

    // Core chrome shaft
    const coreShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, shaftLength, 16), chromeMat);
    shaftGrp.add(coreShaft);

    // Segmented differential friction collars (visible silver & dark rings seen in photo)
    for (let sy = -shaftLength / 2 + 0.15; sy <= shaftLength / 2 - 0.15; sy += 0.16) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 14), (Math.round(sy * 10) % 2 === 0 ? chromeMat : darkChromeMat));
      collar.position.y = sy;
      shaftGrp.add(collar);
    }

    // End bearing hub & chucks
    [-shaftLength / 2 - 0.06, shaftLength / 2 + 0.06].forEach(function (hy) {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 16), chromeMat);
      hub.position.y = hy;
      shaftGrp.add(hub);
    });

    mGroup.add(shaftGrp);
    return shaftGrp;
  }

  // (a) Top Rewind Friction Shaft (Upper Level: y = 2.50)
  createFrictionShaftMesh(rewindX, 2.50);

  // OUTPUT SHORT ROLL 1 (On Top Shaft, staggered toward the rear: z = -1.25)
  const topSlitRoll = createActiveFilmRollAssembly(
    slitRollRadius,
    slitRollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(topSlitRoll.bodyMesh);
  topSlitRoll.group.position.set(rewindX, 2.50, zSpanCenter - 0.55); // z = -1.25
  mGroup.add(topSlitRoll.group);
  rollersOut.push(topSlitRoll.group);

  // Upper Slit Film Web Ribbon: travelling from slitter knives up to the top short roll
  const upperWebRibbon = createFilmWebSpan(
    0.20, 1.65,
    rewindX, 2.45,
    zSpanCenter - 0.55,
    slitRollWidth - 0.05,
    0xbe185d,
    0.92
  );
  mGroup.add(upperWebRibbon);

  // (b) Bottom Rewind Friction Shaft (Lower Level: y = 1.45)
  createFrictionShaftMesh(rewindX, 1.45);

  // OUTPUT SHORT ROLL 2 (On Bottom Shaft, staggered toward the front: z = -0.15)
  const bottomSlitRoll = createActiveFilmRollAssembly(
    slitRollRadius,
    slitRollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(bottomSlitRoll.bodyMesh);
  bottomSlitRoll.group.position.set(rewindX, 1.45, zSpanCenter + 0.55); // z = -0.15
  mGroup.add(bottomSlitRoll.group);
  rollersOut.push(bottomSlitRoll.group);

  // Lower Slit Film Web Ribbon: travelling from slitter knives down to the bottom short roll
  const lowerWebRibbon = createFilmWebSpan(
    0.20, 1.65,
    rewindX, 1.45,
    zSpanCenter + 0.55,
    slitRollWidth - 0.05,
    0xbe185d,
    0.92
  );
  mGroup.add(lowerWebRibbon);

  // (c) Touchscreen HMI Operator Panel (Mounted on Right Tower)
  const hmiArm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.08), chromeMat);
  hmiArm.position.set(2.45, 2.15, zSpanCenter + zSpanWidth / 2 + 0.12);
  mGroup.add(hmiArm);

  const hmiConsole = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.10), darkSteel);
  hmiConsole.position.set(2.45, 2.25, zSpanCenter + zSpanWidth / 2 + 0.22);
  hmiConsole.rotation.y = -0.15;
  mGroup.add(hmiConsole);

  const hmiScreen = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.30, 0.01), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
  hmiScreen.position.set(2.45, 2.25, zSpanCenter + zSpanWidth / 2 + 0.275);
  hmiScreen.rotation.y = -0.15;
  mGroup.add(hmiScreen);

  // =========================================================================
  // 5. FOREGROUND SQUARE PALLET (3 Tiers of Rolls & Cardboard Interlayers)
  // =========================================================================
  const palletSize = 2.1;
  const palletDeckH = 0.08;
  const palletRunnerH = 0.08;
  const palletTotalH = palletDeckH + palletRunnerH; // 0.16
  const palX = 2.2;
  const palZ = 2.55;

  const palletGroup = new THREE.Group();
  palletGroup.position.set(palX, 0.0, palZ);

  // Authentic wooden pallet materials
  const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
  const woodBlockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });

  // Square upper deck
  const palletDeck = new THREE.Mesh(new THREE.BoxGeometry(palletSize, palletDeckH, palletSize), woodMat);
  palletDeck.position.y = palletRunnerH + palletDeckH / 2;
  palletDeck.castShadow = true;
  palletDeck.receiveShadow = true;
  palletGroup.add(palletDeck);

  // 3 bottom stringer runners
  [-0.85, 0, 0.85].forEach(function (bx) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.20, palletRunnerH, palletSize), woodBlockMat);
    runner.position.set(bx, palletRunnerH / 2, 0);
    runner.castShadow = true;
    runner.receiveShadow = true;
    palletGroup.add(runner);
  });
  mGroup.add(palletGroup);

  // Reusable Kraft Cardboard Interlayer Sheets (แผ่นกระดาษลังคั่นระหว่างชั้น)
  const sheetSize = palletSize - 0.08; // 2.02 x 2.02
  const sheetThick = 0.025;
  const kraftSheetMat = getKraftBoxMaterial();

  function createCardboardInterlayer(yCenter) {
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(sheetSize, sheetThick, sheetSize), kraftSheetMat);
    sheet.position.set(palX, yCenter, palZ);
    sheet.castShadow = true;
    sheet.receiveShadow = true;
    mGroup.add(sheet);
    return sheet;
  }

  // Shorter slit rolls (adjusted height as requested)
  const rollRadius = 0.35;
  const rollHeight = 0.45; // Shorter roll height
  const rollGeo = new THREE.CylinderGeometry(rollRadius, rollRadius, rollHeight, 22);
  const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, rollHeight + 0.005, 14);
  const coreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

  const upRollSideMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12
  });
  const upRollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
  const rollMaterials = [upRollSideMat, upRollFaceMat, upRollFaceMat];

  // 2x2 grid positions on the square pallet
  const gridOffsets = [-0.52, 0.52];

  // 3 Tiers of stacked slit rolls with cardboard interlayer sheets between tiers
  let currentY = palletTotalH; // 0.16

  for (let tier = 0; tier < 3; tier++) {
    // Cardboard interlayer sheet (placed on base pallet and between tiers)
    const sheetY = currentY + sheetThick / 2;
    createCardboardInterlayer(sheetY);
    currentY += sheetThick;

    // 4 Upright Rolls on this tier (2x2 grid)
    const rollCenterY = currentY + rollHeight / 2;
    gridOffsets.forEach(function (ox, rIdx) {
      gridOffsets.forEach(function (oz, cIdx) {
        const roll = new THREE.Mesh(rollGeo, rollMaterials);
        roll.position.set(palX + ox, rollCenterY, palZ + oz);
        roll.rotation.y = tier * 1.8 + rIdx * 2.2 + cIdx * 1.4; // Varied orientation
        roll.castShadow = true;
        roll.receiveShadow = true;
        mGroup.add(roll);

        // Center core hole
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(palX + ox, rollCenterY, palZ + oz);
        mGroup.add(core);
      });
    });

    currentY += rollHeight;
  }

  // =========================================================================
  // 6. CONTROL KIOSK & SURROUNDINGS
  // =========================================================================
  const slitKiosk = createBlueControlKioskMesh();
  slitKiosk.position.set(-2.9, 0.0, 2.05);
  mGroup.add(slitKiosk);

  return mGroup;
}
