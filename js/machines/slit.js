/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - Based on Official Industrial Reference (media_1792686929451_f85f8541.png)
   - Official Model: STARFLEX VENUS III High-Speed Duplex Slitter Rewinder
   - Rear / Input Side: Large Master Unwind Roll with heavy side frames & circular lightening cutouts
   - Front / Output Side: Dual Stationary Shafts holding 5 Rotating Staggered Slit Reels
     * Upper Rewind Shaft: 3 Short Finished White Film Reels (interleaved)
     * Lower Rewind Shaft: 2 Short Finished White Film Reels (interleaved)
     * Shafts remain stationary while only the film reels rotate around horizontal X axis
     * Pneumatically clamped shaft-end support swing arms on right pillar
     * Upper & Lower full-width lay-on rubber rollers with pneumatic cylinders
     * 5 Individual slitted white film web ribbons feeding into reels
   - Right Pillar: Curved white shroud with vertical bold blue typography "VENUS III",
     rewind level badges [1] & [2], and red optical safety line
   - Left Pillar: Integrated flush HMI touchscreen console with live status graphics,
     pushbuttons, recessed handrail pocket, and multi-tier Andon beacon tower
   - Top Overhead Canopy Bridge: Modern chamfered hood, angled grey cantilever arms,
     hazard decals, and recessed LED task illumination
   - Foreground: Square pallet with 3 tiers of shorter slit rolls & cardboard interlayers
   ========================================================================= */

// =========================================================================
// PROCEDURAL TEXTURE GENERATORS
// =========================================================================

