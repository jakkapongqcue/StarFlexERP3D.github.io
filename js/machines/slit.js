/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - Based on Official Industrial Reference (media_1792685873259 & media_1792686467592)
   - Rear / Input Side: Large Master Laminated Hygiene Roll (wide, large diameter)
   - Front / Output Side: Dual Rewind Shafts holding 2 Shorter Slit Hygiene Rolls
   - Top Overhead Canopy Bridge with Glowing Digital LED Speed Display:
     "Running Speed 004 m/min" + "STARFLEX VENUS III SLITTER"
   - Left Column: Dark Contrast Panel with "INTELLIGENT DIVIDING AND CUTTING"
   - Yellow Mechanical Swing Arms & Drag Chain
   - Right Column: Articulated Operator HMI Touchscreen Console & E-Stop
   - Foreground: Square Pallet with 3 Tiers of Shorter Slit Rolls & Cardboard Interlayers
   ========================================================================= */

let _cachedSlitDisplayTexture = null;
function getSlitLedDisplayTexture() {
  if (_cachedSlitDisplayTexture) return _cachedSlitDisplayTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  ctx.fillStyle = '#050b14';
  ctx.fillRect(20, 20, 720, canvas.height - 40);

  // Glowing Red LED Matrix Text (Matching Image 1: "Running Speed 004 m/min")
  ctx.font = 'bold 70px "Courier New", "Consolas", monospace';
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 14;
  ctx.fillText('Running Speed 004 m/min', 36, 118);

  ctx.shadowBlur = 0;
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('STARFLEX', 770, 85);
  ctx.font = '600 22px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('VENUS III SLITTER', 770, 125);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedSlitDisplayTexture = tex;
  return tex;
}

