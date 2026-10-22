/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - Matches Real Factory Reference Photo (media_1792685472733_832cd043.jpg):
     1. Infeed/Unwind Rear Side: Large Master Roll (ม้วนใหญ่ที่อยู่อีกฝั่ง)
     2. Output/Rewind Front Face: Dual Rewind Shafts with 2 Short Slit Rolls
        (ม้วนสั้น 2 ม้วน: ม้วนบน และ ม้วนล่าง เยื้องกันตามระบบ Duplex Slitting)
     3. Overhead Canopy Bridge with Red Digital LED Display:
        "Running Speed 004 m/min" & Green "SM MACHINERY" Badge
     4. Heavy Off-White Steel Enclosure with Charcoal Left Panel & Vertical Blue
        Typography: "INTELLIGENT DIVIDING AND CUTTING"
     5. Safety Yellow Mechanical Swing Arms & Black Cable Drag Chain (Cat Track)
     6. Segmented Friction Rings on Dual Rewind Shafts
     7. Front Polished Chrome Guide Slide Rails & Leveling Base Skid
     8. Articulating Touchscreen HMI Operator Terminal & E-Stop Console
     9. Foreground Square Wooden Pallet with 3 Tiers of Slit Rolls & Cardboard Sheets
   ========================================================================= */