let _cachedVenusPillarTexture = null;
function getVenusPillarTexture() {
  if (_cachedVenusPillarTexture) return _cachedVenusPillarTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Crisp white/light-grey base
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft left-edge shadow/bevel
  const grad = ctx.createLinearGradient(0, 0, 40, 0);
  grad.addColorStop(0, '#cbd5e1');
  grad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 40, canvas.height);

  // Inner margin red safety line (Laser / trip wire indicator)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(480, 100, 10, 1750);

  // Optical sensor emitter dots along red line
  ctx.fillStyle = '#fca5a5';
  for (let sy = 250; sy < 1800; sy += 280) {
    ctx.beginPath();
    ctx.arc(485, sy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Level 1 Badge (Upper Rewind Level)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(420, 520, 56, 56, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1', 448, 548);

  // Level 2 Badge (Lower Rewind Level)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(420, 1180, 56, 56, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Segoe UI", sans-serif';
  ctx.fillText('2', 448, 1208);

  // Vertical Blue Typography: "VENUS III" (Matching exact image branding)
  ctx.save();
  ctx.translate(260, 1020);
  ctx.rotate(Math.PI / 2); // Reads top-to-bottom
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 155px "Segoe UI", "Arial Black", sans-serif';
  ctx.fillStyle = '#1d4ed8'; // Industrial Royal Blue
  ctx.shadowColor = 'rgba(29, 78, 216, 0.25)';
  ctx.shadowBlur = 12;
  ctx.fillText('VENUS  III', 0, 0);
  ctx.restore();

  // Bottom ventilation louvers / service hatch line
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(50, 1860, 380, 6);
  ctx.fillRect(50, 1890, 380, 6);
  ctx.fillRect(50, 1920, 380, 6);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedVenusPillarTexture = tex;
  return tex;
}

let _cachedSlitHmiConsoleTexture = null;
function getSlitHmiConsoleTexture() {
  if (_cachedSlitHmiConsoleTexture) return _cachedSlitHmiConsoleTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark industrial housing bezel
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Screen outer bezel
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(16, 16, canvas.width - 32, 360);

  // Active LCD Screen area
  ctx.fillStyle = '#020617';
  ctx.fillRect(24, 24, canvas.width - 48, 344);

  // Screen Header Bar
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(24, 24, canvas.width - 48, 44);
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('STARFLEX VENUS III - SYSTEM ACTIVE', 38, 54);

  // Status Indicator Dot (Green)
  ctx.beginPath();
  ctx.arc(460, 46, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Speed Readout Box
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(38, 86, 205, 96);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(38, 86, 205, 96);
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('LINE SPEED', 50, 110);
  ctx.font = 'bold 44px "Consolas", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('400', 50, 160);
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('m/min', 145, 160);

  // Tension Readout Box
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(265, 86, 205, 96);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(265, 86, 205, 96);
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('TOTAL TENSION', 277, 110);
  ctx.font = 'bold 44px "Consolas", monospace';
  ctx.fillStyle = '#10b981';
  ctx.fillText('185', 277, 160);
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('N', 365, 160);

  // Real-time Tension Trend Wave Graph
  ctx.fillStyle = '#090d16';
  ctx.fillRect(38, 200, 432, 80);
  ctx.strokeStyle = '#1e293b';
  for (let gx = 38; gx <= 470; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, 200); ctx.lineTo(gx, 280); ctx.stroke();
  }
  for (let gy = 200; gy <= 280; gy += 20) {
    ctx.beginPath(); ctx.moveTo(38, gy); ctx.lineTo(470, gy); ctx.stroke();
  }
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 38; x <= 470; x += 6) {
    const y = 240 + Math.sin((x - 38) * 0.08) * 16 + Math.cos((x - 38) * 0.03) * 6;
    if (x === 38) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Soft Touchscreen Function Buttons
  const buttons = ['AUTO RUN', 'TENSION', 'KNIVES', 'RECIPE', 'ALARMS'];
  buttons.forEach(function (lbl, idx) {
    const bx = 38 + idx * 88;
    ctx.fillStyle = idx === 0 ? '#15803d' : '#1e293b';
    ctx.fillRect(bx, 298, 80, 52);
    ctx.strokeStyle = idx === 0 ? '#4ade80' : '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, 298, 80, 52);
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(lbl, bx + 40, 328);
  });

  // Physical Lower Control Strip (below screen)
  ctx.fillStyle = '#334155';
  ctx.fillRect(16, 390, canvas.width - 32, 106);

  // Physical Start Button (Green)
  ctx.beginPath();
  ctx.arc(70, 442, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#4ade80';
  ctx.stroke();

  // Physical Stop Button (Red)
  ctx.beginPath();
  ctx.arc(140, 442, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.strokeStyle = '#f87171';
  ctx.stroke();

  // Jog Button (Black)
  ctx.beginPath();
  ctx.arc(210, 442, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.stroke();

  // Reset Button (Blue)
  ctx.beginPath();
  ctx.arc(280, 442, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();
  ctx.strokeStyle = '#60a5fa';
  ctx.stroke();

  // Large Emergency Stop Mushroom Button on Yellow disc
  ctx.beginPath();
  ctx.arc(410, 442, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15'; // Yellow collar disc
  ctx.fill();
  ctx.beginPath();
  ctx.arc(410, 442, 25, 0, Math.PI * 2);
  ctx.fillStyle = '#b91c1c'; // Red mushroom palm cap
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  _cachedSlitHmiConsoleTexture = tex;
  return tex;
}

let _cachedSlitWarningTexture = null;
function getSlitWarningStickerTexture() {
  if (_cachedSlitWarningTexture) return _cachedSlitWarningTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Transparent base
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Yellow warning triangle
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(128, 24);
  ctx.lineTo(240, 224);
  ctx.lineTo(16, 224);
  ctx.closePath();
  ctx.fill();

  // Black border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 14;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Black exclamation mark / pinch symbol
  ctx.fillStyle = '#000000';
  ctx.fillRect(119, 82, 18, 70);
  ctx.beginPath();
  ctx.arc(128, 185, 11, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  _cachedSlitWarningTexture = tex;
  return tex;
}

let _cachedRollFaceTexture = null;
function getRollFaceConcentricTexture() {
  if (_cachedRollFaceTexture) return _cachedRollFaceTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Outer roll background
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.fill();

  // Dense concentric rings representing wound film layers
  for (let r = 248; r > 80; r -= 4) {
    ctx.strokeStyle = (r % 12 === 0) ? '#cbd5e1' : '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cardboard core outer ring
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fill();

  // Core inner cardboard wall
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(cx, cy, 72, 0, Math.PI * 2);
  ctx.fill();

  // Inner hollow / shaft hole
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  _cachedRollFaceTexture = tex;
  return tex;
}

// =========================================================================
// MAIN BUILDER FUNCTION
// =========================================================================

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Materials Palette
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const lightGreySteel = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
  const slateMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.18 });
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x1f2937, roughness: 0.95 });
  const filmMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.88 });

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // Pure clean white film roll material (Matching the official VENUS III image)
  const rollOuterMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.22,
    metalness: 0.08
  });
  const rollFaceMat = new THREE.MeshBasicMaterial({
    map: getRollFaceConcentricTexture()
  });
  const rollMaterials = [rollOuterMat, rollFaceMat, rollFaceMat];

  const warningDecalMat = new THREE.MeshBasicMaterial({
    map: getSlitWarningStickerTexture(),
    transparent: true
  });

  // =========================================================================
  // 1. MACHINE BASE & GROUND SUPPORTS
  // =========================================================================
  const baseSlab = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.20, 3.4), charcoalMat));
  baseSlab.position.set(0.0, 0.10, -0.20);
  mGroup.add(baseSlab);

  // Chrome floor guide rails along front rewind area
  [0.95, 1.15].forEach(function (rz) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.4, 16), chromeMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0.0, 0.12, rz);
    mGroup.add(rail);
  });

  // Machine leveling feet
  [-2.4, 2.4].forEach(function (fx) {
    [-1.6, 1.2].forEach(function (fz) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 12), darkSteel);
      foot.position.set(fx, 0.04, fz);
      mGroup.add(foot);
    });
  });

  // =========================================================================
  // 2. LEFT COLUMN: OPERATOR CONTROL CABINET & FLUSH HMI
  // =========================================================================
  const leftColGroup = new THREE.Group();
  leftColGroup.position.set(-2.25, 0.0, 0.0);

  // Main white cabinet body
  const leftCabinet = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.30, 1.70), whiteSteel));
  leftCabinet.position.set(0.0, 1.75, 0.0);
  leftColGroup.add(leftCabinet);

  // Dark slate inner column fascia
  const leftInnerFascia = new THREE.Mesh(new THREE.BoxGeometry(0.10, 3.10, 1.50), slateMat);
  leftInnerFascia.position.set(0.36, 1.75, 0.0);
  leftColGroup.add(leftInnerFascia);

  // Flush integrated HMI Touchscreen Console (Eye-level)
  const hmiMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.58),
    new THREE.MeshBasicMaterial({ map: getSlitHmiConsoleTexture() })
  );
  hmiMesh.position.set(0.0, 2.15, 0.86);
  leftColGroup.add(hmiMesh);

  // Recessed dark horizontal grab handle pocket (Waist-level)
  const handlePocket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.04), darkSteel);
  handlePocket.position.set(0.0, 1.40, 0.86);
  leftColGroup.add(handlePocket);

  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.44, 14), lightGreySteel);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0.0, 1.40, 0.88);
  leftColGroup.add(handleBar);

  // Warning triangle decal on left face
  const leftWarning = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.18), warningDecalMat);
  leftWarning.position.set(0.0, 1.75, 0.86);
  leftColGroup.add(leftWarning);

  // Multi-tier Andon Signal Tower (Red, Amber, Green, Blue) on top of left cabinet
  const andonStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12), lightGreySteel);
  andonStem.position.set(0.0, 3.58, 0.45);
  leftColGroup.add(andonStem);

  const andonColors = [0x22c55e, 0xfacc15, 0xef4444, 0x3b82f6]; // Green, Amber, Red, Blue
  andonColors.forEach(function (hex, idx) {
    const segment = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.08, 14),
      new THREE.MeshBasicMaterial({ color: hex })
    );
    segment.position.set(0.0, 3.80 + idx * 0.09, 0.45);
    leftColGroup.add(segment);
  });

  mGroup.add(leftColGroup);

  // =========================================================================
  // 3. RIGHT COLUMN: VENUS III SIGNATURE PILLAR
  // =========================================================================
  const rightColGroup = new THREE.Group();
  rightColGroup.position.set(2.25, 0.0, 0.0);

  // Main white contoured pillar body
  const rightCabinet = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.30, 1.70), whiteSteel));
  rightCabinet.position.set(0.0, 1.75, 0.0);
  rightColGroup.add(rightCabinet);

  // Dark slate inner column fascia
  const rightInnerFascia = new THREE.Mesh(new THREE.BoxGeometry(0.10, 3.10, 1.50), slateMat);
  rightInnerFascia.position.set(-0.36, 1.75, 0.0);
  rightColGroup.add(rightInnerFascia);

  // Official VENUS III Front Facade Panel with vertical blue typography & badges
  const venusFacadeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 3.10),
    new THREE.MeshBasicMaterial({ map: getVenusPillarTexture() })
  );
  venusFacadeMesh.position.set(0.0, 1.75, 0.86);
  rightColGroup.add(venusFacadeMesh);

  // Distinctive Circular Swivel Cup / Base Mount Foot at bottom front corner
  const baseCup = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.12, 18), darkSteel);
  baseCup.position.set(-0.15, 0.08, 0.98);
  rightColGroup.add(baseCup);

  const baseCupStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.24, 14), chromeMat);
  baseCupStem.position.set(-0.15, 0.22, 0.98);
  rightColGroup.add(baseCupStem);

  mGroup.add(rightColGroup);

  // =========================================================================
  // 4. TOP OVERHEAD BRIDGE CANOPY
  // =========================================================================
  // Modern cantilevered canopy bridge with angled chamfered front lip
  const canopyGroup = new THREE.Group();
  canopyGroup.position.set(0.0, 3.42, 0.15);

  const canopyBody = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.45, 1.45), whiteSteel));
  canopyGroup.add(canopyBody);

  // Angled chamfered front fascia
  const canopyLip = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.35, 0.25), lightGreySteel);
  canopyLip.position.set(0.0, -0.06, 0.80);
  canopyLip.rotation.x = 0.22;
  canopyGroup.add(canopyLip);

  // Yellow warning triangle on center front of canopy
  const canopyWarning = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.18), warningDecalMat);
  canopyWarning.position.set(0.0, -0.04, 0.93);
  canopyWarning.rotation.x = 0.22;
  canopyGroup.add(canopyWarning);

  // Angled slate-grey cantilever structural arms on both sides
  [-2.10, 2.10].forEach(function (ax) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.40, 1.60), slateMat);
    arm.position.set(ax, -0.15, -0.20);
    arm.rotation.x = -0.18;
    canopyGroup.add(arm);
  });

  // High-efficiency recessed LED task lighting bar underneath canopy
  const taskLight = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.03, 0.20),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  taskLight.position.set(0.0, -0.24, 0.15);
  canopyGroup.add(taskLight);

  mGroup.add(canopyGroup);

  // =========================================================================
  // 5. REWIND SECTION: STATIONARY FRICTION SHAFTS & 5 ROTATING WHITE ROLLS
  // (Upper Shaft: 3 Rolls, Lower Shaft: 2 Rolls - Interleaved Duplex Stagger)
  // =========================================================================
  const rollRadius = 0.38;
  const rollWidth = 0.45; // Individual reel width
  const shaftLength = 3.85;

  // -------------------------------------------------------------------------
  // (a) UPPER STATIONARY REWIND SHAFT (Fixed between side frames at y = 2.35, z = 0.42)
  // -------------------------------------------------------------------------
  const uShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, shaftLength, 16), chromeMat);
  uShaftCore.rotation.z = Math.PI / 2;
  uShaftCore.position.set(0.0, 2.35, 0.42);
  mGroup.add(uShaftCore);

  // Upper 3 Roll Positions: x = -1.05, -0.15, +0.75
  const upperRollXPositions = [-1.05, -0.15, 0.75];

  // Friction rings along exposed portions of upper shaft
  for (let sx = -1.75; sx <= 1.75; sx += 0.14) {
    const insideRoll = upperRollXPositions.some(function (rx) {
      return Math.abs(sx - rx) <= rollWidth / 2 + 0.04;
    });
    if (!insideRoll) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.05, 14), chromeMat);
      ring.rotation.z = Math.PI / 2;
      ring.position.set(sx, 2.35, 0.42);
      mGroup.add(ring);
    }
  }

  // Create 3 Independent Rotating Upper Rolls (pure horizontal rotation)
  upperRollXPositions.forEach(function (rx) {
    const rGroup = new THREE.Group();
    rGroup.position.set(rx, 2.35, 0.42);
    rGroup.rotation.order = 'ZYX';
    rGroup.rotation.z = Math.PI / 2;

    const rollMesh = tagSelectable(new THREE.Mesh(
      new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 28),
      rollMaterials
    ));
    rGroup.add(rollMesh);

    // End core chuck discs
    [-rollWidth / 2 - 0.015, rollWidth / 2 + 0.015].forEach(function (cy) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 16), chromeMat);
      collar.position.y = cy;
      rGroup.add(collar);
    });

    rollersOut.push(rGroup);
    mGroup.add(rGroup);
  });

  // -------------------------------------------------------------------------
  // (b) LOWER STATIONARY REWIND SHAFT (Fixed at y = 1.25, z = 0.65)
  // -------------------------------------------------------------------------
  const lShaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, shaftLength, 16), chromeMat);
  lShaftCore.rotation.z = Math.PI / 2;
  lShaftCore.position.set(0.0, 1.25, 0.65);
  mGroup.add(lShaftCore);

  // Lower 2 Roll Positions: x = -0.60, +0.30 (Interleaved in gaps of upper rolls)
  const lowerRollXPositions = [-0.60, 0.30];

  // Friction rings along exposed portions of lower shaft
  for (let sx = -1.75; sx <= 1.75; sx += 0.14) {
    const insideRoll = lowerRollXPositions.some(function (rx) {
      return Math.abs(sx - rx) <= rollWidth / 2 + 0.04;
    });
    if (!insideRoll) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.05, 14), chromeMat);
      ring.rotation.z = Math.PI / 2;
      ring.position.set(sx, 1.25, 0.65);
      mGroup.add(ring);
    }
  }

  // Create 2 Independent Rotating Lower Rolls (pure horizontal rotation)
  lowerRollXPositions.forEach(function (rx) {
    const rGroup = new THREE.Group();
    rGroup.position.set(rx, 1.25, 0.65);
    rGroup.rotation.order = 'ZYX';
    rGroup.rotation.z = Math.PI / 2;

    const rollMesh = tagSelectable(new THREE.Mesh(
      new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 28),
      rollMaterials
    ));
    rGroup.add(rollMesh);

    // End core chuck discs
    [-rollWidth / 2 - 0.015, rollWidth / 2 + 0.015].forEach(function (cy) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 16), chromeMat);
      collar.position.y = cy;
      rGroup.add(collar);
    });

    rollersOut.push(rGroup);
    mGroup.add(rGroup);
  });

  // -------------------------------------------------------------------------
  // (c) PNEUMATIC SHAFT-END SUPPORT SWING ARMS (Right Side Pillars - Signature Detail)
  // -------------------------------------------------------------------------
  // Helper to build articulated swing arm holding outer tip of rewind shaft
  function createShaftEndSupportArm(shaftY, shaftZ) {
    const armGroup = new THREE.Group();
    armGroup.position.set(1.72, shaftY, shaftZ);

    // Heavy cast clamping arm body
    const armBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.18), darkSteel);
    armBody.position.set(0.0, -0.08, -0.02);
    armGroup.add(armBody);

    // Clamping sleeve around shaft tip
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16), chromeMat);
    sleeve.rotation.z = Math.PI / 2;
    armGroup.add(sleeve);

    // Pneumatic actuator cylinder
    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.32, 14), darkSteel);
    cylBody.position.set(0.08, -0.28, -0.12);
    cylBody.rotation.x = -0.35;
    armGroup.add(cylBody);

    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.22, 14), chromeMat);
    pistonRod.position.set(0.08, -0.16, -0.08);
    pistonRod.rotation.x = -0.35;
    armGroup.add(pistonRod);

    // Warning decal on swing arm face
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.10), warningDecalMat);
    decal.position.set(-0.075, -0.08, 0.0);
    decal.rotation.y = -Math.PI / 2;
    armGroup.add(decal);

    mGroup.add(armGroup);
  }

  createShaftEndSupportArm(2.35, 0.42); // Upper arm
  createShaftEndSupportArm(1.25, 0.65); // Lower arm

  // -------------------------------------------------------------------------
  // (d) FULL-WIDTH LAY-ON RUBBER ROLLERS & PIVOT ACTUATORS
  // -------------------------------------------------------------------------
  // Upper Lay-On Roller (rides on top of upper rolls)
  const uLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.50, 16), rubberMat);
  uLayonRoller.rotation.z = Math.PI / 2;
  uLayonRoller.position.set(-0.15, 2.76, 0.48);
  mGroup.add(uLayonRoller);

  [-1.42, 1.12].forEach(function (lx) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.12), darkSteel);
    arm.position.set(lx, 2.76, 0.35);
    arm.rotation.x = 0.32;
    mGroup.add(arm);

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.24, 12), darkSteel);
    cyl.position.set(lx, 2.95, 0.22);
    cyl.rotation.x = 0.55;
    mGroup.add(cyl);
  });

  // Lower Lay-On Roller (rides underneath lower rolls)
  const lLayonRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.50, 16), rubberMat);
  lLayonRoller.rotation.z = Math.PI / 2;
  lLayonRoller.position.set(-0.15, 0.84, 0.72);
  mGroup.add(lLayonRoller);

  [-1.42, 1.12].forEach(function (lx) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.12), darkSteel);
    arm.position.set(lx, 0.84, 0.58);
    arm.rotation.x = -0.32;
    mGroup.add(arm);

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.24, 12), darkSteel);
    cyl.position.set(lx, 0.65, 0.48);
    cyl.rotation.x = -0.55;
    mGroup.add(cyl);
  });

  // Tension idler guide rollers between Upper and Lower shafts
  [1.75, 2.05].forEach(function (gy) {
    const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 16), rubberMat);
    idler.rotation.z = Math.PI / 2;
    idler.position.set(0.0, gy, 0.12);
    mGroup.add(idler);
  });

  // =========================================================================
  // 6. CENTRAL ROTARY SHEAR SLITTING KNIFE STATION
  // =========================================================================
  const anvilShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 3.8, 16), darkSteel);
  anvilShaft.rotation.z = Math.PI / 2;
  anvilShaft.position.set(0.0, 1.85, -0.15);
  mGroup.add(anvilShaft);

  // 6 Circular rotary shear slitting blades corresponding to the 5 slit rolls
  const knifeXPositions = [-1.275, -0.825, -0.375, 0.075, 0.525, 0.975];
  knifeXPositions.forEach(function (kx) {
    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.025, 18), chromeMat);
    blade.rotation.z = Math.PI / 2;
    blade.position.set(kx, 1.95, -0.15);
    mGroup.add(blade);

    // Knife pneumatic holder block
    const holder = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.12), slateMat);
    holder.position.set(kx, 2.06, -0.15);
    mGroup.add(holder);
  });

  // =========================================================================
  // 7. INPUT SIDE (REAR): MASTER UNWIND ROLL & HEAVY SIDE FRAMES
  // (With circular lightening cutouts matching industrial reference photo)
  // =========================================================================
  const masterRadius = 0.65;
  const masterWidth = 2.40;

  // Heavy rear side frame plates with circular lightening cutouts
  [-1.48, 1.48].forEach(function (ux) {
    const plate = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.25, 1.45), slateMat));
    plate.position.set(ux, 1.30, -1.25);
    mGroup.add(plate);

    // Circular weight-reduction cutouts (lightening holes)
    [-0.35, 0.35].forEach(function (cz) {
      const cutout = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.25, 16), darkSteel);
      cutout.rotation.z = Math.PI / 2;
      cutout.position.set(ux, 1.25, -1.25 + cz);
      mGroup.add(cutout);
    });

    // Vertical linear guide rails & screw jack for roll lift
    const liftTrack = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 0.10), chromeMat);
    liftTrack.position.set(ux + (ux > 0 ? -0.12 : 0.12), 1.50, -1.35);
    mGroup.add(liftTrack);

    // Pneumatic brake drum & chuck housing
    const brakeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.15, 18), darkSteel);
    brakeDrum.rotation.z = Math.PI / 2;
    brakeDrum.position.set(ux + (ux > 0 ? 0.14 : -0.14), 1.65, -1.55);
    mGroup.add(brakeDrum);
  });

  // Stationary core shaft through master roll
  const masterCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, masterWidth + 0.45, 18), darkSteel);
  masterCore.rotation.z = Math.PI / 2;
  masterCore.position.set(0.0, 1.65, -1.55);
  mGroup.add(masterCore);

  // LARGE MASTER UNWIND ROLL (Pure horizontal rotation around horizontal axis)
  const masterRollGroup = new THREE.Group();
  masterRollGroup.position.set(0.0, 1.65, -1.55);
  masterRollGroup.rotation.order = 'ZYX';
  masterRollGroup.rotation.z = Math.PI / 2;

  const masterRollBody = tagSelectable(new THREE.Mesh(
    new THREE.CylinderGeometry(masterRadius, masterRadius, masterWidth, 28),
    rollMaterials
  ));
  masterRollGroup.add(masterRollBody);

  // Chuck discs on master roll ends
  [-masterWidth / 2 - 0.02, masterWidth / 2 + 0.02].forEach(function (cy) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 18), chromeMat);
    disc.position.y = cy;
    masterRollGroup.add(disc);
  });

  rollersOut.push(masterRollGroup);
  mGroup.add(masterRollGroup);

  // =========================================================================
  // 8. FILM WEB PATH (CONTINUOUS MASTER WEB + 5 SLITTED REEL RIBBONS)
  // =========================================================================
  // (a) Master Web: Traveling from Rear Master Roll over Overhead Guide Rollers
  const webRearTop = new THREE.Mesh(new THREE.BoxGeometry(masterWidth - 0.06, 0.012, 1.35), filmMat);
  webRearTop.position.set(0.0, 2.38, -0.90);
  webRearTop.rotation.x = 0.24;
  mGroup.add(webRearTop);

  // Overhead tension dancing roller
  const dancerRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, masterWidth + 0.10, 16), chromeMat);
  dancerRoller.rotation.z = Math.PI / 2;
  dancerRoller.position.set(0.0, 2.54, -0.25);
  mGroup.add(dancerRoller);

  // (b) Web Down to Slitter Knife Bed
  const webToKnives = new THREE.Mesh(new THREE.BoxGeometry(masterWidth - 0.06, 0.012, 0.72), filmMat);
  webToKnives.position.set(0.0, 2.18, -0.20);
  webToKnives.rotation.x = -0.55;
  mGroup.add(webToKnives);

  // (c) 5 Individual Slitted Film Web Ribbons leading into Upper & Lower Rolls
  // 3 Upper Ribbons (x = -1.05, -0.15, +0.75)
  upperRollXPositions.forEach(function (rx) {
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(rollWidth - 0.02, 0.010, 0.62), filmMat);
    ribbon.position.set(rx, 2.12, 0.16);
    ribbon.rotation.x = 0.62;
    mGroup.add(ribbon);
  });

  // 2 Lower Ribbons (x = -0.60, +0.30)
  lowerRollXPositions.forEach(function (rx) {
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(rollWidth - 0.02, 0.010, 0.82), filmMat);
    ribbon.position.set(rx, 1.55, 0.28);
    ribbon.rotation.x = -0.54;
    mGroup.add(ribbon);
  });

  // =========================================================================
  // 9. FOREGROUND SQUARE PALLET (3 TIERS OF SHORT ROLLS & CARDBOARD SHEETS)
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
