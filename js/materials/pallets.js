/* =========================================================================
   StarFlexERP 3D - Pallet Assemblies & FG Staging (pallets.js)
   Builders for Wooden Pallets, Stretch-wrapped Box Pallets, and Roll Pallets
   ========================================================================= */


function createPalletBaseMesh(palletColor) {
      const grp = new THREE.Group();
      const woodMat = new THREE.MeshLambertMaterial({ color: palletColor || 0xc28b52 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.26, 2.0), woodMat);
      base.position.y = 0.13;
      grp.add(base);
      return grp;
    }

    /* Industrial Multi-Tier Modular Storage Rack Builder (Matching Reference Image)
       - Royal Blue upright corner posts (0x1d4ed8)
       - Horizontal white steel cross-bracing ties between front and back posts (0xf8fafc)
       - Safety Orange horizontal load beams (0xf97316)
       - White wire/steel shelf decking platforms (0xf8fafc) on all tiers
       - Multi-bay support with intermediate frames if width >= 7.0 */

function createRedIndustrialPallet(width, depth) {
  const palW = width || 2.4;
  const palD = depth || 1.6;
  const palH = 0.16;
  const grp = new THREE.Group();
  const redMat = getRedPalletMaterial();

  // Top deck boards (parallel planks with realistic gaps)
  const plankCount = 6;
  const plankD = (palD - 0.08) / plankCount;
  for (let p = 0; p < plankCount; p++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.03, plankD * 0.88), redMat);
    const zOffset = -palD / 2 + plankD / 2 + p * plankD;
    plank.position.set(0, palH - 0.015, zOffset);
    plank.castShadow = true;
    plank.receiveShadow = true;
    grp.add(plank);
  }

  // 3 runner stringers (left, center, right)
  const runnerW = 0.14;
  const runnerH = palH - 0.06;
  [-palW / 2 + runnerW / 2 + 0.05, 0, palW / 2 - runnerW / 2 - 0.05].forEach(function (rx) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(runnerW, runnerH, palD), redMat);
    runner.position.set(rx, palH / 2, 0);
    runner.castShadow = true;
    runner.receiveShadow = true;
    grp.add(runner);
  });

  // Bottom skid boards
  for (let p = 0; p < 3; p++) {
    const btmPlank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.025, palD * 0.22), redMat);
    const btmZ = -palD / 2 + 0.18 + p * (palD - 0.36) / 2;
    btmPlank.position.set(0, 0.012, btmZ);
    grp.add(btmPlank);
  }

  grp.userData.dimensions = { width: palW, depth: palD, height: palH };
  return grp;
}

/* 1. Shrink-Wrapped Corrugated Kraft Boxes on Red Pallet (Matching Foreground of Reference Image) */
function createFgShrinkWrappedBoxPallet(labelType, tiersCount) {
  const grp = new THREE.Group();
  const palW = 2.4;
  const palD = 1.6;
  const pallet = createRedIndustrialPallet(palW, palD);
  grp.add(pallet);

  const palH = 0.16;
  const tiers = tiersCount || 2;
  const boxW = 1.08;
  const boxD = 0.72;
  const boxH = 0.48;
  const kraftMat = getKraftBoxMaterial();
  const labelMat = new THREE.MeshBasicMaterial({
    map: (labelType === 'starflex') ? getBoxStarflexLabelTexture() : getBoxMangoLabelTexture()
  });

  // 2x2 grid of boxes per tier
  const xOffsets = [-palW / 4, palW / 4];
  const zOffsets = [-palD / 4, palD / 4];

  for (let t = 0; t < tiers; t++) {
    const curY = palH + t * boxH;
    xOffsets.forEach(function (bx) {
      zOffsets.forEach(function (bz) {
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftMat);
        boxMesh.position.set(bx, curY + boxH / 2, bz);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        grp.add(boxMesh);

        // White sealing tape on top of box
        const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), getWhiteTapeMaterial());
        tape.position.set(bx, curY + boxH + 0.005, bz);
        grp.add(tape);

        // Product label on front-facing side of box
        if (bz > 0) {
          const label = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.22), labelMat);
          label.position.set(bx, curY + boxH * 0.52, bz + boxD / 2 + 0.003);
          grp.add(label);
        }
      });
    });
  }

  // Transparent Stretch Wrap Film Envelope enclosing the stacked boxes
  const totalStackH = tiers * boxH;
  const wrapGeo = new THREE.BoxGeometry(palW - 0.08, totalStackH + 0.04, palD - 0.08);
  const wrapMesh = new THREE.Mesh(wrapGeo, getStretchWrapMaterial());
  wrapMesh.position.set(0, palH + totalStackH / 2, 0);
  grp.add(wrapMesh);


  return grp;
}

