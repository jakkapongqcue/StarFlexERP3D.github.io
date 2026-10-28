/* =========================================================================
   StarFlexERP 3D - 3D Cargo & Warehouse Prop Builders (props.js)
   Procedural meshes for Boxes, Pouches, Resin Sacks, Racks & Chemical Drums
   ========================================================================= */

    function createIndustrialRackUnit(width, depth, height, uprightColorHex, beamColorHex, levelsCount) {
      const rack = new THREE.Group();
      const uprightMat = new THREE.MeshLambertMaterial({ color: uprightColorHex || 0x1d4ed8 });
      const beamMat    = new THREE.MeshLambertMaterial({ color: beamColorHex || 0xf97316 });
      const deckMat    = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const braceMat   = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const bracketMat = new THREE.MeshLambertMaterial({ color: 0xea580c });

      const halfW = width / 2 - 0.15;
      const halfD = depth / 2 - 0.15;
      const actualHeight = height || 4.8;

      // Determine frame positions along X (Multi-bay if wide)
      const xFrames = (width >= 7.0) ? [-halfW, 0, halfW] : [-halfW, halfW];

      // Vertical Upright Posts and White Cross-Bracing Ties for each frame
      xFrames.forEach(function (xPos) {
        [-halfD, halfD].forEach(function (zPos) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, actualHeight, 0.24), uprightMat);
          post.position.set(xPos, actualHeight / 2, zPos);
          rack.add(post);
        });

        [0.85, 2.40, 3.90].forEach(function (yBrace) {
          if (yBrace < actualHeight - 0.3) {
            const tie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, depth - 0.32), braceMat);
            tie.position.set(xPos, yBrace, 0);
            rack.add(tie);
          }
        });
      });

      // 3 Shelf Levels / Tiers (default 3 levels or custom)
      const tiers = (levelsCount === 2) ? [0.85, 2.65] : [0.85, 2.40, 3.90];

      tiers.forEach(function (yLevel) {
        if (yLevel > actualHeight - 0.2) return;

        // Front & Back Safety Orange horizontal beams
        const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(width, 0.20, 0.14), beamMat);
        frontBeam.position.set(0, yLevel, halfD);
        rack.add(frontBeam);

        const backBeam = new THREE.Mesh(new THREE.BoxGeometry(width, 0.20, 0.14), beamMat);
        backBeam.position.set(0, yLevel, -halfD);
        rack.add(backBeam);

        // Orange beam end wrap brackets on upright posts
        xFrames.forEach(function (xPos) {
          [-halfD, halfD].forEach(function (zPos) {
            const bkt = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.28), bracketMat);
            bkt.position.set(xPos, yLevel, zPos);
            rack.add(bkt);
          });
        });

        // Crisp White Shelf Decking Platform
        const shelfDeck = new THREE.Mesh(new THREE.BoxGeometry(width - 0.28, 0.08, depth - 0.30), deckMat);
        shelfDeck.position.set(0, yLevel + 0.08, 0);
        rack.add(shelfDeck);
      });

      return rack;
    }

    /* Helper: Create Burgundy / Crimson Drum with White Graphic Label (Reference Image) */
    function createBurgundyRackDrum() {
      const drumGrp = new THREE.Group();
      const burgundyMat = new THREE.MeshLambertMaterial({ color: 0x881337 });
      const labelMat    = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const darkMat     = new THREE.MeshLambertMaterial({ color: 0x1e293b });

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.25, 18), burgundyMat);
      body.position.y = 0.62;
      drumGrp.add(body);

      const labelBand = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.55, 18), labelMat);
      labelBand.position.y = 0.62;
      drumGrp.add(labelBand);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.57, 0.57, 0.06, 18), darkMat);
      rim.position.y = 1.25;
      drumGrp.add(rim);

      const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10), darkMat);
      plug.position.set(0.24, 1.28, 0.12);
      drumGrp.add(plug);

      return drumGrp;
    }

    /* =========================================================================
       REUSABLE KRAFT CORRUGATED CARTON BOX COMPONENT (Matching User Reference Image)
       Features:
       - Natural Warm Kraft Cardboard body (0xd4a373)
       - Crisp White Sealing Tape (0xf8fafc) running across the top face center
       - Optional open-top mode for collection boxes with interior cavity
       - Global material caching for zero redundant shader switches and low memory
       - Supports both options object: { width, height, depth, tapeDir, openTop }
         and positional parameters: (width, height, depth, tapeDir)
       - Pivot at bottom center (Y = 0) so setting position.y = 0 places it flush on floor
       ========================================================================= */

    function createKraftCartonBox(optionsOrW, height, depth, tapeDir) {
      let w = 1.35, h = 0.90, d = 1.35, dir = 'z', tapeW = null, openTop = false, boxMat = null, tapeMat = null;

      if (typeof optionsOrW === 'object' && optionsOrW !== null) {
        w = optionsOrW.width !== undefined ? optionsOrW.width : 1.35;
        h = optionsOrW.height !== undefined ? optionsOrW.height : 0.90;
        d = optionsOrW.depth !== undefined ? optionsOrW.depth : 1.35;
        dir = optionsOrW.tapeDir || 'z';
        tapeW = optionsOrW.tapeWidth || null;
        openTop = !!optionsOrW.openTop;
        if (optionsOrW.color) {
          boxMat = new THREE.MeshLambertMaterial({ color: optionsOrW.color });
        }
        if (optionsOrW.tapeColor) {
          tapeMat = new THREE.MeshLambertMaterial({ color: optionsOrW.tapeColor });
        }
      } else if (typeof optionsOrW === 'number') {
        w = optionsOrW;
        h = height !== undefined ? height : 0.90;
        d = depth !== undefined ? depth : 1.35;
        dir = tapeDir || 'z';
      }

      const grp = new THREE.Group();
      const bMat = boxMat || getKraftBoxMaterial();
      const tMat = tapeMat || getWhiteTapeMaterial();

      if (openTop) {
        const wallThick = 0.05;
        const btm = new THREE.Mesh(new THREE.BoxGeometry(w, wallThick, d), bMat);
        btm.position.y = wallThick / 2;
        btm.castShadow = true;
        btm.receiveShadow = true;
        grp.add(btm);

        const fbGeo = new THREE.BoxGeometry(w, h - wallThick, wallThick);
        const frontWall = new THREE.Mesh(fbGeo, bMat);
        frontWall.position.set(0, wallThick + (h - wallThick) / 2, d / 2 - wallThick / 2);
        frontWall.castShadow = true;
        grp.add(frontWall);

        const backWall = new THREE.Mesh(fbGeo, bMat);
        backWall.position.set(0, wallThick + (h - wallThick) / 2, -d / 2 + wallThick / 2);
        backWall.castShadow = true;
        grp.add(backWall);

        const lrGeo = new THREE.BoxGeometry(wallThick, h - wallThick, d - wallThick * 2);
        const leftWall = new THREE.Mesh(lrGeo, bMat);
        leftWall.position.set(-w / 2 + wallThick / 2, wallThick + (h - wallThick) / 2, 0);
        leftWall.castShadow = true;
        grp.add(leftWall);

        const rightWall = new THREE.Mesh(lrGeo, bMat);
        rightWall.position.set(w / 2 - wallThick / 2, wallThick + (h - wallThick) / 2, 0);
        rightWall.castShadow = true;
        grp.add(rightWall);

        const innerLiner = new THREE.Mesh(new THREE.BoxGeometry(w - wallThick * 2, 0.005, d - wallThick * 2), getDarkInnerMaterial());
        innerLiner.position.y = wallThick + 0.003;
        grp.add(innerLiner);
      } else {
        const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
        box.position.y = h / 2;
        box.castShadow = true;
        box.receiveShadow = true;
        grp.add(box);

        const tThickness = 0.015;
        let tGeo;
        if (dir === 'x') {
          const calcTapeW = tapeW || Math.max(0.18, Math.min(0.38, d * 0.24));
          tGeo = new THREE.BoxGeometry(w + 0.01, tThickness, calcTapeW);
        } else {
          const calcTapeW = tapeW || Math.max(0.18, Math.min(0.38, w * 0.24));
          tGeo = new THREE.BoxGeometry(calcTapeW, tThickness, d + 0.01);
        }

        const tape = new THREE.Mesh(tGeo, tMat);
        tape.position.set(0, h + tThickness / 2, 0);
        tape.castShadow = true;
        grp.add(tape);

        // Product shipping label with cyan/blue Starflex header on front face (media_1792732066355)
        if (typeof optionsOrW !== 'object' || optionsOrW.hasLabel !== false) {
          const labelMat = new THREE.MeshBasicMaterial({ map: getBoxStarflexLabelTexture() });
          const labelW = Math.min(0.42, w * 0.42);
          const labelH = Math.min(0.24, h * 0.42);
          const label = new THREE.Mesh(new THREE.PlaneGeometry(labelW, labelH), labelMat);
          label.position.set(0, h * 0.52, d / 2 + 0.003);
          grp.add(label);
          grp.userData.labelMesh = label;

        }

        grp.userData.boxMesh = box;
        grp.userData.tapeMesh = tape;
      }

      grp.userData.dimensions = { width: w, height: h, depth: d };
      return grp;
    }

    /* Helper: Create Kraft Corrugated Carton Box with White Center Tape (Reference Image) */
    function createKraftRackBox() {
      return createKraftCartonBox(1.35, 0.90, 1.35, 'z');
    }

    /* =========================================================================
       HYGIENE PACKAGING PROCEDURAL TEXTURE GENERATORS (Matching Reference Image)
       Authentic Thai Gravure Flexible Packaging Refill Pouch & Continuous Web Roll
       ========================================================================= */

    /* Realistic Flexible Packaging Stand-up Pouch (with optional Spout Cap)
       Renders authentic Hygiene Refill Pouch front & back panels */
    function createPouchMesh(options) {
      options = options || {};
      const pouchGroup = new THREE.Group();
      const hasSpout = Boolean(options.hasSpout);
      const spoutColor = options.spoutColor || 0x10b981; // emerald green screw cap matching Hygiene
      const width = options.width || 0.44;
      const height = options.height || 0.60;
      const depth = options.depth || 0.085;

      // 1. Glossy foil pouch body with authentic Hygiene graphics
      const foilRimMat = new THREE.MeshStandardMaterial({
        color: 0xbe185d,
        roughness: 0.28,
        metalness: 0.20
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: getHygienePouchTexture(),
        roughness: 0.28,
        metalness: 0.12
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: getHygienePouchBackTexture(),
        roughness: 0.28,
        metalness: 0.12
      });

      // BoxGeometry faces: [+X, -X, +Y, -Y, +Z (Front), -Z (Back)]
      const bodyMats = [foilRimMat, foilRimMat, foilRimMat, foilRimMat, frontMat, backMat];
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.86, depth), bodyMats);
      body.position.y = (height * 0.86) / 2;
      pouchGroup.add(body);

      // 2. Stand-up bottom gusset (Dark Magenta)
      const gussetMat = new THREE.MeshLambertMaterial({ color: 0x9f1239 });
      const gusset = new THREE.Mesh(new THREE.BoxGeometry(width * 0.94, height * 0.12, depth * 1.5), gussetMat);
      gusset.position.y = (height * 0.12) / 2;
      pouchGroup.add(gusset);

      // 3. Top heat-seal banner (Embossed Silver-White crimped seal)
      const sealMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const topSeal = new THREE.Mesh(new THREE.BoxGeometry(width * 1.02, height * 0.12, depth * 0.36), sealMat);
      topSeal.position.y = height * 0.86 + (height * 0.12) / 2;
      pouchGroup.add(topSeal);

      // 4. Spout Assembly (if spouted pouch)
      if (hasSpout) {
        const spoutAssembly = new THREE.Group();
        const neckMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
        const capMat = new THREE.MeshLambertMaterial({ color: spoutColor });

        // Spout base / welded flange on pouch shoulder
        const flange = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.10), neckMat);
        flange.position.y = 0.02;
        spoutAssembly.add(flange);

        // Threaded neck cylinder
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.13, 12), neckMat);
        neck.position.y = 0.085;
        spoutAssembly.add(neck);

        // Ribbed screw cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.09, 14), capMat);
        cap.position.y = 0.155;
        spoutAssembly.add(cap);

        // Tamper ring
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.025, 12), capMat);
        ring.position.y = 0.095;
        spoutAssembly.add(ring);

        // Position: corner-angled (typical refill spout pouch) or center
        const isCorner = options.isCornerSpout !== undefined ? options.isCornerSpout : true;
        if (isCorner) {
          spoutAssembly.position.set(-width * 0.30, height * 0.88, 0);
          spoutAssembly.rotation.z = Math.PI * 0.18;
        } else {
          spoutAssembly.position.set(0, height * 0.94, 0);
        }
        pouchGroup.add(spoutAssembly);
      }

      return pouchGroup;
    }

    /* Authentic 25kg Industrial Polymer Resin Valve Sack Builder (Horizontal Stacking)
       - Detailed canvas texture: woven off-white polypropylene bag, royal blue brand band,
         bold product grade labels, net weight 25 kg, lot numbering, recycling triangle code,
         and red/blue end-seam crepe stitch tape.
       - Organic horizontal pillowed cushion volume with bulging side edges and pinched sewn ends.
       - Interlocking horizontal layer stacking on wooden euro-pallets matching industrial reference. */


    function createSingleResinSack(len, wid, hgt) {
      len = len || 1.05;
      wid = wid || 0.60;
      hgt = hgt || 0.20;

      const mats = getResinSackMaterials();
      const sackGrp = new THREE.Group();

      // Main cushion core with printed top face
      const bodyBox = new THREE.Mesh(new THREE.BoxGeometry(len * 0.94, hgt * 0.88, wid * 0.90), mats.box);
      bodyBox.position.y = hgt * 0.5;
      sackGrp.add(bodyBox);

      // Pillowed rounded bulging sides along the length
      const sideGeo = new THREE.CylinderGeometry(hgt * 0.44, hgt * 0.44, len * 0.86, 8);
      const side1 = new THREE.Mesh(sideGeo, mats.side);
      side1.rotation.z = Math.PI / 2;
      side1.position.set(0, hgt * 0.5, wid * 0.42);
      sackGrp.add(side1);

      const side2 = new THREE.Mesh(sideGeo, mats.side);
      side2.rotation.z = Math.PI / 2;
      side2.position.set(0, hgt * 0.5, -wid * 0.42);
      sackGrp.add(side2);

      // Pinched sewn end seams (left & right)
      const seamGeo = new THREE.BoxGeometry(len * 0.04, hgt * 0.35, wid * 0.88);
      const seamL = new THREE.Mesh(seamGeo, mats.seam);
      seamL.position.set(-len * 0.485, hgt * 0.5, 0);
      sackGrp.add(seamL);

      const seamR = new THREE.Mesh(seamGeo, mats.seam);
      seamR.position.set(len * 0.485, hgt * 0.5, 0);
      sackGrp.add(seamR);

      // Blue industrial crepe stitch tape along the seam flaps
      const tapeGeo = new THREE.BoxGeometry(len * 0.02, hgt * 0.42, wid * 0.90);
      const tapeL = new THREE.Mesh(tapeGeo, mats.tape);
      tapeL.position.set(-len * 0.495, hgt * 0.5, 0);
      sackGrp.add(tapeL);

      const tapeR = new THREE.Mesh(tapeGeo, mats.tape);
      tapeR.position.set(len * 0.495, hgt * 0.5, 0);
      sackGrp.add(tapeR);

      return sackGrp;
    }

    function buildResinSackPalletLayers(parentGroup, baseHeight) {
      baseHeight = (baseHeight !== undefined) ? baseHeight : 0.26;
      const len = 1.05;
      const wid = 0.60;
      const hgt = 0.20;

      // Layer 1 (h = baseHeight): 6 sacks horizontal along X
      [-0.54, 0.54].forEach(function (x) {
        [-0.60, 0.0, 0.60].forEach(function (z) {
          const s = createSingleResinSack(len, wid, hgt);
          s.position.set(x, baseHeight, z);
          parentGroup.add(s);
        });
      });

      // Layer 2 (h = baseHeight + hgt): 6 sacks cross-stacked horizontal along Z (rotated 90 deg)
      [-0.60, 0.0, 0.60].forEach(function (x) {
        [-0.54, 0.54].forEach(function (z) {
          const s = createSingleResinSack(len, wid, hgt);
          s.rotation.y = Math.PI / 2;
          s.position.set(x, baseHeight + hgt, z);
          parentGroup.add(s);
        });
      });

      // Layer 3 (h = baseHeight + 2*hgt): 6 sacks horizontal along X
      [-0.54, 0.54].forEach(function (x) {
        [-0.60, 0.0, 0.60].forEach(function (z) {
          const s = createSingleResinSack(len, wid, hgt);
          s.position.set(x, baseHeight + hgt * 2, z);
          parentGroup.add(s);
        });
      });

      // Layer 4 (h = baseHeight + 3*hgt): 4 sacks cross-stacked on top (tidy top finish)
      [-0.42, 0.42].forEach(function (x) {
        [-0.42, 0.42].forEach(function (z) {
          const s = createSingleResinSack(len, wid, hgt);
          s.rotation.y = Math.PI / 2;
          s.position.set(x, baseHeight + hgt * 3, z);
          parentGroup.add(s);
        });
      });

      return parentGroup;
    }

    function createCargoVisualByKey(matKey) {
      const isFg = (matKey === "FG_BAG_BOX" || matKey === "FG_SPOUT_BOX" || matKey === "SLIT_ROLL");
      const grp = createPalletBaseMesh(isFg ? 0xb91c1c : null);
      const info = MATERIAL_CATALOG[matKey] || MATERIAL_CATALOG.RESIN;
      const col = new THREE.Color(info.color || '#3b82f6');

      if (matKey === 'CYLINDER') {
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.75, roughness: 0.25 });
        for (let i = 0; i < 3; i++) {
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.1, 16), metalMat);
          rod.rotation.z = Math.PI / 2;
          rod.position.set(0, 0.48 + (i % 2) * 0.32, -0.45 + i * 0.45);
          grp.add(rod);
        }
      } else if (matKey === 'RM_INK' || matKey === 'MIXED_INK' || matKey === 'SOLVENT' || matKey === 'ADHESIVE') {
        const isLarge = (matKey === 'RM_INK' || matKey === 'MIXED_INK');
        const radius = isLarge ? 0.38 : 0.30;
        const height = isLarge ? 1.15 : 0.88;
        const drumMat = new THREE.MeshLambertMaterial({ color: col });
        [[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]].forEach(function (of) {
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 14), drumMat);
          drum.position.set(of[0], 0.26 + height / 2, of[1]);
          grp.add(drum);
        });
      } else if (matKey === 'RESIN') {
        buildResinSackPalletLayers(grp, 0.26);
      } else if (matKey === 'PURCHASED_FILM' || matKey === 'BLOWN_FILM') {
        // Raw Substrate Film Rolls: Must be pure white before Printing
        const whiteRollMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 });
        const whiteFaceMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
        const coreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
        for (let i = -1; i <= 1; i += 2) {
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.50, 0.50, 1.85, 20),
            [whiteRollMat, whiteFaceMat, whiteFaceMat]
          );
          roll.rotation.z = Math.PI / 2;
          roll.position.set(0, 0.78, i * 0.48);
          grp.add(roll);
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.95, 12), coreMat);
          core.rotation.z = Math.PI / 2;
          core.position.set(0, 0.78, i * 0.48);
          grp.add(core);
        }
      } else if (matKey === 'LAMINATE_FILM') {
        const rollMat = new THREE.MeshLambertMaterial({ color: col });
        const coreMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
        for (let i = -1; i <= 1; i += 2) {
          const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.50, 1.85, 18), rollMat);
          roll.rotation.z = Math.PI / 2;
          roll.position.set(0, 0.78, i * 0.48);
          grp.add(roll);
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.95, 12), coreMat);
          core.rotation.z = Math.PI / 2;
          core.position.set(0, 0.78, i * 0.48);
          grp.add(core);
        }
      } else if (matKey === 'PRINTING_ROLL' || matKey === 'LAMINATE_ROLL') {
        const isLam = (matKey === 'LAMINATE_ROLL');
        const rollMat = new THREE.MeshStandardMaterial({
          map: getHygieneFilmTexture(),
          roughness: isLam ? 0.16 : 0.28,
          metalness: isLam ? 0.20 : 0.12
        });
        const faceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 }); // Blush pink roll edge
        const coreMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
        for (let i = -1; i <= 1; i += 2) {
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.52, 0.52, 1.85, 24),
            [rollMat, faceMat, faceMat]
          );
          roll.rotation.z = Math.PI / 2;
          roll.position.set(0, 0.78, i * 0.48);
          grp.add(roll);
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.95, 12), coreMat);
          core.rotation.z = Math.PI / 2;
          core.position.set(0, 0.78, i * 0.48);
          grp.add(core);
        }
      } else if (matKey === 'SLIT_ROLL') {
        // 4 Narrow Slit Hygiene Film Rolls laid flat horizontally on pallet
        const slitMat = new THREE.MeshStandardMaterial({
          map: getHygieneFilmTexture(),
          roughness: 0.28,
          metalness: 0.12
        });
        const faceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
        const coreMat = new THREE.MeshLambertMaterial({ color: 0xd97706 }); // Papercore
        const rollH = 0.42;
        const rollRadius = 0.44;
        const baseY = 0.26;

        // Cardboard base protector sheet on pallet deck
        const sheet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.015, 1.7), getKraftBoxMaterial());
        sheet.position.set(0, baseY + 0.0075, 0);
        grp.add(sheet);

        [-0.50, 0.50].forEach(function (rx) {
          [-0.45, 0.45].forEach(function (rz) {
            const roll = new THREE.Mesh(
              new THREE.CylinderGeometry(rollRadius, rollRadius, rollH, 24),
              [slitMat, faceMat, faceMat]
            );
            roll.position.set(rx, baseY + 0.015 + rollH / 2, rz);
            grp.add(roll);

            const core = new THREE.Mesh(
              new THREE.CylinderGeometry(0.14, 0.14, rollH + 0.01, 16),
              coreMat
            );
            core.position.set(rx, baseY + 0.015 + rollH / 2, rz);
            grp.add(core);
          });
        });
      } else if (matKey === 'PAPERCORE') {
        const tubeMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
        for (let r = 0; r < 2; r++) {
          for (let c = -1; c <= 1; c++) {
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.9, 12), tubeMat);
            tube.rotation.z = Math.PI / 2;
            tube.position.set(0, 0.45 + r * 0.34, c * 0.40);
            grp.add(tube);
          }
        }
      } else if (matKey === 'BOX' || matKey === 'FG_BAG_BOX' || matKey === 'FG_SPOUT_BOX') {
        buildStandardBoxPalletLayers(grp, 0.26, {
          width: 2.2,
          depth: 1.6,
          tiers: 2,
          hasWrap: true
        });
        if (matKey === 'FG_BAG_BOX') {
          [-0.48, 0.48].forEach(function (bx) {
            [-0.32, 0, 0.32].forEach(function (bz) {
              const p = createPouchMesh({
                hasSpout: false,
                width: 0.36,
                height: 0.46,
                depth: 0.075
              });
              p.position.set(bx, 1.48, bz);
              p.rotation.z = -0.06;
              grp.add(p);
            });
          });
        } else if (matKey === 'FG_SPOUT_BOX') {
          [-0.48, 0.48].forEach(function (bx) {
            [-0.32, 0, 0.32].forEach(function (bz) {
              const sp = createPouchMesh({
                hasSpout: true,
                spoutColor: 0x10b981,
                width: 0.36,
                height: 0.46,
                depth: 0.075
              });
              sp.position.set(bx, 1.48, bz);
              sp.rotation.z = -0.06;
              grp.add(sp);
            });
          });
        }
      } else if (matKey === 'SPOUT') {
        const spoutMat = new THREE.MeshLambertMaterial({ color: 0x10b981 });
        for (let i = -0.48; i <= 0.48; i += 0.96) {
          const bin = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.78, 1.3), spoutMat);
          bin.position.set(i, 0.66, 0);
          grp.add(bin);
        }
      }
      return grp;
    }

    /* =========================================================================
       GREEN PACKAGING FILM ROLL TEXTURE GENERATOR (Matching Factory Photo)
       ========================================================================= */

    function createRollCuringRackRow(options) {
      options = options || {};
      const baysCount = options.baysCount || 4;
      const tiersCount = options.tiersCount || 4;
      const bayWidth = options.bayWidth || 2.5;
      const depth = options.depth || 1.9;
      const height = options.height || 4.8;
      const uprightColor = options.uprightColor || 0x1d4ed8; // Royal Blue
      const beamColor = options.beamColor || 0xf97316; // Safety Orange
      const cradleColor = options.cradleColor || 0xea580c; // Deep Orange Cradle Arms

      const totalWidth = baysCount * bayWidth;
      const halfW = totalWidth / 2;
      const halfD = depth / 2;

      const rackGroup = new THREE.Group();

      const uprightMat = new THREE.MeshLambertMaterial({ color: uprightColor });
      const beamMat = new THREE.MeshLambertMaterial({ color: beamColor });
      const cradleMat = new THREE.MeshLambertMaterial({ color: cradleColor });
      const braceMat = new THREE.MeshLambertMaterial({ color: 0x60a5fa });
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25 });
      const coreHoleMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
      const labelMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

      // Roll Materials
      const greenRollTex = getGreenPackagingRollTexture();
      const greenRollMat = greenRollTex ? new THREE.MeshStandardMaterial({
        map: greenRollTex,
        roughness: 0.28,
        metalness: 0.12
      }) : new THREE.MeshLambertMaterial({ color: 0x15803d });

      const hygieneRollTex = getHygieneFilmTexture();
      const hygieneRollMat = hygieneRollTex ? new THREE.MeshStandardMaterial({
        map: hygieneRollTex,
        roughness: 0.28,
        metalness: 0.12
      }) : new THREE.MeshLambertMaterial({ color: 0xbe185d });

      const silverFoilMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.88,
        roughness: 0.18
      });
      const purpleRollMat = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        roughness: 0.32,
        metalness: 0.15
      });

      const facePinkMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
      const faceGreenMat = new THREE.MeshLambertMaterial({ color: 0x86efac });
      const faceDarkMat = new THREE.MeshLambertMaterial({ color: 0x334155 });

      // 1. Upright Truss Frames (baysCount + 1 frames)
      for (let f = 0; f <= baysCount; f++) {
        const fx = -halfW + f * bayWidth;

        // Front & Back vertical columns
        [-halfD, halfD].forEach(function (fz) {
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.18, height, 0.18), uprightMat);
          col.position.set(fx, height / 2, fz);
          col.receiveShadow = true;
          rackGroup.add(col);

          // Footplate at base
          const foot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.28), cradleMat);
          foot.position.set(fx, 0.01, fz);
          rackGroup.add(foot);
        });

        // Diagonal truss lacing between front and rear column
        const diagCount = 5;
        for (let dg = 0; dg < diagCount; dg++) {
          const y1 = (dg / diagCount) * height;
          const y2 = ((dg + 1) / diagCount) * height;
          const midY = (y1 + y2) / 2;
          const diagLen = Math.sqrt(depth * depth + ((y2 - y1) * (y2 - y1)));
          const diagBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, diagLen, 0.04), braceMat);
          diagBar.position.set(fx, midY, 0);
          diagBar.rotation.x = Math.atan2(depth, y2 - y1) * (dg % 2 === 0 ? 1 : -1);
          rackGroup.add(diagBar);
        }
      }

      // 2. Horizontal Safety Orange Stringer Beams linking all frames
      [0.15, height - 0.15].forEach(function (yBeam) {
        [-halfD, halfD].forEach(function (fz) {
          const hBeam = new THREE.Mesh(new THREE.BoxGeometry(totalWidth, 0.14, 0.08), beamMat);
          hBeam.position.set(0, yBeam, fz);
          rackGroup.add(hBeam);
        });
      });

      // 3. Tiers & Cantilever Cradle Saddles
      const tierHeights = [];
      const startY = 0.85;
      const stepY = (height - startY - 0.35) / (tiersCount - 1);
      for (let t = 0; t < tiersCount; t++) {
        tierHeights.push(startY + t * stepY);
      }

      // Populate cradle arms and horizontal curing rolls
      for (let b = 0; b < baysCount; b++) {
        const bayCenterX = -halfW + (b + 0.5) * bayWidth;

        tierHeights.forEach(function (yTier, tIdx) {
          const leftColX = -halfW + b * bayWidth;
          const rightColX = -halfW + (b + 1) * bayWidth;

          // Orange Cantilever Cradle Brackets extending into bay from columns
          [leftColX, rightColX].forEach(function (colX, armIdx) {
            const armDir = (armIdx === 0) ? 1 : -1;
            // Horizontal bracket projection
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.12), cradleMat);
            arm.position.set(colX + armDir * 0.175, yTier, 0);
            rackGroup.add(arm);

            // Saddle / U-notch support
            const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.16), cradleMat);
            saddle.position.set(colX + armDir * 0.28, yTier + 0.08, 0);
            rackGroup.add(saddle);
          });

          // 4. Large Suspended Master Film Roll (Populate ~85% of slots)
          // Leave 1-2 slots empty across the rack so the orange cradle mechanism is clearly visible!
          const isSlotEmpty = (b === 1 && tIdx === 3) || (b === 3 && tIdx === 0);
          if (!isSlotEmpty) {
            const rollGroup = new THREE.Group();
            rollGroup.position.set(bayCenterX, yTier + 0.12, 0);

            // Steel central mandrel / shaft resting in the orange saddles
            const shaftLen = bayWidth - 0.08;
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, shaftLen, 14), shaftMat);
            shaft.rotation.z = Math.PI / 2;
            rollGroup.add(shaft);

            // Core chuck collars
            [-0.92, 0.92].forEach(function (cx) {
              const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12), cradleMat);
              chuck.rotation.z = Math.PI / 2;
              chuck.position.x = cx;
              rollGroup.add(chuck);
            });

            // Determine roll body appearance based on bay/tier
            const patternIdx = (b * 3 + tIdx) % 5;
            let rollBodyMat, rollEndMat;
            if (patternIdx === 0 || patternIdx === 3) {
              rollBodyMat = greenRollMat; // Vibrant Green printed roll (Image 2 signature!)
              rollEndMat = faceGreenMat;
            } else if (patternIdx === 1) {
              rollBodyMat = hygieneRollMat; // Hygiene pink printed roll
              rollEndMat = facePinkMat;
            } else if (patternIdx === 2) {
              rollBodyMat = silverFoilMat; // Silver aluminum foil roll
              rollEndMat = faceDarkMat;
            } else {
              rollBodyMat = purpleRollMat; // Violet printed barrier roll
              rollEndMat = facePinkMat;
            }

            const rollRadius = 0.44 + ((b + tIdx) % 3) * 0.04; // 0.44m to 0.52m (realistic ~1m diameter master rolls)
            const rollWidth = 1.68;
            const rollBody = new THREE.Mesh(
              new THREE.CylinderGeometry(rollRadius, rollRadius, rollWidth, 24),
              [rollBodyMat, rollEndMat, rollEndMat]
            );
            rollBody.rotation.z = Math.PI / 2;
            rollGroup.add(rollBody);

            // Core paper hole
            [-rollWidth / 2 - 0.002, rollWidth / 2 + 0.002].forEach(function (hx) {
              const coreHole = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.01, 14), coreHoleMat);
              coreHole.rotation.z = Math.PI / 2;
              coreHole.position.x = hx;
              rollGroup.add(coreHole);
            });

            // White ERP Lot Tracking Barcode Label taped on outer surface (Image 2 signature!)
            const labelMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.005, 0.16), labelMat);
            labelMesh.position.set(0, rollRadius + 0.003, 0);
            rollGroup.add(labelMesh);

            rackGroup.add(rollGroup);
          }
        });
      }

      return rackGroup;
    }


/* =========================================================================
   AUTHENTIC FINISHED GOODS (FG) PALLET BUILDERS (Matching Factory Photo media_1792688947829)
   - Painted Red Industrial Wood Pallets (Standard Starflex FG / Export pallets)
   - Transparent Stretch Film Shrink-Wrap on all pallet loads
   - Type 1: Stacked Corrugated Boxes with Mango Fruit / Starflex Product Labels
   - Type 2: Horizontal Finished Film Rolls lying on Pallet with Wooden Chocks
   - Type 3: Multi-Tier Vertical Slit Roll Columns wrapped in Clear Film
   ========================================================================= */

