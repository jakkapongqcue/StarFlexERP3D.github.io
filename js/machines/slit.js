/* =========================================================================
   StarFlexERP 3D - Machine: High-Speed Duplex Slitter Rewinder (ST_SLIT)
   - Authentically modeled after factory photograph (media_1792684717063_6b26d993.jpg)
   - Features:
     1. Heavy Industrial Portal Frame with Left/Right Columns & Overhead Canopy
     2. Red Digital LED Marquee Display: "Running Speed 004 m/min"
     3. Left Column Vertical Blue Typography: "INTELLIGENT DIVIDING AND CUTTING"
     4. Dual Differential Friction Rewind Shafts (Upper & Lower Duplex Rewind)
        with metallic segmented friction collar rings & active winding slit rolls
     5. Golden-Yellow Articulated Cantilever Swing Arm System & Black Drag Chain
     6. Rubber Lay-On / Contact Rollers pressing against winding film
     7. Emergency Stop Sub-Panel & Articulated Touch HMI Console Screen
     8. Foreground Square Pallet with 3 Tiers of Slit Rolls & Cardboard Interlayers
   ========================================================================= */

let _cachedSlitterLedTexture = null;
let _cachedSlitterBrandTexture = null;

function getSlitterSpeedLedTexture() {
  if (_cachedSlitterLedTexture) return _cachedSlitterLedTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark matte bezel enclosure
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle inner display glass border
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Background subtle grid of unlit LED dots
  ctx.fillStyle = '#1c1917';
  for (let x = 16; x < canvas.width - 16; x += 8) {
    for (let y = 16; y < canvas.height - 16; y += 8) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Glowing Red LED Text: "Running Speed 004 m/min"
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 36px "Consolas", "Courier New", monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('Running Speed 004 m/min', canvas.width / 2, canvas.height / 2);

  // Core bright neon overlay
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fecaca';
  ctx.fillText('Running Speed 004 m/min', canvas.width / 2, canvas.height / 2);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  _cachedSlitterLedTexture = texture;
  return texture;
}

function getSlitterSideBrandingTexture() {
  if (_cachedSlitterBrandTexture) return _cachedSlitterBrandTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark charcoal background panel
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle metallic texture lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  for (let y = 30; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(canvas.width - 10, y);
    ctx.stroke();
  }

  // Vertical Blue Cyan Branding: "INTELLIGENT DIVIDING AND CUTTING"
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2); // Rotate to read vertically along the column

  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 36px "Montserrat", "Segoe UI", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('INTELLIGENT DIVIDING AND CUTTING', 0, 0);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  _cachedSlitterBrandTexture = texture;
  return texture;
}

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  const mGroup = new THREE.Group();

  // Core Industrial Materials matching Reference Photo
  const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }); // Light grey-white machine frame
  const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // Heavy structural charcoal
  const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 }); // Dark slate accent
  const slateMat = new THREE.MeshLambertMaterial({ color: 0x64748b }); // Mid grey trim
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.85, roughness: 0.20 }); // Polished chrome friction rings
  const chromeDarkMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.70, roughness: 0.35 }); // Alternate friction ring collars
  const rubberMat = new THREE.MeshLambertMaterial({ color: 0x0f172a, roughness: 0.90 }); // Black rubber lay-on rollers
  const yellowArmMat = new THREE.MeshLambertMaterial({ color: 0xeab308 }); // Golden-yellow articulated swing arm
  const yellowAccMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 }); // Bright yellow adjustment handwheel
  const redKnobMat = new THREE.MeshLambertMaterial({ color: 0xef4444 }); // Red E-Stop mushroom button

  function tagSelectable(mesh) {
    mesh.userData.selectKey = st.id;
    if (window.sceneObjects && sceneObjects.selectableMeshes) {
      sceneObjects.selectableMeshes.push(mesh);
    }
    return mesh;
  }

  // =========================================================================
  // 1. HEAVY PORTAL FRAMEWORK (Gantry Structure matching Reference Photo)
  // =========================================================================
  const portalW = 4.4; // Width across X
  const portalH = 3.6; // Height from ground
  const portalD = 2.4; // Depth across Z
  const frontZ = 0.55;  // Output rewind opening sits towards +Z (facing user/aisle)

  // (a) Heavy Structural Floor Base Rails & Leveling Pads
  const baseRailL = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.16, portalD + 0.6), whiteSteel);
  baseRailL.position.set(-portalW / 2 + 0.35, 0.08, frontZ - portalD / 2 + 0.3);
  mGroup.add(baseRailL);

  const baseRailR = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.16, portalD + 0.6), whiteSteel);
  baseRailR.position.set(portalW / 2 - 0.35, 0.08, frontZ - portalD / 2 + 0.3);
  mGroup.add(baseRailR);

  // Chrome sliding rods across front base (matching Photo!)
  [-0.04, 0.08].forEach(function (zOff) {
    const slideBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, portalW - 0.8, 14), chromeMat);
    slideBar.rotation.z = Math.PI / 2;
    slideBar.position.set(0, 0.12, frontZ + 0.15 + zOff);
    mGroup.add(slideBar);
  });

  // (b) Left Portal Column (White heavy body with dark outer side branding panel)
  const colW = 0.72;
  const colD = 1.95;
  const colH = portalH - 0.55;
  const leftColX = -portalW / 2 + colW / 2;

  const leftCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(colW, colH, colD), whiteSteel));
  leftCol.position.set(leftColX, colH / 2 + 0.16, frontZ - colD / 2);
  mGroup.add(leftCol);

  // Dark slate-grey outer side panel with "INTELLIGENT DIVIDING AND CUTTING" branding
  const brandTex = getSlitterSideBrandingTexture();
  const brandMat = brandTex
    ? new THREE.MeshLambertMaterial({ map: brandTex })
    : darkSteel;
  const brandPanel = new THREE.Mesh(new THREE.PlaneGeometry(colD - 0.1, colH - 0.3), brandMat);
  brandPanel.position.set(leftColX - colW / 2 - 0.015, colH / 2 + 0.16, frontZ - colD / 2);
  brandPanel.rotation.y = -Math.PI / 2; // Facing -X
  mGroup.add(brandPanel);

  // Emergency Stop / Local Control Box on front of Left Column (matching photo)
  const eBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.08), yellowArmMat);
  eBox.position.set(leftColX + 0.08, 2.75, frontZ + 0.02);
  mGroup.add(eBox);

  const eBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 12), redKnobMat);
  eBtn.rotation.x = Math.PI / 2;
  eBtn.position.set(leftColX + 0.16, 2.75, frontZ + 0.07);
  mGroup.add(eBtn);

  // (c) Right Portal Column (White heavy body + HMI console screen)
  const rightColX = portalW / 2 - colW / 2;
  const rightCol = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(colW, colH, colD), whiteSteel));
  rightCol.position.set(rightColX, colH / 2 + 0.16, frontZ - colD / 2);
  mGroup.add(rightCol);

  // Right Operator Touch HMI Screen Console (matching photo)
  const hmiArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), darkSteel);
  hmiArm.position.set(rightColX + 0.45, 2.2, frontZ - 0.2);
  mGroup.add(hmiArm);

  const hmiScreenBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.08), darkSteel);
  hmiScreenBox.position.set(rightColX + 0.45, 2.45, frontZ + 0.1);
  hmiScreenBox.rotation.y = -0.22;
  mGroup.add(hmiScreenBox);

  const hmiScreenFace = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.34), new THREE.MeshBasicMaterial({ color: 0x059669 }));
  hmiScreenFace.position.set(rightColX + 0.45, 2.45, frontZ + 0.145);
  hmiScreenFace.rotation.y = -0.22;
  mGroup.add(hmiScreenFace);

  // (d) Overhead Canopy Bridge (spanning across top of left and right columns)
  const canopyW = portalW + 0.25;
  const canopyH = 0.58;
  const canopyD = colD + 0.35;
  const canopyY = portalH - canopyH / 2;

  const topCanopy = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(canopyW, canopyH, canopyD), whiteSteel));
  topCanopy.position.set(0, canopyY, frontZ - colD / 2);
  mGroup.add(topCanopy);

  // Stepped front fascia
  const topFascia = new THREE.Mesh(new THREE.BoxGeometry(canopyW - 0.3, canopyH - 0.08, 0.14), whiteSteel);
  topFascia.position.set(0, canopyY, frontZ + 0.12);
  mGroup.add(topFascia);

  // (e) RED DIGITAL LED SPEED DISPLAY: "Running Speed 004 m/min" (Image Signature!)
  const ledTex = getSlitterSpeedLedTexture();
  const ledMat = ledTex
    ? new THREE.MeshBasicMaterial({ map: ledTex })
    : new THREE.MeshBasicMaterial({ color: 0xef4444 });

  const ledBoxHousing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.34, 0.06), darkSteel);
  ledBoxHousing.position.set(0.15, canopyY, frontZ + 0.20);
  mGroup.add(ledBoxHousing);

  const ledDisplayPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.30), ledMat);
  ledDisplayPlane.position.set(0.15, canopyY, frontZ + 0.235);
  mGroup.add(ledDisplayPlane);

  // Fluorescent LED lighting tube recessed under canopy
  const lightFixt = new THREE.Mesh(new THREE.BoxGeometry(portalW - 1.2, 0.06, 0.12), chromeMat);
  lightFixt.position.set(0, portalH - canopyH - 0.03, frontZ - 0.45);
  mGroup.add(lightFixt);

  const lightTube = new THREE.Mesh(new THREE.BoxGeometry(portalW - 1.4, 0.02, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  lightTube.position.set(0, portalH - canopyH - 0.065, frontZ - 0.45);
  mGroup.add(lightTube);

  // =========================================================================
  // 2. DUPLEX REWIND OUTPUT SECTION (Upper & Lower Differential Shafts)
  // =========================================================================
  const shaftSpan = portalW - colW - 0.3; // ~3.4m span across output opening
  const shaftCenterX = (leftColX + colW / 2 + rightColX - colW / 2) / 2; // ~0.0
  const shaftZ = frontZ - 0.35;

  // Function to build segmented differential friction shaft with slip rings
  function createDifferentialFrictionShaft(yLevel) {
    const shaftGrp = new THREE.Group();
    shaftGrp.position.set(shaftCenterX, yLevel, shaftZ);
    shaftGrp.rotation.z = Math.PI / 2;

    // Core chrome shaft
    const coreCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, shaftSpan, 18), chromeMat);
    shaftGrp.add(coreCyl);

    // Segmented differential friction collar rings along the shaft length (Image Signature!)
    const ringSpacing = 0.10;
    const halfSpan = shaftSpan / 2 - 0.15;
    for (let sy = -halfSpan; sy <= halfSpan; sy += ringSpacing) {
      const ringMat = (Math.abs(Math.sin(sy * 15)) > 0.45) ? chromeMat : chromeDarkMat;
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.132, 0.055, 16), ringMat);
      ring.position.y = sy;
      shaftGrp.add(ring);
    }
    mGroup.add(shaftGrp);
    return shaftGrp;
  }

  // (a) UPPER REWIND SHAFT & WOUND SLIT FILM ROLL (y = 2.45)
  const upperShaft = createDifferentialFrictionShaft(2.45);
  rollersOut.push(upperShaft);

  // Active winding slit Hygiene roll on Upper Shaft (offset to right, x = +0.55, matching photo!)
  const rollWidth = 0.65;
  const upperRollRadius = 0.42;
  const upperSlitRoll = createActiveFilmRollAssembly(
    upperRollRadius,
    rollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(upperSlitRoll.bodyMesh);
  upperSlitRoll.group.position.set(0.55, 2.45, shaftZ);
  mGroup.add(upperSlitRoll.group);
  rollersOut.push(upperSlitRoll.group);

  // Upper Black Rubber Lay-on Roller pressing against winding roll
  const upperLayonGrp = new THREE.Group();
  upperLayonGrp.position.set(shaftCenterX, 2.75, shaftZ - 0.22);
  upperLayonGrp.rotation.z = Math.PI / 2;
  const upperLayon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, shaftSpan - 0.4, 16), rubberMat);
  upperLayonGrp.add(upperLayon);
  mGroup.add(upperLayonGrp);
  rollersOut.push(upperLayonGrp);

  // (b) LOWER REWIND SHAFT & WOUND SLIT FILM ROLL (y = 1.30)
  const lowerShaft = createDifferentialFrictionShaft(1.30);
  rollersOut.push(lowerShaft);

  // Active winding slit Hygiene roll on Lower Shaft (staggered to left, x = -0.55, matching photo!)
  const lowerRollRadius = 0.38;
  const lowerSlitRoll = createActiveFilmRollAssembly(
    lowerRollRadius,
    rollWidth,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(lowerSlitRoll.bodyMesh);
  lowerSlitRoll.group.position.set(-0.55, 1.30, shaftZ);
  mGroup.add(lowerSlitRoll.group);
  rollersOut.push(lowerSlitRoll.group);

  // Lower Black Rubber Lay-on Roller pressing against lower roll
  const lowerLayonGrp = new THREE.Group();
  lowerLayonGrp.position.set(shaftCenterX, 1.58, shaftZ - 0.22);
  lowerLayonGrp.rotation.z = Math.PI / 2;
  const lowerLayon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, shaftSpan - 0.4, 16), rubberMat);
  lowerLayonGrp.add(lowerLayon);
  mGroup.add(lowerLayonGrp);
  rollersOut.push(lowerLayonGrp);

  // =========================================================================
  // 3. GOLDEN-YELLOW ARTICULATED CANTILEVER SWING ARM & DRAG CHAIN
  // (Distinctive yellow lifting mechanism on left side of shafts matching photo!)
  // =========================================================================
  const armX = leftColX + colW / 2 + 0.12;

  // Main vertical yellow arm bracket
  const armVertical = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.85, 0.32), yellowArmMat);
  armVertical.position.set(armX, 1.85, shaftZ);
  mGroup.add(armVertical);

  // Upper cantilever arm reach
  const armUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.52), yellowArmMat);
  armUpper.position.set(armX, 2.45, shaftZ + 0.18);
  mGroup.add(armUpper);

  // Lower cantilever arm reach
  const armLower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.52), yellowArmMat);
  armLower.position.set(armX, 1.30, shaftZ + 0.18);
  mGroup.add(armLower);

  // Golden-yellow adjustment handwheel / lock knob
  const handwheel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.07, 16), yellowAccMat);
  handwheel.rotation.z = Math.PI / 2;
  handwheel.position.set(armX + 0.09, 1.85, shaftZ + 0.12);
  mGroup.add(handwheel);

  // Chrome hydraulic/pneumatic assist cylinder
  const cylBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 12), chromeMat);
  cylBarrel.position.set(armX - 0.08, 1.85, shaftZ - 0.12);
  mGroup.add(cylBarrel);

  // Black Vertical Drag-Chain / Cable Carrier (รางกระดูกงูร้อยสายไฟ matching photo!)
  for (let cy = 0.55; cy <= 2.85; cy += 0.15) {
    const chainLink = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.10, 0.14), darkSteel);
    chainLink.position.set(armX - 0.16, cy, shaftZ);
    mGroup.add(chainLink);
  }

  // =========================================================================
  // 4. INTERMEDIATE WEB PATH & SLITTING SECTION
  // =========================================================================
  // Web guide roller at rear top
  const webGuideRear = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, shaftSpan, 16), chromeMat);
  webGuideRear.rotation.z = Math.PI / 2;
  webGuideRear.position.set(shaftCenterX, 2.10, frontZ - 1.2);
  mGroup.add(webGuideRear);

  // Center grooved slitting blade shaft with circular cutting discs
  const knifeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, shaftSpan, 16), darkSteel);
  knifeShaft.rotation.z = Math.PI / 2;
  knifeShaft.position.set(shaftCenterX, 1.85, frontZ - 0.95);
  mGroup.add(knifeShaft);

  // 6 circular rotary slitting razor knives
  [-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].forEach(function (kx) {
    const knife = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 16), chromeMat);
    knife.rotation.z = Math.PI / 2;
    knife.position.set(kx, 1.85, frontZ - 0.95);
    mGroup.add(knife);
  });

  // Tense printed film web spans feeding into upper and lower rolls
  const webMat = new THREE.MeshLambertMaterial({
    map: getHygieneFilmTexture(),
    side: THREE.DoubleSide
  });

  // Web to Upper Roll
  const upperWeb = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.85), webMat);
  upperWeb.position.set(0.55, 2.15, shaftZ - 0.20);
  upperWeb.rotation.x = Math.PI / 3.8;
  mGroup.add(upperWeb);

  // Web to Lower Roll
  const lowerWeb = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.75), webMat);
  lowerWeb.position.set(-0.55, 1.55, shaftZ - 0.20);
  lowerWeb.rotation.x = -Math.PI / 4.2;
  mGroup.add(lowerWeb);

  // =========================================================================
  // 5. MASTER UNWIND SECTION (Rear / Infeed Side at -Z)
  // =========================================================================
  const unwindZ = frontZ - portalD + 0.2; // -1.65
  const masterRollObj = createActiveFilmRollAssembly(
    1.15,
    2.6,
    0xbe185d,
    0xfacc15,
    0x1e293b,
    getHygieneFilmTexture(),
    0xfbcfe8
  );
  tagSelectable(masterRollObj.bodyMesh);
  masterRollObj.group.position.set(0.0, 1.65, unwindZ);
  mGroup.add(masterRollObj.group);
  rollersOut.push(masterRollObj.group);

  // Unwind dual side support stands
  [-1.6, 1.6].forEach(function (ux) {
    const uStand = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.65, 0.32), darkSteel);
    uStand.position.set(ux, 0.825, unwindZ);
    mGroup.add(uStand);

    const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16), chromeMat);
    brakeDisc.rotation.z = Math.PI / 2;
    brakeDisc.position.set(ux + (ux > 0 ? 0.16 : -0.16), 1.65, unwindZ);
    mGroup.add(brakeDisc);
  });

  // =========================================================================
  // 6. FOREGROUND SQUARE PALLET WITH 3 TIERS OF SHORT ROLLS & CARDBOARD DIVIDERS
  // (Maintained exactly as requested in previous requirement!)
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

  // Shorter slit rolls
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
    const sheetY = currentY + sheetThick / 2;
    createCardboardInterlayer(sheetY);
    currentY += sheetThick;

    // 4 Upright Rolls on this tier (2x2 grid)
    const rollCenterY = currentY + rollHeight / 2;
    gridOffsets.forEach(function (ox, rIdx) {
      gridOffsets.forEach(function (oz, cIdx) {
        const roll = new THREE.Mesh(rollGeo, rollMaterials);
        roll.position.set(palX + ox, rollCenterY, palZ + oz);
        roll.rotation.y = tier * 1.8 + rIdx * 2.2 + cIdx * 1.4;
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

  // 7. Blue Control Kiosk at Front-Left resting on floor
  const slitKiosk = createBlueControlKioskMesh();
  slitKiosk.position.set(-2.9, 0.0, 2.05);
  mGroup.add(slitKiosk);

  return mGroup;
}