/* 2. Large Finished Film Rolls Lying Horizontally on Red Pallet with Wooden Chocks (Matching Center of Reference Image) */
function createFgHorizontalRollsPallet() {
  const grp = new THREE.Group();
  const palW = 2.4;
  const palD = 1.6;
  const pallet = createRedIndustrialPallet(palW, palD);
  grp.add(pallet);

  const palH = 0.16;
  const rollRadius = 0.40;
  const rollLength = 1.48; // Runs along Z axis, circular ends face front/back
  const whiteFilmMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.24,
    metalness: 0.08
  });
  const endFaceMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const coreMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // Black papercore center
  const chockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // Wood chock

  // 2 horizontal rolls side-by-side
  [-0.58, 0.58].forEach(function (rx) {
    const rollGrp = new THREE.Group();
    rollGrp.position.set(rx, palH + rollRadius, 0);

    // Cylindrical roll body lying along Z axis (rotation.x = Math.PI / 2)
    const rollMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rollRadius, rollRadius, rollLength, 26),
      [whiteFilmMat, endFaceMat, endFaceMat]
    );
    rollMesh.rotation.x = Math.PI / 2;
    rollMesh.castShadow = true;
    rollMesh.receiveShadow = true;
    rollGrp.add(rollMesh);

    // Black core holes at both ends
    [-rollLength / 2 - 0.002, rollLength / 2 + 0.002].forEach(function (cz) {
      const coreHole = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.01, 16), coreMat);
      coreHole.rotation.x = Math.PI / 2;
      coreHole.position.z = cz;
      rollGrp.add(coreHole);
    });

    grp.add(rollGrp);

    // Wooden wedge chocks under the sides of each roll to prevent rolling
    [-0.26, 0.26].forEach(function (cxOffset) {
      [-0.45, 0.45].forEach(function (cz) {
        const chock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.28), chockMat);
        chock.position.set(rx + cxOffset, palH + 0.045, cz);
        grp.add(chock);
      });
    });
  });

  // Clear stretch wrap film encasing both rolls and pallet
  const wrapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(palW - 0.08, rollRadius * 2 + 0.06, palD - 0.06),
    getStretchWrapMaterial()
  );
  wrapMesh.position.set(0, palH + rollRadius, 0);
  grp.add(wrapMesh);

  return grp;
}

/* 3. Multi-Tier Vertical Slit Roll Columns on Red Pallet (Matching Left Side of Reference Image) */
function createFgVerticalRollsPallet() {
  const grp = new THREE.Group();
  const palW = 2.4;
  const palD = 1.6;
  const pallet = createRedIndustrialPallet(palW, palD);
  grp.add(pallet);

  const palH = 0.16;
  const rollRadius = 0.30;
  const rollH = 0.38;
  const colTiers = 3; // 3 rolls stacked per column

  const printedRollMat = new THREE.MeshStandardMaterial({
    map: getHygieneFilmTexture(),
    roughness: 0.28,
    metalness: 0.12
  });
  const faceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
  const coreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

  // 6 columns: 3 columns along X, 2 along Z
  const xCols = [-0.74, 0, 0.74];
  const zCols = [-0.42, 0.42];

  xCols.forEach(function (cx, cIdx) {
    zCols.forEach(function (cz, rIdx) {
      for (let tier = 0; tier < colTiers; tier++) {
        const curY = palH + tier * rollH + rollH / 2;
        const roll = new THREE.Mesh(
          new THREE.CylinderGeometry(rollRadius, rollRadius, rollH - 0.01, 20),
          [printedRollMat, faceMat, faceMat]
        );
        roll.position.set(cx, curY, cz);
        roll.rotation.y = tier * 1.5 + cIdx * 0.8 + rIdx * 1.2;
        roll.castShadow = true;
        roll.receiveShadow = true;
        grp.add(roll);

        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, rollH, 12), coreMat);
        core.position.set(cx, curY, cz);
        grp.add(core);
      }
    });
  });

  // Clear stretch wrap film encasing the entire perimeter of the roll stack
  const totalH = colTiers * rollH;
  const wrapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(palW - 0.08, totalH + 0.04, palD - 0.08),
    getStretchWrapMaterial()
  );
  wrapMesh.position.set(0, palH + totalH / 2, 0);
  grp.add(wrapMesh);

  return grp;
}