let _cachedSlitMarqueeTexture = null;
function getSlitMarqueeTexture() {
  if (_cachedSlitMarqueeTexture) return _cachedSlitMarqueeTexture;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark display bezel
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle digital grid lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Red LED text: "Running Speed 004 m/min" matching the real photo
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 36px "Courier New", "Consolas", monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('Running Speed 004 m/min', canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  _cachedSlitMarqueeTexture = texture;
  return texture;
}

let _cachedSlitSideTextTexture = null;
function getSlitSideTextTexture() {
  if (_cachedSlitSideTextTexture) return _cachedSlitSideTextTexture;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark charcoal slate background
  ctx.fillStyle = '#263346';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Vertical blue typography: "INTELLIGENT DIVIDING AND CUTTING"
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px "Noto Sans", "Arial Black", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('INTELLIGENT DIVIDING AND CUTTING', 0, 0);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  _cachedSlitSideTextTexture = texture;
  return texture;
}

let _cachedSlitBrandTexture = null;
function getSlitBrandTexture() {
  if (_cachedSlitBrandTexture) return _cachedSlitBrandTexture;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 24px "Noto Sans", "Segoe UI", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('SM MACHINERY', canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  _cachedSlitBrandTexture = texture;
  return texture;
}

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Core Industrial Materials
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.18 });
  const darkChromeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.70, roughness: 0.30 });
  const yellowArmMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
  const dragChainMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
  const rubberRollerMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
  const eStopRedMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
  const screenBlueMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

  const marqueeMat = new THREE.MeshBasicMaterial({ map: getSlitMarqueeTexture() });
  const sideTextMat = new THREE.MeshLambertMaterial({ map: getSlitSideTextTexture() });
  const brandBadgeMat = new THREE.MeshLambertMaterial({ map: getSlitBrandTexture() });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // =========================================================================
  // 1. BASE FRAME & FRONT GUIDE SLIDE RAILS
  // =========================================================================
  const baseW = 5.6;
  const baseD = 3.6;
  const baseH = 0.22;

  // Main white steel base foundation
  const baseMesh = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(baseW, baseH, baseD), whiteSteel));
  baseMesh.position.set(0, baseH / 2, -0.2);
  mGroup.add(baseMesh);

  // 4 Leveling feet pads at corners
  [[-baseW / 2 + 0.25, -baseD / 2 + 0.2],
   [ baseW / 2 - 0.25, -baseD / 2 + 0.2],
   [-baseW / 2 + 0.25,  baseD / 2 - 0.2],
   [ baseW / 2 - 0.25,  baseD / 2 - 0.2]].forEach(function (fp) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 14), darkSteel);
    foot.position.set(fp[0], 0.04, fp[1] - 0.2);
    mGroup.add(foot);
  });

  // Dual polished chrome cylindrical slide rails on the front floor beam (seen in photo!)
  [-0.05, 0.08].forEach(function (zRailOff, rIdx) {
    const slideRail = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 4.8, 16), chromeMat);
    slideRail.rotation.z = Math.PI / 2;
    slideRail.position.set(0, baseH + 0.04 + rIdx * 0.03, baseD / 2 - 0.35 + zRailOff);
    mGroup.add(slideRail);
  });

  // =========================================================================
  // 2. MAIN SIDE STRUCTURAL UPRIGHT COLUMNS (Left & Right)
  // =========================================================================
  const colW = 0.75;
  const colH = 3.20;
  const colD = 2.20;
  const colY = colH / 2;

  // (a) LEFT COLUMN FRAME (x = -2.35): Embedded dark panel & "INTELLIGENT DIVIDING AND CUTTING"
  const leftColGroup = new THREE.Group();
  leftColGroup.position.set(-2.35, colY, 0.0);

  const leftColBody = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(colW, colH, colD), whiteSteel));
  leftColGroup.add(leftColBody);

  // Charcoal front panel insert
  const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.68, colH - 0.40, 0.04), sideTextMat);
  leftPanel.position.set(0, 0, colD / 2 + 0.015);
  leftColGroup.add(leftPanel);

  // Lower ventilation grilles
  for (let vg = 0; vg < 4; vg++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.015), darkSteel);
    vent.position.set(0, -colH / 2 + 0.25 + vg * 0.07, colD / 2 + 0.02);
    leftColGroup.add(vent);
  }

  // Yellow safety electrical box with emergency stop button on left upright
  const eBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), yellowArmMat);
  eBox.position.set(0.22, 0.75, colD / 2 + 0.03);
  leftColGroup.add(eBox);

  const eStop = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 12), eStopRedMat);
  eStop.rotation.x = Math.PI / 2;
  eStop.position.set(0.26, 0.75, colD / 2 + 0.07);
  leftColGroup.add(eStop);

  mGroup.add(leftColGroup);

  // (b) RIGHT COLUMN FRAME (x = +2.35)
  const rightColGroup = new THREE.Group();
  rightColGroup.position.set(2.35, colY, 0.0);

  const rightColBody = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(colW, colH, colD), whiteSteel));
  rightColGroup.add(rightColBody);

  // Operator maintenance side door relief
  const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, colH - 0.50, colD - 0.40), whiteSteel);
  doorPanel.position.set(colW / 2 + 0.01, 0, 0);
  rightColGroup.add(doorPanel);

  mGroup.add(rightColGroup);

  // =========================================================================
  // 3. OVERHEAD CANOPY BRIDGE WITH RED DIGITAL LED DISPLAY & SM MACHINERY BADGE
  // =========================================================================
  const canopyW = 5.45;
  const canopyH = 0.75;
  const canopyD = 1.65;
  const canopyY = colH + canopyH / 2 - 0.15;

  const canopyMesh = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(canopyW, canopyH, canopyD), whiteSteel));
  canopyMesh.position.set(0, canopyY, 0.15);
  mGroup.add(canopyMesh);

  // Chamfered top overhang fascia
  const topFascia = new THREE.Mesh(new THREE.BoxGeometry(canopyW + 0.10, 0.12, canopyD + 0.15), whiteSteel);
  topFascia.position.set(0, canopyY + canopyH / 2 + 0.05, 0.15);
  mGroup.add(topFascia);

  // Recessed dark LED Marquee Screen on the front face (Centered)
  const marqueePanel = new THREE.Mesh(new THREE.BoxGeometry(2.80, 0.42, 0.02), marqueeMat);
  marqueePanel.position.set(-0.15, canopyY, 0.15 + canopyD / 2 + 0.012);
  mGroup.add(marqueePanel);

  // Green "SM MACHINERY" brand badge on the top-right
  const brandBadge = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.28, 0.02), brandBadgeMat);
  brandBadge.position.set(2.05, canopyY + 0.05, 0.15 + canopyD / 2 + 0.012);
  mGroup.add(brandBadge);

  // Fluorescent inspection lamp tubes under the canopy
  [-0.30, 0.30].forEach(function (zLamp) {
    const lampFixture = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.06, 0.10), darkSteel);
    lampFixture.position.set(0, canopyY - canopyH / 2 - 0.03, zLamp);
    mGroup.add(lampFixture);
    const lampTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 4.0, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    lampTube.rotation.z = Math.PI / 2;
    lampTube.position.set(0, canopyY - canopyH / 2 - 0.06, zLamp);
    mGroup.add(lampTube);
  });

  // =========================================================================
  // 4. INFEED / UNWIND SIDE (อีกฝั่ง - Back Side): THE LARGE MASTER ROLL (ม้วนใหญ่)
  // =========================================================================
  // Large Unwind Master Roll (ม้วนใหญ่ที่อยู่อีกฝั่ง ตามที่ผู้ใช้ระบุ)
  const masterRadius = 0.65; // Wide master diameter 1.30m
  const masterWidth = 2.50;  // Full wide web
  const masterZ = -1.90;     // Rear infeed side
  const masterY = 1.45;

  const masterRollAssembly = createActiveFilmRollAssembly(
    masterRadius,
    masterWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(masterRollAssembly.bodyMesh);
  masterRollAssembly.group.position.set(0.0, masterY, masterZ);
  mGroup.add(masterRollAssembly.group);
  rollersOut.push(masterRollAssembly.group);

  // Heavy steel unwind support stanchions on both sides of master roll
  [-masterWidth / 2 - 0.20, masterWidth / 2 + 0.20].forEach(function (armX) {
    const unPost = new THREE.Mesh(new THREE.BoxGeometry(0.32, masterY + 0.10, 0.32), charcoalMat);
    unPost.position.set(armX, (masterY + 0.10) / 2, masterZ);
    mGroup.add(unPost);

    // Hydraulic lift arm pivot
    const unArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.22), darkSteel);
    unArm.position.set(armX, masterY, masterZ + 0.12);
    mGroup.add(unArm);

    // Large safety chuck & magnetic brake disc
    const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 18), darkChromeMat);
    brakeDisc.rotation.z = Math.PI / 2;
    brakeDisc.position.set(armX > 0 ? armX - 0.12 : armX + 0.12, masterY, masterZ);
    mGroup.add(brakeDisc);
  });

  // Lower web lead roller under master roll
  const leadRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 14), chromeMat);
  leadRoller.rotation.z = Math.PI / 2;
  leadRoller.position.set(0, 0.42, -1.20);
  mGroup.add(leadRoller);

  // Running film web span from rear master roll into the slitter
  const unweb = createFilmWebSpan(0, masterY - masterRadius, 0, 1.45, -0.65, masterWidth - 0.10, 0xbe185d, 0.88);
  mGroup.add(unweb);

  // =========================================================================
  // 5. INTERNAL SLITTING & SPREADER SECTION (ลูกกลิ้งมีดตัดและลูกกลิ้งลำเลียง)
  // =========================================================================
  // Central rotary knife shaft with shear blades
  const knifeShaft = new THREE.Group();
  knifeShaft.rotation.z = Math.PI / 2;
  knifeShaft.position.set(0, 1.55, 0.0);

  const kCore = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 16), chromeMat);
  knifeShaft.add(kCore);

  // Slitting rotary circular blades dividing into 2 short rolls
  [-0.60, 0.0, 0.60].forEach(function (ky) {
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 20), darkSteel);
    blade.position.y = ky;
    knifeShaft.add(blade);
  });
  mGroup.add(knifeShaft);
  rollersOut.push(knifeShaft);

  // Matte rubberized guide and spreader rollers (matching the black rollers in the photo)
  [
    { y: 2.50, z: -0.20, rad: 0.11, len: 3.8, mat: rubberRollerMat },
    { y: 1.85, z: -0.15, rad: 0.09, len: 3.8, mat: chromeMat },
    { y: 1.25, z: -0.10, rad: 0.11, len: 3.8, mat: rubberRollerMat },
    { y: 0.70, z:  0.15, rad: 0.09, len: 3.8, mat: chromeMat }
  ].forEach(function (rl) {
    const rMesh = new THREE.Mesh(new THREE.CylinderGeometry(rl.rad, rl.rad, rl.len, 16), rl.mat);
    rMesh.rotation.z = Math.PI / 2;
    rMesh.position.set(0, rl.y, rl.z);
    mGroup.add(rMesh);
    rollersOut.push(rMesh);
  });

  // =========================================================================
  // 6. OUTPUT / REWIND FRONT FACE (ฝั่ง Output ตามภาพ): DUAL SHAFTS + 2 SHORT ROLLS
  // =========================================================================
  // Left Yellow Mechanical Swing Arm assembly (seen clearly in reference photo)
  const yellowArmGroup = new THREE.Group();
  yellowArmGroup.position.set(-1.95, 1.70, 0.35);

  const yArmBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.85, 0.42), yellowArmMat);
  yellowArmGroup.add(yArmBody);

  // Pivot bearings and hydraulic actuation cylinders
  [-0.75, 0.75].forEach(function (py) {
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16), darkSteel);
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(0, py, 0.15);
    yellowArmGroup.add(pivot);

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 12), chromeMat);
    cyl.position.set(0.08, py - 0.25, -0.12);
    yellowArmGroup.add(cyl);
  });

  // Black flexible cable drag chain (Cat Track) curving along the left frame
  const chainCount = 14;
  for (let cc = 0; cc < chainCount; cc++) {
    const tNorm = cc / (chainCount - 1);
    const link = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.12), dragChainMat);
    const chainY = -0.75 + tNorm * 1.50;
    const chainZ = -0.15 - Math.sin(tNorm * Math.PI) * 0.22;
    link.position.set(-0.12, chainY, chainZ);
    yellowArmGroup.add(link);
  }
  mGroup.add(yellowArmGroup);

  // Right side matching chuck brackets
  [-0.75, 0.75].forEach(function (py) {
    const rBracket = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.35), darkSteel);
    rBracket.position.set(1.95, 1.70 + py, 0.50);
    mGroup.add(rBracket);
  });

  // Helper: Segmented Differential Friction Rewind Shaft with chrome rings
  function createFrictionRewindShaft(shaftLen, ringCount) {
    const shaftGrp = new THREE.Group();
    shaftGrp.rotation.z = Math.PI / 2;

    // Steel central core
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, shaftLen, 24), darkSteel);
    shaftGrp.add(core);

    // Alternating friction rings and spacing grooves (seen in photo!)
    const step = shaftLen / (ringCount + 1);
    for (let i = 0; i < ringCount; i++) {
      const ringY = -shaftLen / 2 + (i + 1) * step;
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, step * 0.70, 24), chromeMat);
      ring.position.y = ringY;
      shaftGrp.add(ring);
    }
    return shaftGrp;
  }

  // --- (A) UPPER REWIND SHAFT (เพลาบน: y = 2.25, z = 0.55) ---
  const upperShaftY = 2.25;
  const upperShaftZ = 0.55;
  const upperShaft = createFrictionRewindShaft(3.8, 26);
  upperShaft.position.set(0, upperShaftY, upperShaftZ);
  mGroup.add(upperShaft);
  rollersOut.push(upperShaft);

  // --- (B) LOWER REWIND SHAFT (เพลาล่าง: y = 1.15, z = 0.65) ---
  const lowerShaftY = 1.15;
  const lowerShaftZ = 0.65;
  const lowerShaft = createFrictionRewindShaft(3.8, 26);
  lowerShaft.position.set(0, lowerShaftY, lowerShaftZ);
  mGroup.add(lowerShaft);
  rollersOut.push(lowerShaft);

  // --- (C) THE 2 SHORT SLIT ROLLS (ม้วนสั้น 2 ม้วน ตามที่ผู้ใช้ระบุ) ---
  const shortRollRadius = 0.38; // Radius matching photo
  const shortRollWidth = 0.78;  // Short narrow slit roll width

  // ROLL 1 (Upper Short Roll): Positioned on Upper Shaft, offset to the Right (x = +0.48)
  const upperShortRoll = createActiveFilmRollAssembly(
    shortRollRadius,
    shortRollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(upperShortRoll.bodyMesh);
  upperShortRoll.group.position.set(0.48, upperShaftY, upperShaftZ);
  mGroup.add(upperShortRoll.group);
  rollersOut.push(upperShortRoll.group);

  // ROLL 2 (Lower Short Roll): Positioned on Lower Shaft, staggered to the Left (x = -0.48)
  const lowerShortRoll = createActiveFilmRollAssembly(
    shortRollRadius,
    shortRollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(lowerShortRoll.bodyMesh);
  lowerShortRoll.group.position.set(-0.48, lowerShaftY, lowerShaftZ);
  mGroup.add(lowerShortRoll.group);
  rollersOut.push(lowerShortRoll.group);

  // Slit Web Strip 1 threading up to Upper Short Roll
  const webStrip1 = createFilmWebSpan(0.48, 1.55, 0.48, upperShaftY - shortRollRadius + 0.05, 0.28, shortRollWidth - 0.04, 0xbe185d, 0.90);
  mGroup.add(webStrip1);

  // Slit Web Strip 2 threading down to Lower Short Roll
  const webStrip2 = createFilmWebSpan(-0.48, 1.55, -0.48, lowerShaftY + shortRollRadius - 0.05, 0.32, shortRollWidth - 0.04, 0xbe185d, 0.90);
  mGroup.add(webStrip2);

  // =========================================================================
  // 7. OPERATOR HMI TOUCHSCREEN KIOSK & CONSOLE (Right side)
  // =========================================================================
  const hmiArm = new THREE.Group();
  hmiArm.position.set(2.45, 1.65, 0.85);

  // Articulating swivel bracket
  const bracketPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.45, 12), darkSteel);
  bracketPipe.rotation.z = Math.PI / 2;
  hmiArm.add(bracketPipe);

  // Main display box
  const hmiBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.08), darkSteel);
  hmiBox.position.set(0.28, 0, 0);
  hmiBox.rotation.y = -0.25;
  hmiArm.add(hmiBox);

  // Touchscreen display
  const hmiScreen = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.30, 0.01), screenBlueMat);
  hmiScreen.position.set(0.28, 0.02, 0.045);
  hmiScreen.rotation.y = -0.25;
  hmiArm.add(hmiScreen);

  // Red mushroom E-Stop button on kiosk
  const kStop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 10), eStopRedMat);
  kStop.position.set(0.28, -0.14, 0.05);
  kStop.rotation.x = Math.PI / 2;
  hmiArm.add(kStop);

  mGroup.add(hmiArm);

  // =========================================================================
  // 8. FOREGROUND SQUARE WOODEN PALLET WITH 3 TIERS OF SHORTER SLIT ROLLS
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

  // Shorter slit rolls
  const pRollRadius = 0.35;
  const pRollHeight = 0.45;
  const pRollGeo = new THREE.CylinderGeometry(pRollRadius, pRollRadius, pRollHeight, 22);
  const pCoreGeo = new THREE.CylinderGeometry(0.12, 0.12, pRollHeight + 0.005, 14);
  const pCoreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

  const upRollSideMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12
  });
  const upRollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
  const pRollMaterials = [upRollSideMat, upRollFaceMat, upRollFaceMat];

  const gridOffsets = [-0.52, 0.52];
  let currentY = palletTotalH;

  for (let tier = 0; tier < 3; tier++) {
    const sheetY = currentY + sheetThick / 2;
    createCardboardInterlayer(sheetY);
    currentY += sheetThick;

    const rollCenterY = currentY + pRollHeight / 2;
    gridOffsets.forEach(function (ox, rIdx) {
      gridOffsets.forEach(function (oz, cIdx) {
        const roll = new THREE.Mesh(pRollGeo, pRollMaterials);
        roll.position.set(palX + ox, rollCenterY, palZ + oz);
        roll.rotation.y = tier * 1.8 + rIdx * 2.2 + cIdx * 1.4;
        roll.castShadow = true;
        roll.receiveShadow = true;
        mGroup.add(roll);

        const core = new THREE.Mesh(pCoreGeo, pCoreMat);
        core.position.set(palX + ox, rollCenterY, palZ + oz);
        mGroup.add(core);
      });
    });

    currentY += pRollHeight;
  }

  return mGroup;
}