let _cachedSlitSidePanelTexture = null;
function getSlitSidePanelTexture() {
  if (_cachedSlitSidePanelTexture) return _cachedSlitSidePanelTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 44px "Segoe UI", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('INTELLIGENT DIVIDING AND CUTTING', 0, 0);
  ctx.restore();

  // Bottom ventilation louvers
  ctx.fillStyle = '#0f172a';
  for (let y = canvas.height - 180; y < canvas.height - 40; y += 16) {
    ctx.fillRect(24, y, canvas.width - 48, 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  _cachedSlitSidePanelTexture = tex;
  return tex;
}

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.75, roughness: 0.22 });
  const yellowArmMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 }); // Safety yellow linkage
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x0f172a, roughness: 0.9 });
  const printedWebMat = new THREE.MeshLambertMaterial({ color: 0xfacc15, transparent: true, opacity: 0.82 });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  const upRollSideMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12
  });
  const upRollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
  const rollMaterials = [upRollSideMat, upRollFaceMat, upRollFaceMat];

  // =========================================================================
  // 1. MACHINE BASE & GROUND SKID RAILS
  // =========================================================================
  const baseSlab = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.22, 3.4), charcoalMat));
  baseSlab.position.set(0.0, 0.11, -0.2);
  mGroup.add(baseSlab);

  // Dual chrome floor guide rails along the front
  [0.95, 1.15].forEach(function (rz) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 16), chromeMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0.0, 0.12, rz);
    mGroup.add(rail);
  });

  // Leveling machine support feet
  [-2.4, 2.4].forEach(function (fx) {
    [-1.6, 1.2].forEach(function (fz) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 12), darkSteel);
      foot.position.set(fx, 0.04, fz);
      mGroup.add(foot);
    });
  });

  // =========================================================================
  // 2. MAIN ARCH FRAME: LEFT & RIGHT UPRIGHT COLUMNS
  // =========================================================================
  // (a) Left Frame Column (x = -2.35)
  const leftCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.70, 3.35, 1.8), whiteSteel));
  leftCol.position.set(-2.35, 1.78, 0.0);
  mGroup.add(leftCol);

  // Left Outer Decal Panel with "INTELLIGENT DIVIDING AND CUTTING"
  const leftSidePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 3.1),
    new THREE.MeshBasicMaterial({ map: getSlitSidePanelTexture() })
  );
  leftSidePanel.position.set(-2.71, 1.78, 0.0);
  leftSidePanel.rotation.y = -Math.PI / 2; // Facing West
  mGroup.add(leftSidePanel);

  // Yellow Safety Swing Arm Mechanism on Left Column inner face (Matching Image 1)
  const yellowArmGrp = new THREE.Group();
  yellowArmGrp.position.set(-1.92, 1.85, 0.25);
  const armBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.65, 0.42), yellowArmMat);
  yellowArmGrp.add(armBody);
  // Pivot bosses & chrome pins
  [-0.65, 0.65].forEach(function (py) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 14), chromeMat);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(0, py, 0.12);
    yellowArmGrp.add(pin);
  });
  // Black cable carrier drag chain running alongside yellow arm
  const dragChain = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.75, 0.10), darkSteel);
  dragChain.position.set(-0.08, 0, -0.15);
  yellowArmGrp.add(dragChain);
  mGroup.add(yellowArmGrp);

  // (b) Right Frame Column (x = +2.35)
  const rightCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.70, 3.35, 1.8), whiteSteel));
  rightCol.position.set(2.35, 1.78, 0.0);
  mGroup.add(rightCol);

  // Swivel-mounted HMI Touchscreen Operator Console on Right Column
  const hmiArm = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.08), darkSteel);
  hmiArm.position.set(2.65, 1.95, 0.70);
  mGroup.add(hmiArm);

  const hmiConsole = new THREE.Group();
  hmiConsole.position.set(2.85, 1.95, 0.85);
  hmiConsole.rotation.y = -0.35; // Angled towards front operator
  const consoleHousing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.08), darkSteel);
  hmiConsole.add(consoleHousing);
  const consoleScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.32),
    new THREE.MeshBasicMaterial({ color: 0x0284c7 })
  );
  consoleScreen.position.set(0, 0, 0.045);
  hmiConsole.add(consoleScreen);
  mGroup.add(hmiConsole);

  // Emergency Stop Mushroom Button on Right Frame
  const estopCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), yellowArmMat);
  estopCollar.rotation.x = Math.PI / 2;
  estopCollar.position.set(1.95, 1.35, 0.92);
  mGroup.add(estopCollar);
  const estopButton = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16),
    new THREE.MeshLambertMaterial({ color: 0xdc2626 })
  );
  estopButton.rotation.x = Math.PI / 2;
  estopButton.position.set(1.95, 1.35, 0.95);
  mGroup.add(estopButton);

  // =========================================================================
  // 3. TOP OVERHEAD BRIDGE & DIGITAL LED SPEED DISPLAY
  // =========================================================================
  const bridgeCanopy = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.65, 1.6), whiteSteel));
  bridgeCanopy.position.set(0.0, 3.42, 0.0);
  mGroup.add(bridgeCanopy);

  // Glowing Digital LED Running Speed Display (Matching Image 1: "Running Speed 004 m/min")
  const ledDisplayMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.52),
    new THREE.MeshBasicMaterial({ map: getSlitLedDisplayTexture() })
  );
  ledDisplayMesh.position.set(0.0, 3.42, 0.81);
  mGroup.add(ledDisplayMesh);

  // Recessed task light bar under bridge canopy
  const taskLight = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.04, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  taskLight.position.set(0.0, 3.08, 0.15);
  mGroup.add(taskLight);

  // =========================================================================
  // 4. OUTPUT SIDE (FRONT): DUAL REWIND SHAFTS & 2 SHORTER SLIT ROLLS
  // (User Request: "ภาพี่เห็นคือภาพฝั่ง output จะมีลักษณะเป็นม้วนสั้น 2 ม้วน จากม้วนใหญ่ที่อยู่อีกฝั่ง")
  // =========================================================================
  const rollRadius = 0.38;
  const rollWidth = 0.78; // Short roll width (~0.8m)
  const shaftLength = 3.9;

  // (a) UPPER REWIND SHAFT (Cantilevered segmented friction shaft at y = 2.35, z = 0.42)
  const upperShaftGroup = new THREE.Group();
  upperShaftGroup.position.set(0.0, 2.35, 0.42);
  upperShaftGroup.rotation.z = Math.PI / 2;

  // Segmented friction shaft core
  const uShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, shaftLength, 16), chromeMat);
  upperShaftGroup.add(uShaftCore);

  // Friction rings along shaft
  for (let sy = -1.8; sy <= 1.8; sy += 0.18) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 16), chromeMat);
    ring.position.y = sy;
    upperShaftGroup.add(ring);
  }

  // ROLL 1 (ม้วนสั้นที่ 1): Mounted on Upper Shaft at center-right (local y = -0.65)
  const roll1Mesh = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 24),
    rollMaterials
  ));
  roll1Mesh.position.y = -0.65;
  upperShaftGroup.add(roll1Mesh);

  // Chrome chuck collars locking Roll 1
  [-0.65 - rollWidth / 2 - 0.03, -0.65 + rollWidth / 2 + 0.03].forEach(function (cy) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16), chromeMat);
    collar.position.y = cy;
    upperShaftGroup.add(collar);
  });

  rollersOut.push(upperShaftGroup);
  mGroup.add(upperShaftGroup);

  // Upper lay-on rubber roller riding on top of Roll 1
  const uLayonArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.45), darkSteel);
  uLayonArm.position.set(0.65, 2.82, 0.35);
  mGroup.add(uLayonArm);
  const uLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, rollWidth + 0.08, 14), rubberMat);
  uLayonRoller.rotation.z = Math.PI / 2;
  uLayonRoller.position.set(0.65, 2.82, 0.48);
  mGroup.add(uLayonRoller);

  // (b) LOWER REWIND SHAFT (Cantilevered segmented friction shaft at y = 1.25, z = 0.65)
  const lowerShaftGroup = new THREE.Group();
  lowerShaftGroup.position.set(0.0, 1.25, 0.65);
  lowerShaftGroup.rotation.z = Math.PI / 2;

  const lShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, shaftLength, 16), chromeMat);
  lowerShaftGroup.add(lShaftCore);

  for (let sy = -1.8; sy <= 1.8; sy += 0.18) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 16), chromeMat);
    ring.position.y = sy;
    lowerShaftGroup.add(ring);
  }

  // ROLL 2 (ม้วนสั้นที่ 2): Staggered Duplex position at center-left (local y = +0.65)
  const roll2Mesh = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 24),
    rollMaterials
  ));
  roll2Mesh.position.y = 0.65;
  lowerShaftGroup.add(roll2Mesh);

  [-0.65 - rollWidth / 2 - 0.03, -0.65 + rollWidth / 2 + 0.03].forEach(function (cy) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16), chromeMat);
    collar.position.y = -cy;
    lowerShaftGroup.add(collar);
  });

  rollersOut.push(lowerShaftGroup);
  mGroup.add(lowerShaftGroup);

  // Lower lay-on rubber roller riding on bottom of Roll 2
  const lLayonArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.45), darkSteel);
  lLayonArm.position.set(-0.65, 0.78, 0.55);
  mGroup.add(lLayonArm);
  const lLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, rollWidth + 0.08, 14), rubberMat);
  lLayonRoller.rotation.z = Math.PI / 2;
  lLayonRoller.position.set(-0.65, 0.78, 0.70);
  mGroup.add(lLayonRoller);

  // Tension idler guide rollers between shafts
  [1.75, 2.05].forEach(function (gy) {
    const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.8, 16), rubberMat);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(0.0, gy, 0.12);
    mGroup.add(idler);
  });

  // =========================================================================
  // 5. CENTRAL SLITTING KNIFE SECTION
  // =========================================================================
  const anvilShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 16), darkSteel);
  anvilShaft.rotation.z = Math.PI / 2;
  anvilShaft.position.set(0.0, 1.85, -0.15);
  mGroup.add(anvilShaft);

  // Circular rotary shear slitting blades
  [-0.65, 0.0, 0.65].forEach(function (kx) {
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.035, 18), chromeMat);
    blade.rotation.z = Math.PI / 2;
    blade.position.set(kx, 1.95, -0.15);
    mGroup.add(blade);
  });

  // =========================================================================
  // 6. INPUT SIDE (REAR / OPPOSITE SIDE): LARGE MASTER ROLL
  // (User Request: "จากม้วนใหญ่ที่อยู่อีกฝั่ง")
  // =========================================================================
  const masterRadius = 0.65;
  const masterWidth = 2.40;

  // Unwind cantilevered side support arms extending rearward
  [-1.48, 1.48].forEach(function (ux) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.10, 1.40), whiteSteel);
    arm.position.set(ux, 1.35, -1.25);
    mGroup.add(arm);

    // Large pneumatic brake drum & motor chuck
    const brakeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 18), darkSteel);
    brakeDrum.rotation.z = Math.PI / 2;
    brakeDrum.position.set(ux + (ux > 0 ? 0.14 : -0.14), 1.65, -1.55);
    mGroup.add(brakeDrum);
  });

  // LARGE MASTER UNWIND ROLL
  const masterRollGroup = new THREE.Group();
  masterRollGroup.position.set(0.0, 1.65, -1.55);
  masterRollGroup.rotation.z = Math.PI / 2;

  const masterRollBody = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(masterRadius, masterRadius, masterWidth, 28),
    rollMaterials
  ));
  masterRollGroup.add(masterRollBody);

  // Extended heavy steel core shaft
  const masterCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, masterWidth + 0.45, 18), darkSteel);
  masterRollGroup.add(masterCore);

  // Steel core chuck discs
  [-masterWidth / 2 - 0.02, masterWidth / 2 + 0.02].forEach(function (cy) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 18), chromeMat);
    disc.position.y = cy;
    masterRollGroup.add(disc);
  });

  rollersOut.push(masterRollGroup);
  mGroup.add(masterRollGroup);

  // Overhead tension web from master roll over guide rollers into slitter
  const webTop = new THREE.Mesh(new THREE.BoxGeometry(masterWidth - 0.04, 0.015, 1.25), printedWebMat);
  webTop.position.set(0.0, 2.32, -0.85);
  webTop.rotation.x = 0.25;
  mGroup.add(webTop);

  // Split webs feeding into Upper and Lower rolls
  const webUpper = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.55), printedWebMat);
  webUpper.position.set(0.65, 2.10, 0.18);
  webUpper.rotation.x = 0.65;
  mGroup.add(webUpper);

  const webLower = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.72), printedWebMat);
  webLower.position.set(-0.65, 1.55, 0.25);
  webLower.rotation.x = -0.55;
  mGroup.add(webLower);

  // =========================================================================
  // 7. FOREGROUND SQUARE PALLET (3 TIERS OF SHORT ROLLS & CARDBOARD SHEETS)
  // =========================================================================
  const palletSize = 2.1;
  const palletDeckH = 0.08;
  const palletRunnerH = 0.08;
  const palletTotalH = palletDeckH + palletRunnerH;
  const palX = 2.2;
  const palZ = 2.55;

  const palletGroup = new THREE.Group();
  palletGroup.position.set(palX, 0.0, palZ);

  const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
  const woodBlockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });

  const palletDeck = new THREE.Mesh(new THREE.BoxGeometry(palletSize, palletDeckH, palletSize), woodMat);
  palletDeck.position.y = palletRunnerH + palletDeckH / 2;
  palletDeck.castShadow = true;
  palletDeck.receiveShadow = true;
  palletGroup.add(palletDeck);

  [-0.85, 0, 0.85].forEach(function (bx) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(0.20, palletRunnerH, palletSize), woodBlockMat);
    runner.position.set(bx, palletRunnerH / 2, 0);
    runner.castShadow = true;
    runner.receiveShadow = true;
    palletGroup.add(runner);
  });
  mGroup.add(palletGroup);

  const sheetSize = palletSize - 0.08;
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

  const stackRollRadius = 0.35;
  const stackRollHeight = 0.45;
  const stackRollGeo = new THREE.CylinderGeometry(stackRollRadius, stackRollRadius, stackRollHeight, 22);
  const stackCoreGeo = new THREE.CylinderGeometry(0.12, 0.12, stackRollHeight + 0.005, 14);
  const stackCoreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

  const gridOffsets = [-0.52, 0.52];
  let currentY = palletTotalH;

  for (let tier = 0; tier < 3; tier++) {
    const sheetY = currentY + sheetThick / 2;
    createCardboardInterlayer(sheetY);
    currentY += sheetThick;

    const rollCenterY = currentY + stackRollHeight / 2;
    gridOffsets.forEach(function (ox, rIdx) {
      gridOffsets.forEach(function (oz, cIdx) {
        const roll = new THREE.Mesh(stackRollGeo, rollMaterials);
        roll.position.set(palX + ox, rollCenterY, palZ + oz);
        roll.rotation.y = tier * 1.8 + rIdx * 2.2 + cIdx * 1.4;
        roll.castShadow = true;
        roll.receiveShadow = true;
        mGroup.add(roll);

        const core = new THREE.Mesh(stackCoreGeo, stackCoreMat);
        core.position.set(palX + ox, rollCenterY, palZ + oz);
        mGroup.add(core);
      });
    });

    currentY += stackRollHeight;
  }

  return mGroup;
}