/* 4. Floor-Staged Finished Goods Box Pallet with Stepped Upper Tier & Clear Stretch Wrap (Matching Reference Photo) */
function createFgFloorStagedBoxPallet(variant) {
  const grp = new THREE.Group();
  const palW = 2.4;
  const palD = 1.6;
  const pallet = createRedIndustrialPallet(palW, palD);
  grp.add(pallet);

  const palH = 0.16;
  const boxW = 1.08;
  const boxD = 0.72;
  const boxH = 0.48;
  const kraftMat = getKraftBoxMaterial();
  const tapeMat = getWhiteTapeMaterial();
  const mangoMat = new THREE.MeshBasicMaterial({ map: getBoxMangoLabelTexture() });
  const starflexMat = new THREE.MeshBasicMaterial({ map: getBoxStarflexLabelTexture() });

  const xOffsets = [-palW / 4, palW / 4];
  const zOffsets = [-palD / 4, palD / 4];

  // Lower 2 Full Tiers (2x2 grid = 4 boxes per tier)
  for (let t = 0; t < 2; t++) {
    const curY = palH + t * boxH;
    xOffsets.forEach(function (bx, xi) {
      zOffsets.forEach(function (bz, zi) {
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftMat);
        boxMesh.position.set(bx, curY + boxH / 2, bz);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        grp.add(boxMesh);

        // Sealing tape on top
        const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), tapeMat);
        tape.position.set(bx, curY + boxH + 0.005, bz);
        grp.add(tape);

        // Labels on visible outer sides
        if (bz > 0) {
          const lMat = (xi === 0) ? mangoMat : starflexMat;
          const label = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.22), lMat);
          label.position.set(bx, curY + boxH * 0.52, bz + boxD / 2 + 0.003);
          grp.add(label);
        }
      });
    });
  }

  // Stepped Partial Top Tier (Tier 3) matching the user's photo!
  const topY = palH + 2 * boxH;
  if (variant === 'stepped_dual') {
    // 2 boxes along the back row
    xOffsets.forEach(function (bx, xi) {
      const bz = -palD / 4;
      const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftMat);
      boxMesh.position.set(bx, topY + boxH / 2, bz);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      grp.add(boxMesh);

      const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), tapeMat);
      tape.position.set(bx, topY + boxH + 0.005, bz);
      grp.add(tape);

      const lMat = (xi === 0) ? mangoMat : starflexMat;
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.22), lMat);
      label.position.set(bx, topY + boxH * 0.52, bz + boxD / 2 + 0.003);
      grp.add(label);
    });

    // Top tier wrap
    const topWrap = new THREE.Mesh(
      new THREE.BoxGeometry(palW - 0.08, boxH + 0.03, boxD + 0.04),
      getStretchWrapMaterial()
    );
    topWrap.position.set(0, topY + boxH / 2, -palD / 4);
    grp.add(topWrap);
  } else {
    // 1 box centered or stepped on front left
    const bx = -palW / 4;
    const bz = palD / 4;
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftMat);
    boxMesh.position.set(bx, topY + boxH / 2, bz);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    grp.add(boxMesh);

    const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), tapeMat);
    tape.position.set(bx, topY + boxH + 0.005, bz);
    grp.add(tape);

    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.22), mangoMat);
    label.position.set(bx, topY + boxH * 0.52, bz + boxD / 2 + 0.003);
    grp.add(label);

    const topWrap = new THREE.Mesh(
      new THREE.BoxGeometry(boxW + 0.04, boxH + 0.03, boxD + 0.04),
      getStretchWrapMaterial()
    );
    topWrap.position.set(bx, topY + boxH / 2, bz);
    grp.add(topWrap);
  }

  // Main Transparent Stretch Wrap Film Envelope around lower tiers
  const lowerH = 2 * boxH;
  const wrapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(palW - 0.06, lowerH + 0.04, palD - 0.06),
    getStretchWrapMaterial()
  );
  wrapMesh.position.set(0, palH + lowerH / 2, 0);
  grp.add(wrapMesh);


  return grp;
}

