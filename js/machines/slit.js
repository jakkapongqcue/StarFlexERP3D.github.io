/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - High-Precision Industrial Model based on Venus III Slitter Reference (media_1792687452200)
   - Rear / Input Side: Large Master Unwind Roll on Heavy Hydraulic Loading Arms
   - Front / Output Side: Dual Stationary Shafts with 2 Rotating Shorter Slit Rolls
   - Mechanical Swing Arms with Pneumatic Lay-On Cylinders & Rubber Contact Rollers
   - Central Rotary Slitter Shear Blades, Tension Idlers & Trim Extraction Nozzles
   - Right Column: Sleek Industrial Column with Vertical Blue "VENUS III" & Shaft Markers
   - Left Column: Integrated Operator Touchscreen HMI, Control Dials & E-Stop
   - Foreground: Square Pallet with 3 Tiers of Shorter Slit Rolls & Cardboard Sheets
   ========================================================================= */

let _cachedVenusRightColTexture = null;
function getVenusRightColumnTexture() {
  if (_cachedVenusRightColTexture) return _cachedVenusRightColTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Clean industrial white background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle chamfer highlight borders
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Vertical Blue "VENUS  III" text (matching reference image)
  ctx.save();
  ctx.translate(canvas.width / 2 + 10, canvas.height / 2 - 20);
  ctx.rotate(-Math.PI / 2);
  ctx.font = 'bold 58px "Segoe UI", "Arial Black", "Montserrat", sans-serif';
  ctx.fillStyle = '#0284c7';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '6px';
  ctx.fillText('VENUS  III', 0, 0);
  ctx.restore();

  // Thin vertical red precision optical line along inner frame edge
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(18, 120, 6, 780);

  // Shaft position badges: [ 1 ] for Upper Shaft, [ 2 ] for Lower Shaft
  // Badge 1 (Upper)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(40, 270, 48, 48, 8);
  ctx.fill();
  ctx.font = 'bold 32px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1', 64, 294);

  // Badge 2 (Lower)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(40, 600, 48, 48, 8);
  ctx.fill();
  ctx.font = 'bold 32px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('2', 64, 624);

  // Lower maintenance latch / lock indicator
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(40, 780, 80, 50);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(48, 790, 64, 12);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedVenusRightColTexture = tex;
  return tex;
}

let _cachedSlitHmiTexture = null;
function getSlitHmiConsoleTexture() {
  if (_cachedSlitHmiTexture) return _cachedSlitHmiTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Outer bezel
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner display screen
  ctx.fillStyle = '#020617';
  ctx.fillRect(20, 20, canvas.width - 40, 310);

  // Title bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 20, canvas.width - 40, 44);
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('STARFLEX VENUS III - CONTROLLER', 34, 50);

  // Green status badge
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(390, 28, 88, 28, 6);
  ctx.fill();
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AUTO OK', 400, 48);

  // Main Speed Readout
  ctx.font = 'bold 44px "Consolas", "Courier New", monospace';
  ctx.fillStyle = '#0ea5e9';
  ctx.fillText('450 m/min', 36, 120);
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('TARGET: 450 m/min | CURRENT SPEED', 38, 145);

  // Web Tension & Diameter Gauges
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(36, 170, 210, 65);
  ctx.fillRect(266, 170, 210, 65);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillText('UNWIND TENSION', 46, 194);
  ctx.fillText('REWIND TENSION', 276, 194);

  ctx.font = 'bold 24px "Consolas", monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('240 N', 46, 224);
  ctx.fillText('185 N', 276, 224);

  // Simulated live graph waveform
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(36, 290);
  for (let x = 36; x < 476; x += 20) {
    const y = 285 + Math.sin(x * 0.08) * 12;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Lower Button & Hardware Panel
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, 345, canvas.width - 40, 145);

  // Push buttons
  // Green Start Button
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(80, 415, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Black Stop Button
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(160, 415, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Amber Reset Button
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(240, 415, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rotary Selector Switch
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(320, 395, 42, 42);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(337, 385, 8, 30);

  // Warning Decal on Console
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(435, 435);
  ctx.lineTo(410, 435);
  ctx.lineTo(422, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillText('!', 419, 432);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedSlitHmiTexture = tex;
  return tex;
}

let _cachedWarningDecalTexture = null;
function getWarningDecalTexture() {
  if (_cachedWarningDecalTexture) return _cachedWarningDecalTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 128, 128);

  // Yellow hazard triangle
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(64, 12);
  ctx.lineTo(120, 112);
  ctx.lineTo(8, 112);
  ctx.closePath();
  ctx.fill();

  // Black border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Exclamation mark
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 54px "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 64, 76);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedWarningDecalTexture = tex;
  return tex;
}

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // =========================================================================
  // MATERIAL PALETTE (High-Fidelity Industrial Aesthetics)
  // =========================================================================
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const frameGrey = new THREE.MeshLambertMaterial({ color: 0x64748b }); // Industrial machine slate grey
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // Structure / motor dark steel
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // Base & frame bed
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.18 });
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const yellowArmMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
  const bronzeBushingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.35 });
  const filmWebMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12,
    side: THREE.DoubleSide
  });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // Raw Material / Product Appearance (CRITICAL: "สำคัญคงรูปแบบวัตถุดิบเดิมไว้")
  const upRollSideMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12
  });
  const upRollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
  const rollMaterials = [upRollSideMat, upRollFaceMat, upRollFaceMat];

  const warningDecalMat = new THREE.MeshBasicMaterial({
    map: getWarningDecalTexture(),
    transparent: true
  });

  // =========================================================================
  // 1. MACHINE FOUNDATION & GROUND LEVELING FEET
  // =========================================================================
  const baseSlab = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.22, 3.6), charcoalMat));
  baseSlab.position.set(0.0, 0.11, -0.2);
  mGroup.add(baseSlab);

  // Chrome precision floor track rails
  [0.95, 1.15].forEach(function (rz) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 16), chromeMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0.0, 0.12, rz);
    mGroup.add(rail);
  });

  // Heavy-duty cast leveling feet with threaded adjusters
  [-2.4, 2.4].forEach(function (fx) {
    [-1.6, 1.2].forEach(function (fz) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 14), darkSteel);
      foot.position.set(fx, 0.04, fz);
      mGroup.add(foot);

      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10), chromeMat);
      bolt.position.set(fx, 0.10, fz);
      mGroup.add(bolt);
    });
  });

  // =========================================================================
  // 2. MAIN ARCH FRAME: LEFT & RIGHT UPRIGHT COLUMNS
  // =========================================================================

  // (a) LEFT COLUMN (Embedded HMI touch console, buttons, e-stop, grab handle)
  const leftCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.35, 1.8), whiteSteel));
  leftCol.position.set(-2.35, 1.78, 0.0);
  mGroup.add(leftCol);

  // Left Inner Reinforcement Frame Plate (grey cast iron)
  const leftInnerPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 1.6), frameGrey);
  leftInnerPlate.position.set(-1.95, 1.78, 0.0);
  mGroup.add(leftInnerPlate);

  // Embedded Touchscreen HMI Panel on Left Column front face (matching Image 1)
  const hmiBezel = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.04), darkSteel);
  hmiBezel.position.set(-2.35, 2.25, 0.91);
  mGroup.add(hmiBezel);

  const hmiDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.58),
    new THREE.MeshBasicMaterial({ map: getSlitHmiConsoleTexture() })
  );
  hmiDisplay.position.set(-2.35, 2.25, 0.935);
  mGroup.add(hmiDisplay);

  // Large Mushroom Emergency Stop Button beside HMI (on left column front)
  const estopCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16), yellowArmMat);
  estopCollar.rotation.x = Math.PI / 2;
  estopCollar.position.set(-2.15, 1.80, 0.92);
  mGroup.add(estopCollar);

  const estopKnob = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16),
    new THREE.MeshLambertMaterial({ color: 0xdc2626 })
  );
  estopKnob.rotation.x = Math.PI / 2;
  estopKnob.position.set(-2.15, 1.80, 0.94);
  mGroup.add(estopKnob);

  // Horizontal Recessed Grab Handle Pocket on Left Column
  const handlePocket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.09, 0.06), darkSteel);
  handlePocket.position.set(-2.35, 1.45, 0.91);
  mGroup.add(handlePocket);

  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.44, 12), chromeMat);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(-2.35, 1.45, 0.94);
  mGroup.add(handleBar);

  // Small Caution Sticker below HMI
  const leftCautionDecal = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), warningDecalMat);
  leftCautionDecal.position.set(-2.52, 1.65, 0.91);
  mGroup.add(leftCautionDecal);

  // Maintenance Door Seams & Hinges on Left Outer Side
  [-0.45, 0.45].forEach(function (dz) {
    [1.15, 2.45].forEach(function (dy) {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 10), darkSteel);
      hinge.position.set(-2.72, dy, dz);
      mGroup.add(hinge);
    });
  });

  // (b) RIGHT COLUMN (White pillar with vertical blue "VENUS III", shaft index 1 & 2, bottom swivel foot)
  const rightCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.35, 1.8), whiteSteel));
  rightCol.position.set(2.35, 1.78, 0.0);
  mGroup.add(rightCol);

  // Right Inner Reinforcement Plate (grey cast iron)
  const rightInnerPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 1.6), frameGrey);
  rightInnerPlate.position.set(1.95, 1.78, 0.0);
  mGroup.add(rightInnerPlate);

  // Front Decal on Right Column: Vertical Blue "VENUS III", shaft numbers 1 & 2, red optical guide
  const rightColDecal = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 3.2),
    new THREE.MeshBasicMaterial({ map: getVenusRightColumnTexture(), transparent: true })
  );
  rightColDecal.position.set(2.35, 1.78, 0.91);
  mGroup.add(rightColDecal);

  // Black Operator Toggle Lever & Push-Button Panel on Right Column
  const rightAuxPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.04), darkSteel);
  rightAuxPanel.position.set(1.95, 1.85, 0.92);
  mGroup.add(rightAuxPanel);

  const rightHandleLever = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 10), chromeMat);
  rightHandleLever.rotation.x = 0.4;
  rightHandleLever.position.set(1.95, 1.95, 0.96);
  mGroup.add(rightHandleLever);

  const rightLeverKnob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), darkSteel);
  rightLeverKnob.position.set(1.95, 2.05, 1.02);
  mGroup.add(rightLeverKnob);

  // Distinctive Bottom Swivel Shaft Support Bearing Socket (matching Image 1 bottom right!)
  const swivelBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.18, 16), darkSteel);
  swivelBase.position.set(1.95, 0.18, 1.15);
  mGroup.add(swivelBase);

  const swivelCup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 14), bronzeBushingMat);
  swivelCup.position.set(1.95, 0.26, 1.15);
  mGroup.add(swivelCup);

  const swivelPin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12), chromeMat);
  swivelPin.position.set(1.95, 0.35, 1.15);
  mGroup.add(swivelPin);

  // =========================================================================
  // 3. TOP OVERHEAD HOOD & CANOPY (Sophisticated Tapered Hood without LED screen)
  // =========================================================================
  // Tapered Hood Canopy Body (Matching Image 1)
  const hoodGroup = new THREE.Group();
  hoodGroup.position.set(0.0, 3.48, 0.35);

  const hoodMain = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.42, 1.2), whiteSteel);
  hoodGroup.add(hoodMain);

  // Angled Front Lip on Hood
  const hoodLip = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.14, 0.45), whiteSteel);
  hoodLip.position.set(0.0, 0.14, 0.45);
  hoodLip.rotation.x = 0.35;
  hoodGroup.add(hoodLip);

  // Caution Decal on Top Hood Front
  const hoodCaution = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), warningDecalMat);
  hoodCaution.position.set(0.0, 0.05, 0.62);
  hoodGroup.add(hoodCaution);

  // Recessed High-Intensity LED Task Light Bar Underneath Canopy
  const taskLight = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.04, 0.18),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  taskLight.position.set(0.0, -0.21, 0.15);
  hoodGroup.add(taskLight);

  mGroup.add(hoodGroup);

  // Diagonal Support Struts anchoring Canopy backwards to machine frame (Matching Image 1)
  [-1.95, 1.95].forEach(function (sx) {
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 1.35), frameGrey);
    strut.position.set(sx, 3.42, -0.35);
    strut.rotation.x = -0.32;
    mGroup.add(strut);

    // Pivot Bosses on Struts
    [-0.55, 0.55].forEach(function (sz) {
      const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), chromeMat);
      boss.rotation.z = Math.PI / 2;
      boss.position.set(sx, 3.42 - sz * 0.25, -0.35 + sz);
      mGroup.add(boss);
    });
  });

  // =========================================================================
  // 4. OUTPUT REWIND SECTION: DUAL STATIONARY SHAFTS & ROTATING ROLLS
  // (User Request: "สำคัญคงรูปแบบวัตถุดิบเดิมไว้" & "มัวน film ต้องหมุน ไม่ใช่แกน")
  // =========================================================================
  const rollRadius = 0.38;
  const rollWidth = 0.78; // Short roll width (~0.8m)
  const shaftLength = 3.9;

  // Horizontal Linear Guide Rails across frame behind rewind shafts
  [1.50, 2.10].forEach(function (ry) {
    const guideRail = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.08, 0.06), darkSteel);
    guideRail.position.set(0.0, ry, -0.05);
    mGroup.add(guideRail);

    const chromeTrack = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.88, 12), chromeMat);
    chromeTrack.rotation.z = Math.PI / 2;
    chromeTrack.position.set(0.0, ry, -0.02);
    mGroup.add(chromeTrack);
  });

  // -------------------------------------------------------------------------
  // (a) UPPER REWIND STATION (Shaft fixed at Y = 2.35, Z = 0.42)
  // -------------------------------------------------------------------------
  // Stationary chrome friction shaft
  const uShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, shaftLength, 18), chromeMat);
  uShaftCore.rotation.z = Math.PI / 2;
  uShaftCore.position.set(0.0, 2.35, 0.42);
  mGroup.add(uShaftCore);

  // Segmented friction rings (skipping where Roll 1 sits: X = 0.65, W = 0.78)
  for (let sx = -1.8; sx <= 1.8; sx += 0.18) {
    if (sx >= 0.65 - rollWidth / 2 && sx <= 0.65 + rollWidth / 2) continue;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.06, 16), chromeMat);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(sx, 2.35, 0.42);
    mGroup.add(ring);
  }

  // UPPER ROLL 1 (ม้วนสั้นที่ 1): Rotating film roll around X axis
  const roll1Group = new THREE.Group();
  roll1Group.position.set(0.65, 2.35, 0.42);
  roll1Group.rotation.order = 'ZYX';
  roll1Group.rotation.z = Math.PI / 2;

  const roll1Mesh = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 26),
    rollMaterials
  ));
  roll1Group.add(roll1Mesh);

  // Chuck locking collars on Roll 1 ends
  [-rollWidth / 2 - 0.02, rollWidth / 2 + 0.02].forEach(function (cy) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), chromeMat);
    collar.position.y = cy;
    roll1Group.add(collar);
  });

  rollersOut.push(roll1Group);
  mGroup.add(roll1Group);

  // MECHANICAL SWING ARM & LAY-ON CONTACT ROLLER FOR UPPER ROLL (Matching Image 1)
  const uLayonAssembly = new THREE.Group();
  uLayonAssembly.position.set(0.65, 2.35, 0.0);

  // Heavy cast swing arms on left & right of Roll 1
  [-rollWidth / 2 - 0.08, rollWidth / 2 + 0.08].forEach(function (ax) {
    const swingArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.48), frameGrey);
    swingArm.position.set(ax, 0.28, 0.24);
    swingArm.rotation.x = -0.42;
    uLayonAssembly.add(swingArm);

    // Warning sticker on swing arm
    const armDecal = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), warningDecalMat);
    armDecal.position.set(ax + (ax > 0 ? 0.032 : -0.032), 0.28, 0.24);
    armDecal.rotation.y = ax > 0 ? Math.PI / 2 : -Math.PI / 2;
    uLayonAssembly.add(armDecal);

    // Pneumatic Actuation Cylinder (applies contact nip pressure against the roll)
    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), darkSteel);
    cylBody.position.set(ax, 0.52, 0.05);
    cylBody.rotation.x = -0.85;
    uLayonAssembly.add(cylBody);

    const cylRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.30, 10), chromeMat);
    cylRod.position.set(ax, 0.42, 0.22);
    cylRod.rotation.x = -0.85;
    uLayonAssembly.add(cylRod);
  });

  // Precision rubber lay-on roller riding on top of Roll 1
  const uLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, rollWidth + 0.06, 16), rubberMat);
  uLayonRoller.rotation.z = Math.PI / 2;
  uLayonRoller.position.set(0.0, 0.44, 0.42);
  uLayonAssembly.add(uLayonRoller);

  mGroup.add(uLayonAssembly);

  // -------------------------------------------------------------------------
  // (b) LOWER REWIND STATION (Shaft fixed at Y = 1.25, Z = 0.65)
  // -------------------------------------------------------------------------
  // Stationary chrome friction shaft
  const lShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, shaftLength, 18), chromeMat);
  lShaftCore.rotation.z = Math.PI / 2;
  lShaftCore.position.set(0.0, 1.25, 0.65);
  mGroup.add(lShaftCore);

  // Segmented friction rings (skipping where Roll 2 sits: X = -0.65, W = 0.78)
  for (let sx = -1.8; sx <= 1.8; sx += 0.18) {
    if (sx >= -0.65 - rollWidth / 2 && sx <= -0.65 + rollWidth / 2) continue;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.06, 16), chromeMat);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(sx, 1.25, 0.65);
    mGroup.add(ring);
  }

  // LOWER ROLL 2 (ม้วนสั้นที่ 2): Rotating film roll around X axis
  const roll2Group = new THREE.Group();
  roll2Group.position.set(-0.65, 1.25, 0.65);
  roll2Group.rotation.order = 'ZYX';
  roll2Group.rotation.z = Math.PI / 2;

  const roll2Mesh = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 26),
    rollMaterials
  ));
  roll2Group.add(roll2Mesh);

  [-rollWidth / 2 - 0.02, rollWidth / 2 + 0.02].forEach(function (cy) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), chromeMat);
    collar.position.y = cy;
    roll2Group.add(collar);
  });

  rollersOut.push(roll2Group);
  mGroup.add(roll2Group);

  // MECHANICAL SWING ARM & LAY-ON ROLLER FOR LOWER ROLL (Matching Image 1)
  const lLayonAssembly = new THREE.Group();
  lLayonAssembly.position.set(-0.65, 1.25, 0.0);

  [-rollWidth / 2 - 0.08, rollWidth / 2 + 0.08].forEach(function (ax) {
    const swingArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.48), frameGrey);
    swingArm.position.set(ax, -0.28, 0.42);
    swingArm.rotation.x = 0.42;
    lLayonAssembly.add(swingArm);

    const armDecal = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), warningDecalMat);
    armDecal.position.set(ax + (ax > 0 ? 0.032 : -0.032), -0.28, 0.42);
    armDecal.rotation.y = ax > 0 ? Math.PI / 2 : -Math.PI / 2;
    lLayonAssembly.add(armDecal);

    // Pneumatic Actuation Cylinder
    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), darkSteel);
    cylBody.position.set(ax, -0.52, 0.20);
    cylBody.rotation.x = 0.85;
    lLayonAssembly.add(cylBody);

    const cylRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.30, 10), chromeMat);
    cylRod.position.set(ax, -0.42, 0.40);
    cylRod.rotation.x = 0.85;
    lLayonAssembly.add(cylRod);
  });

  // Precision rubber lay-on roller riding on bottom of Roll 2
  const lLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, rollWidth + 0.06, 16), rubberMat);
  lLayonRoller.rotation.z = Math.PI / 2;
  lLayonRoller.position.set(0.0, -0.44, 0.65);
  lLayonAssembly.add(lLayonRoller);

  mGroup.add(lLayonAssembly);

  // Stationary Tension Idler & Spreader Rollers between shafts
  [1.75, 2.05].forEach(function (gy) {
    const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.8, 16), rubberMat);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(0.0, gy, 0.12);
    mGroup.add(idler);

    // End bearing blocks
    [-1.92, 1.92].forEach(function (bx) {
      const bBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.18), darkSteel);
      bBlock.position.set(bx, gy, 0.12);
      mGroup.add(bBlock);
    });
  });

  // Anti-static ionizing bar spanning above the rewind zone
  const ionBar = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.04), chromeMat);
  ionBar.position.set(0.0, 2.72, 0.35);
  mGroup.add(ionBar);

  // =========================================================================
  // 5. INTERMEDIATE BRIDGE & SLITTING KNIFE SECTION
  // =========================================================================
  // Heavy Side Chassis Connecting Plates with circular weight-reduction holes (Matching Image 1)
  [-1.94, 1.94].forEach(function (cx) {
    const sidePlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 1.8), frameGrey);
    sidePlate.position.set(cx, 1.55, -0.65);
    mGroup.add(sidePlate);

    // Lightening hole cutouts (dark recessed cylinders simulating holes)
    [-0.45, 0.35].forEach(function (hz) {
      [1.15, 1.85].forEach(function (hy) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.15, 14), charcoalMat);
        hole.rotation.z = Math.PI / 2;
        hole.position.set(cx, hy, -0.65 + hz);
        mGroup.add(hole);
      });
    });
  });

  // Slitter Anvil Cross-Shaft
  const anvilShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 18), darkSteel);
  anvilShaft.rotation.z = Math.PI / 2;
  anvilShaft.position.set(0.0, 1.85, -0.22);
  mGroup.add(anvilShaft);

  // Circular Rotary Slitter Knives with Cartridge Holders & Micrometer Knobs
  [-0.65, 0.0, 0.65].forEach(function (kx) {
    // Rotary circular shear blade
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.035, 20), chromeMat);
    blade.rotation.z = Math.PI / 2;
    blade.position.set(kx, 1.95, -0.22);
    mGroup.add(blade);

    // Blade clamp cartridge holder
    const holder = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.18), darkSteel);
    holder.position.set(kx, 2.12, -0.22);
    mGroup.add(holder);

    // Micrometer precision adjustment screw
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), bronzeBushingMat);
    dial.position.set(kx, 2.28, -0.22);
    mGroup.add(dial);
  });

  // Edge Trim Suction Nozzles & Vacuum Chutes (extracts waste film margins)
  [-1.75, 1.75].forEach(function (tx) {
    const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.22), darkSteel);
    nozzle.position.set(tx, 1.85, -0.18);
    mGroup.add(nozzle);

    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), frameGrey);
    duct.position.set(tx, 1.25, -0.35);
    duct.rotation.x = 0.25;
    mGroup.add(duct);
  });

  // =========================================================================
  // 6. INPUT REAR SIDE: LARGE MASTER UNWIND ROLL
  // (User Request: "สำคัญคงรูปแบบวัตถุดิบเดิมไว้" & "จากม้วนใหญ่ที่อยู่อีกฝั่ง")
  // =========================================================================
  const masterRadius = 0.65;
  const masterWidth = 2.40;

  // Heavy Unwind Cantilevered Pivoting Lift Arms (Hydraulic roll loading arms from floor)
  [-1.52, 1.52].forEach(function (ux) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.15, 1.45), frameGrey);
    arm.position.set(ux, 1.35, -1.25);
    mGroup.add(arm);

    // Hydraulic lift cylinder under the arm
    const liftCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.75, 14), darkSteel);
    liftCyl.position.set(ux, 0.75, -1.05);
    liftCyl.rotation.x = -0.35;
    mGroup.add(liftCyl);

    const liftPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), chromeMat);
    liftPiston.position.set(ux, 1.05, -1.18);
    liftPiston.rotation.x = -0.35;
    mGroup.add(liftPiston);

    // Large Pneumatic Disc Brake Unit with Caliper
    const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 20), darkSteel);
    brakeDisc.rotation.z = Math.PI / 2;
    brakeDisc.position.set(ux + (ux > 0 ? 0.16 : -0.16), 1.65, -1.55);
    mGroup.add(brakeDisc);

    const brakeCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.26), yellowArmMat);
    brakeCaliper.position.set(ux + (ux > 0 ? 0.16 : -0.16), 1.95, -1.55);
    mGroup.add(brakeCaliper);
  });

  // Web Edge Guide Sensor (BST / Fife optical edge alignment system)
  const edgeGuideArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.12), frameGrey);
  edgeGuideArm.position.set(1.35, 2.35, -1.15);
  mGroup.add(edgeGuideArm);

  const edgeSensorHead = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.18), darkSteel);
  edgeSensorHead.position.set(1.25, 2.55, -1.15);
  mGroup.add(edgeSensorHead);

  // Ultrasonic Roll Diameter Sensor aimed at the Master Roll
  const usSensor = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 12), chromeMat);
  usSensor.position.set(0.0, 2.55, -1.55);
  usSensor.rotation.x = Math.PI / 2;
  mGroup.add(usSensor);

  // Stationary core shaft through master roll
  const masterCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, masterWidth + 0.45, 18), darkSteel);
  masterCore.rotation.z = Math.PI / 2;
  masterCore.position.set(0.0, 1.65, -1.55);
  mGroup.add(masterCore);

  // LARGE MASTER UNWIND ROLL (ONLY the film body rotates around X)
  const masterRollGroup = new THREE.Group();
  masterRollGroup.position.set(0.0, 1.65, -1.55);
  masterRollGroup.rotation.order = 'ZYX';
  masterRollGroup.rotation.z = Math.PI / 2;

  const masterRollBody = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(masterRadius, masterRadius, masterWidth, 28),
    rollMaterials
  ));
  masterRollGroup.add(masterRollBody);

  // Chuck discs on roll end faces
  [-masterWidth / 2 - 0.02, masterWidth / 2 + 0.02].forEach(function (cy) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 18), chromeMat);
    disc.position.y = cy;
    masterRollGroup.add(disc);
  });

  rollersOut.push(masterRollGroup);
  mGroup.add(masterRollGroup);

  // Overhead tension web from master roll over guide rollers into slitter
  const webTop = new THREE.Mesh(new THREE.BoxGeometry(masterWidth - 0.04, 0.015, 1.25), filmWebMat);
  webTop.position.set(0.0, 2.32, -0.85);
  webTop.rotation.x = 0.25;
  mGroup.add(webTop);

  // Split webs feeding into Upper and Lower rolls
  const webUpper = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.55), filmWebMat);
  webUpper.position.set(0.65, 2.10, 0.18);
  webUpper.rotation.x = 0.65;
  mGroup.add(webUpper);

  const webLower = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.72), filmWebMat);
  webLower.position.set(-0.65, 1.55, 0.25);
  webLower.rotation.x = -0.55;
  mGroup.add(webLower);

  // =========================================================================
  // 7. FOREGROUND SQUARE PALLET (3 TIERS OF SHORT ROLLS & CARDBOARD SHEETS)
  // (User Request: "สำคัญคงรูปแบบวัตถุดิบเดิมไว้" & "ปรับ pallet ให้ห่างออกจากเครื่องนิดหน่อย")
  // =========================================================================
  const palletSize = 2.1;
  const palletDeckH = 0.08;
  const palletRunnerH = 0.08;
  const palletTotalH = palletDeckH + palletRunnerH;
  const palX = 2.85;
  const palZ = 3.35;

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