/* =========================================================================
   STANDARD STARFLEX BOX PALLET (Matching Reference Image media_1792732066355)
   - Natural Warm Wood Pallet with Dark Wood Runner Blocks
   - 2 Tiers of 2x2 Corrugated Kraft Boxes (8 boxes total)
   - White Sealing Tape across the top face of each box
   - Starflex Shipping Label with Cyan/Blue Header Band on the front of each box
   ========================================================================= */

function createRealisticWoodPallet(width, depth) {
  const palW = width || 2.2;
  const palD = depth || 1.6;
  const palH = 0.16;
  const grp = new THREE.Group();
  const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
  const blockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });

  // Top deck boards
  const plankCount = 6;
  const plankD = (palD - 0.08) / plankCount;
  for (let p = 0; p < plankCount; p++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.028, plankD * 0.88), woodMat);
    plank.position.set(0, palH - 0.014, -palD / 2 + plankD / 2 + p * plankD);
    plank.castShadow = true;
    plank.receiveShadow = true;
    grp.add(plank);
  }

  // 3 runner stringers (left, center, right)
  const runnerW = 0.14;
  const runnerH = palH - 0.05;
  [-palW / 2 + 0.10, 0, palW / 2 - 0.10].forEach(function (rx) {
    const runner = new THREE.Mesh(new THREE.BoxGeometry(runnerW, runnerH, palD), blockMat);
    runner.position.set(rx, runnerH / 2 + 0.02, 0);
    runner.castShadow = true;
    runner.receiveShadow = true;
    grp.add(runner);
  });

  // Bottom skid boards
  for (let p = 0; p < 3; p++) {
    const btmPlank = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.02, palD * 0.22), woodMat);
    btmPlank.position.set(0, 0.01, -palD / 2 + 0.18 + p * (palD - 0.36) / 2);
    grp.add(btmPlank);
  }

  grp.userData.dimensions = { width: palW, depth: palD, height: palH };
  return grp;
}

function buildStandardBoxPalletLayers(parentGroup, baseHeight, options) {
  const opt = options || {};
  const bHeight = (baseHeight !== undefined) ? baseHeight : 0.16;
  const palW = opt.width || 2.2;
  const palD = opt.depth || 1.6;
  const tiers = opt.tiers || 2;
  const boxW = opt.boxWidth || ((palW - 0.12) / 2);
  const boxD = opt.boxDepth || ((palD - 0.12) / 2);
  const boxH = opt.boxHeight || 0.48;

  const kraftMat = getKraftBoxMaterial();
  const tapeMat = getWhiteTapeMaterial();
  const labelMat = new THREE.MeshBasicMaterial({
    map: opt.labelTexture || getBoxStarflexLabelTexture()
  });

  const xOffsets = [-palW / 4, palW / 4];
  const zOffsets = [-palD / 4, palD / 4];

  for (let t = 0; t < tiers; t++) {
    const curY = bHeight + t * boxH;
    xOffsets.forEach(function (bx) {
      zOffsets.forEach(function (bz) {
        const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), kraftMat);
        boxMesh.position.set(bx, curY + boxH / 2, bz);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        parentGroup.add(boxMesh);

        // White sealing tape on top of box
        const tape = new THREE.Mesh(new THREE.BoxGeometry(boxW + 0.005, 0.01, 0.16), tapeMat);
        tape.position.set(bx, curY + boxH + 0.005, bz);
        parentGroup.add(tape);

        // Front-facing label (facing +Z)
        if (bz > 0) {
          const label = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.21), labelMat);
          label.position.set(bx, curY + boxH * 0.52, bz + boxD / 2 + 0.003);
          parentGroup.add(label);
        }
      });
    });
  }

  if (opt.hasWrap) {
    const totalH = tiers * boxH;
    const wrapMesh = new THREE.Mesh(
      new THREE.BoxGeometry(palW - 0.06, totalH + 0.04, palD - 0.06),
      getStretchWrapMaterial()
    );
    wrapMesh.position.set(0, bHeight + totalH / 2, 0);
    parentGroup.add(wrapMesh);

  }
}

function createStandardBoxPallet(options) {
  const opt = options || {};
  const palW = opt.width || 2.2;
  const palD = opt.depth || 1.6;
  const isRed = !!opt.isRed;
  const pallet = isRed ? createRedIndustrialPallet(palW, palD) : createRealisticWoodPallet(palW, palD);
  const grp = new THREE.Group();
  grp.add(pallet);
  buildStandardBoxPalletLayers(grp, 0.16, opt);
  return grp;
}

