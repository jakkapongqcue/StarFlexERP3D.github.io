/* =========================================================================
   StarFlexERP 3D - Materials, Procedural Textures & Pallet Cargo Visuals
   - Industrial Storage Racks (3 tiers, royal blue uprights, safety orange beams)
   - Procedural Canvas Textures (Hygiene Film Roll, Hygiene Stand-up Pouches, Resin Sacks)
   - Visual Cargo Builders (Resin Sacks, Base Film Rolls, Inks, Adhesives, FG Boxes)
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
    let _cachedKraftBoxMat = null;
    let _cachedWhiteTapeMat = null;
    let _cachedDarkInnerMat = null;

    function getKraftBoxMaterial() {
      if (!_cachedKraftBoxMat) {
        _cachedKraftBoxMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
      }
      return _cachedKraftBoxMat;
    }

    function getWhiteTapeMaterial() {
      if (!_cachedWhiteTapeMat) {
        _cachedWhiteTapeMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      }
      return _cachedWhiteTapeMat;
    }

    function getDarkInnerMaterial() {
      if (!_cachedDarkInnerMat) {
        _cachedDarkInnerMat = new THREE.MeshLambertMaterial({ color: 0xa87747 });
      }
      return _cachedDarkInnerMat;
    }

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
    let _cachedHygieneFilmTexture = null;
    function getHygieneFilmTexture() {
      if (_cachedHygieneFilmTexture) return _cachedHygieneFilmTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const uw = 512;
      const h = 512;

      for (let u = 0; u < 2; u++) {
        const ox = u * uw;

        // A. Back Panel: Left 230px (ox to ox + 230) - Deep magenta gradient with watermark
        const gradBack = ctx.createLinearGradient(ox, 0, ox + 230, 0);
        gradBack.addColorStop(0, '#831843');
        gradBack.addColorStop(0.5, '#be185d');
        gradBack.addColorStop(1, '#9d174d');
        ctx.fillStyle = gradBack;
        ctx.fillRect(ox, 0, 230, h);

        // Subtle floral swirl pattern on back panel
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 3;
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          ctx.arc(ox + 60 + c * 40, 100 + (c % 2) * 160, 45, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // White oval logo badge on back panel
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(ox + 115, 68, 55, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#be185d';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ไฮยีน', ox + 115, 66);
        ctx.fillStyle = '#be185d';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('EXPERT CARE', ox + 115, 80);
        ctx.restore();

        // Instructions & Description text lines on back
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ผลิตภัณฑ์ปรับผ้านุ่มสูตรเข้มข้นพิเศษ', ox + 115, 120);

        ctx.font = '8px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'left';
        ctx.fillText('• กลิ่นหอมสดชื่น ยาวนานตลอดวัน', ox + 22, 145);
        ctx.fillText('• ปกป้องสีสันใยผ้าให้นุ่มฟู สดใส', ox + 22, 162);
        ctx.fillText('• ซักได้ทั้งมือและเครื่องฝาหน้า-ฝาบน', ox + 22, 179);
        ctx.fillText('• เป็นมิตรต่อสิ่งแวดล้อม ย่อยสลายได้', ox + 22, 196);
        ctx.restore();

        // Washing machine & Water droplet pictograms
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(ox + 30, 220, 48, 48);
        ctx.fillRect(ox + 90, 220, 48, 48);
        ctx.fillRect(ox + 150, 220, 48, 48);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox + 30, 220, 48, 48);
        ctx.strokeRect(ox + 90, 220, 48, 48);
        ctx.strokeRect(ox + 150, 220, 48, 48);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ซักมือ', ox + 54, 280);
        ctx.fillText('ฝาบน', ox + 114, 280);
        ctx.fillText('ฝาหน้า', ox + 174, 280);
        ctx.restore();

        // Barcode block (White rectangular patch with crisp black barcode)
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + 25, 330, 180, 85);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(ox + 25, 330, 180, 85);

        ctx.fillStyle = '#0f172a';
        const barX = ox + 38;
        const barWidths = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3];
        let curBx = barX;
        for (let b = 0; b < barWidths.length; b++) {
          if (b % 2 === 0) {
            ctx.fillRect(curBx, 342, barWidths[b], 48);
          }
          curBx += barWidths[b] + 1.8;
        }
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('8  850092  124896', ox + 115, 404);
        ctx.restore();

        // Capacity & Manufacturer badge
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ปริมาณสุทธิ 500 มล. (Refill Pouch)', ox + 115, 445);
        ctx.font = '8px sans-serif';
        ctx.fillText('ISO 9001:2015 CERTIFIED FACILITY', ox + 115, 462);
        ctx.restore();

        // B. Gold & White Ribbon Divider between Back & Front Panel
        const gradGold = ctx.createLinearGradient(ox + 226, 0, ox + 242, 0);
        gradGold.addColorStop(0, '#92400e');
        gradGold.addColorStop(0.3, '#f59e0b');
        gradGold.addColorStop(0.7, '#fde68a');
        gradGold.addColorStop(1, '#d97706');
        ctx.fillStyle = gradGold;
        ctx.fillRect(ox + 226, 0, 16, h);

        // C. Front Panel: Right 270px (ox + 242 to ox + 512)
        // Diagonal Sky-Blue / Pastel Cyan to Silky Pearlescent White & Soft Blush Pink
        const gradFront = ctx.createLinearGradient(ox + 242, 0, ox + 512, h);
        gradFront.addColorStop(0, '#0284c7');
        gradFront.addColorStop(0.28, '#38bdf8');
        gradFront.addColorStop(0.55, '#bae6fd');
        gradFront.addColorStop(0.82, '#fdf2f8');
        gradFront.addColorStop(1, '#fbcfe8');
        ctx.fillStyle = gradFront;
        ctx.fillRect(ox + 242, 0, 270, h);

        // Decorative curved wave flair across front panel
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(ox + 242, 140);
        ctx.bezierCurveTo(ox + 320, 180, ox + 420, 110, ox + 512, 190);
        ctx.lineTo(ox + 512, 380);
        ctx.bezierCurveTo(ox + 420, 310, ox + 320, 390, ox + 242, 330);
        ctx.closePath();
        ctx.fill();

        // Magenta flourish swirl at bottom
        ctx.fillStyle = '#be185d';
        ctx.beginPath();
        ctx.moveTo(ox + 242, 390);
        ctx.bezierCurveTo(ox + 340, 430, ox + 440, 370, ox + 512, 440);
        ctx.lineTo(ox + 512, h);
        ctx.lineTo(ox + 242, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Top-Left Brand Oval Logo on Front
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(ox + 300, 52, 46, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 15px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ไฮยีน', ox + 300, 52);
        ctx.restore();

        // Main Brand Logo: "Hygiene" in signature deep navy script
        ctx.save();
        ctx.font = 'bold italic 44px "Georgia", "Times New Roman", serif';
        ctx.textAlign = 'center';

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeText('Hygiene', ox + 382, 115);

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeText('Hygiene', ox + 382, 115);

        ctx.fillStyle = '#172554';
        ctx.fillText('Hygiene', ox + 382, 115);
        ctx.restore();

        // Subtitle banner: "EXPERT CARE"
        ctx.save();
        ctx.fillStyle = '#be185d';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EXPERT CARE', ox + 382, 146);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 11px "Prompt", sans-serif';
        ctx.fillText('สูตรเข้มข้นพิเศษ • มอร์นิ่ง บลูม', ox + 382, 166);
        ctx.restore();

        // Gold Quality Award Emblem / Rosette
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(ox + 458, 205, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('8X', ox + 458, 198);
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('FRESHNESS', ox + 458, 210);
        ctx.fillText('ยาวนาน', ox + 458, 222);
        ctx.restore();

        // Floral Rose Bouquet Illustration at center
        ctx.save();
        // Rose 1 (Center pink)
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(ox + 355, 235, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fda4af';
        ctx.beginPath();
        ctx.arc(ox + 355, 233, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox + 353, 231, 7, 0, Math.PI * 2);
        ctx.fill();

        // Rose 2 (Right magenta)
        ctx.fillStyle = '#db2777';
        ctx.beginPath();
        ctx.arc(ox + 395, 255, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(ox + 395, 253, 12, 0, Math.PI * 2);
        ctx.fill();

        // Rose 3 (Left ruby)
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(ox + 325, 265, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.arc(ox + 325, 263, 10, 0, Math.PI * 2);
        ctx.fill();

        // Green leaves
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.ellipse(ox + 310, 235, 14, 7, Math.PI * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ox + 420, 240, 14, 7, -Math.PI * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ox + 360, 280, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Bottom Refill Badge on Front
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(ox + 310, 445, 145, 34, 17) : ctx.rect(ox + 310, 445, 145, 34);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#be185d';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('REFILL • 500 ml', ox + 382, 466);
        ctx.restore();

        // D. Gravure Web Registration Elements (Margins & Eye-marks)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + 10, 4, 18, 12);
        ctx.fillRect(ox + uw - 28, 4, 18, 12);
        ctx.fillRect(ox + 10, h - 16, 18, 12);
        ctx.fillRect(ox + uw - 28, h - 16, 18, 12);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(ox + 14, 7, 10, 6);
        ctx.fillRect(ox + uw - 24, 7, 10, 6);
        ctx.fillRect(ox + 14, h - 13, 10, 6);
        ctx.fillRect(ox + uw - 24, h - 13, 10, 6);

        // CMYK Color Control Blocks on top edge
        const cmykColors = ['#06b6d4', '#ec4899', '#facc15', '#0f172a'];
        cmykColors.forEach((cc, cIdx) => {
          ctx.fillStyle = cc;
          ctx.fillRect(ox + 180 + cIdx * 14, 5, 10, 8);
        });
      }

      _cachedHygieneFilmTexture = new THREE.CanvasTexture(canvas);
      _cachedHygieneFilmTexture.wrapS = THREE.RepeatWrapping;
      _cachedHygieneFilmTexture.wrapT = THREE.RepeatWrapping;
      _cachedHygieneFilmTexture.repeat.set(2, 1);
      return _cachedHygieneFilmTexture;
    }

    let _cachedHygienePouchTexture = null;
    function getHygienePouchTexture() {
      if (_cachedHygienePouchTexture) return _cachedHygienePouchTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const w = 512;
      const h = 512;

      // Background gradient: Sky-Blue / Pastel Cyan top-left to Silky Pearlescent White & Soft Blush Pink
      const gradFront = ctx.createLinearGradient(0, 0, w, h);
      gradFront.addColorStop(0, '#0284c7');
      gradFront.addColorStop(0.30, '#38bdf8');
      gradFront.addColorStop(0.55, '#bae6fd');
      gradFront.addColorStop(0.80, '#fdf2f8');
      gradFront.addColorStop(1, '#fbcfe8');
      ctx.fillStyle = gradFront;
      ctx.fillRect(0, 0, w, h);

      // Decorative curved white silky wave
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.bezierCurveTo(150, 150, 320, 90, w, 170);
      ctx.lineTo(w, 360);
      ctx.bezierCurveTo(320, 290, 150, 380, 0, 310);
      ctx.closePath();
      ctx.fill();

      // Vibrant Magenta flourish at bottom
      ctx.fillStyle = '#be185d';
      ctx.beginPath();
      ctx.moveTo(0, 370);
      ctx.bezierCurveTo(160, 420, 340, 350, w, 420);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Top-left Oval Logo Badge
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(80, 50, 50, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 16px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ไฮยีน', 80, 50);
      ctx.restore();

      // Main Brand Logo: "Hygiene" in signature deep navy script
      ctx.save();
      ctx.font = 'bold italic 48px "Georgia", "Times New Roman", serif';
      ctx.textAlign = 'center';

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 9;
      ctx.strokeText('Hygiene', w / 2, 116);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.strokeText('Hygiene', w / 2, 116);

      ctx.fillStyle = '#172554';
      ctx.fillText('Hygiene', w / 2, 116);
      ctx.restore();

      // Subtitle banner: "EXPERT CARE"
      ctx.save();
      ctx.fillStyle = '#be185d';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EXPERT CARE', w / 2, 150);

      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 12px "Prompt", sans-serif';
      ctx.fillText('สูตรเข้มข้นพิเศษ • มอร์นิ่ง บลูม', w / 2, 172);
      ctx.restore();

      // Gold Quality Award Emblem / Rosette
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(w - 75, 210, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('8X', w - 75, 202);
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('FRESHNESS', w - 75, 216);
      ctx.fillText('ยาวนาน', w - 75, 228);
      ctx.restore();

      // Floral Rose Bouquet Illustration at center
      ctx.save();
      // Rose 1 (Center pink)
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(220, 245, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(220, 243, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(218, 240, 8, 0, Math.PI * 2);
      ctx.fill();

      // Rose 2 (Right magenta)
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(268, 268, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(268, 266, 14, 0, Math.PI * 2);
      ctx.fill();

      // Rose 3 (Left ruby)
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(185, 278, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(185, 276, 12, 0, Math.PI * 2);
      ctx.fill();

      // Green leaves
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(170, 240, 16, 8, Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(295, 250, 16, 8, -Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(230, 298, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bottom Refill Badge
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(w / 2 - 85, 442, 170, 38, 19) : ctx.rect(w / 2 - 85, 442, 170, 38);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#be185d';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('REFILL • 500 ml', w / 2, 466);
      ctx.restore();

      // Diagonal Glossy Light Reflection Sheen
      ctx.save();
      const sheenGrad = ctx.createLinearGradient(0, 0, w, h);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      sheenGrad.addColorStop(0.38, 'rgba(255, 255, 255, 0.0)');
      sheenGrad.addColorStop(0.46, 'rgba(255, 255, 255, 0.28)');
      sheenGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.0)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      _cachedHygienePouchTexture = new THREE.CanvasTexture(canvas);
      return _cachedHygienePouchTexture;
    }

    let _cachedHygienePouchBackTexture = null;
    function getHygienePouchBackTexture() {
      if (_cachedHygienePouchBackTexture) return _cachedHygienePouchBackTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const w = 512;
      const h = 512;

      // Rich Magenta background
      const gradBack = ctx.createLinearGradient(0, 0, w, 0);
      gradBack.addColorStop(0, '#831843');
      gradBack.addColorStop(0.5, '#be185d');
      gradBack.addColorStop(1, '#9d174d');
      ctx.fillStyle = gradBack;
      ctx.fillRect(0, 0, w, h);

      // White oval logo badge on back
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(w / 2, 55, 60, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 18px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ไฮยีน', w / 2, 53);
      ctx.fillStyle = '#be185d';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('EXPERT CARE', w / 2, 69);
      ctx.restore();

      // Instruction & Feature text
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ผลิตภัณฑ์ปรับผ้านุ่มสูตรเข้มข้นพิเศษ', w / 2, 115);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.textAlign = 'left';
      ctx.fillText('• กลิ่นหอมสดชื่น ยาวนานตลอดวัน ด้วยเทคโนโลยี Life Scent', 45, 145);
      ctx.fillText('• ผ้านุ่มฟู รีดเรียบง่าย ไม่ลีบติดตัว', 45, 168);
      ctx.fillText('• ปกป้องสีสันของผ้าให้คงความสดใสเหมือนใหม่', 45, 191);
      ctx.fillText('• ใช้ได้ทั้งซักมือและซักเครื่องทุกประเภท', 45, 214);
      ctx.restore();

      // Wash icons
      ctx.save();
      [70, 205, 340].forEach((ix, idx) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
        ctx.fillRect(ix, 245, 95, 50);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ix, 245, 95, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        const labels = ['ซักมือ 1/2 ฝา', 'ฝาบน 1 ฝา', 'ฝาหน้า 1 ฝา'];
        ctx.fillText(labels[idx], ix + 47, 275);
      });
      ctx.restore();

      // Barcode box
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(55, 325, 402, 105);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(55, 325, 402, 105);

      ctx.fillStyle = '#0f172a';
      const barWidths = [4, 2, 3, 5, 2, 4, 3, 2, 5, 3, 2, 4, 3, 5, 2, 3, 4, 2, 3, 5, 3, 2, 4, 2, 5, 3, 4, 2, 3, 5, 2, 4, 3, 2, 5, 2, 4];
      let curBx = 85;
      for (let b = 0; b < barWidths.length; b++) {
        if (b % 2 === 0) {
          ctx.fillRect(curBx, 340, barWidths[b], 62);
        }
        curBx += barWidths[b] + 3.2;
      }
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('8  850092  124896', w / 2, 420);
      ctx.restore();

      // Capacity & Certification
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ปริมาณสุทธิ 500 มล.  |  Star Flex Flexible Packaging', w / 2, 465);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillText('ISO 9001:2015 & BRC PACKAGING CERTIFIED', w / 2, 485);
      ctx.restore();

      _cachedHygienePouchBackTexture = new THREE.CanvasTexture(canvas);
      return _cachedHygienePouchBackTexture;
    }

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
    let _cachedResinSackTexture = null;
    function getResinSackTexture() {
      if (_cachedResinSackTexture) return _cachedResinSackTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // 1. Woven Polymer Sack body (clean virgin poly white / subtle pearlescent)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);

      // Fine industrial woven polypropylene crosshatch texture
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }

      // 2. High-visibility Royal Blue brand band across center
      const bandGrad = ctx.createLinearGradient(0, 130, 0, 270);
      bandGrad.addColorStop(0, '#1d4ed8');
      bandGrad.addColorStop(1, '#1e40af');
      ctx.fillStyle = bandGrad;
      ctx.fillRect(24, 130, 464, 140);

      // Sky-blue accent stripe
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(24, 270, 464, 14);

      // Product Grade Heading
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('POLYMER RESIN', 256, 178);

      ctx.font = 'bold 19px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#bae6fd';
      ctx.fillText('VIRGIN PELLETS • BLOWN FILM GRADE', 256, 225);

      // 3. Technical Markings & Specifications
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      ctx.fillText('NET WT. 25.0 KG (55.1 LBS)', 256, 335);

      ctx.fillStyle = '#475569';
      ctx.font = '15px monospace';
      ctx.fillText('LOT: 2026-HDPE-9942A | MFI: 2.1 g/10min', 256, 375);
      ctx.fillText('ISO 9001 / HACCP COMPLIANT • [PE-HD 02]', 256, 405);

      // 4. Seam crepe tape backing and stitch lines at left and right ends
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(10, 10, 18, 492);
      ctx.fillRect(484, 10, 18, 492);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(19, 14);
      ctx.lineTo(19, 498);
      ctx.moveTo(493, 14);
      ctx.lineTo(493, 498);
      ctx.stroke();
      ctx.setLineDash([]);

      _cachedResinSackTexture = new THREE.CanvasTexture(canvas);
      return _cachedResinSackTexture;
    }

    let _cachedResinSackMaterials = null;
    function getResinSackMaterials() {
      if (_cachedResinSackMaterials) return _cachedResinSackMaterials;
      const tex = getResinSackTexture();
      const topMat = new THREE.MeshLambertMaterial({ map: tex });
      const sideMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const btmMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
      const boxMaterials = [sideMat, sideMat, topMat, btmMat, sideMat, sideMat];
      const seamMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const tapeMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });

      _cachedResinSackMaterials = {
        box: boxMaterials,
        side: sideMat,
        seam: seamMat,
        tape: tapeMat
      };
      return _cachedResinSackMaterials;
    }

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
        // 4 Narrow Slit Hygiene Film Rolls (2x2) on pallet
        const slitMat = new THREE.MeshStandardMaterial({
          map: getHygieneFilmTexture(),
          roughness: 0.28,
          metalness: 0.12
        });
        const faceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
        const coreMat = new THREE.MeshLambertMaterial({ color: 0xd97706 }); // Papercore
        const rollWidth = 0.44;
        [-0.50, 0.50].forEach(function (rx) {
          [-0.45, 0.45].forEach(function (rz) {
            const roll = new THREE.Mesh(
              new THREE.CylinderGeometry(0.48, 0.48, rollWidth, 20),
              [slitMat, faceMat, faceMat]
            );
            roll.rotation.z = Math.PI / 2;
            roll.position.set(rx, 0.74, rz);
            grp.add(roll);
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, rollWidth + 0.10, 12), coreMat);
            core.rotation.z = Math.PI / 2;
            core.position.set(rx, 0.74, rz);
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
    let _cachedGreenRollTexture = null;
    function getGreenPackagingRollTexture() {
      if (_cachedGreenRollTexture) return _cachedGreenRollTexture;
      if (typeof document === 'undefined') return null;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Vibrant Emerald Green background (matching factory photo Image 2)
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 512, 256);

      // Deep green wavy graphic background ribbons
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.bezierCurveTo(150, 90, 350, 10, 512, 60);
      ctx.lineTo(512, 160);
      ctx.bezierCurveTo(350, 110, 150, 190, 0, 140);
      ctx.closePath();
      ctx.fill();

      // White graphic panels & brand logos (matching "USA" / green packaging in photo)
      for (let b = 0; b < 3; b++) {
        const bx = 40 + b * 170;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(bx + 45, 95, 38, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#15803d';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('USA', bx + 45, 95);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx + 15, 135, 60, 10);
      }

      // Silver foil edge lines
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, 512, 12);
      ctx.fillRect(0, 244, 512, 12);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      _cachedGreenRollTexture = texture;
      return texture;
    }

    /* =========================================================================
       HIGH-BAY ROLL CURING RACK ROW (Matching Factory Photo Image 2)
       - Blue vertical columns with diagonal truss lacing
       - Safety Orange horizontal stringers & cantilever cradle saddles
       - Multi-tier suspended master rolls on central steel mandrels
       - Variety of authentic film patterns (Green packaging, Hygiene, Silver foil, Violet)
       - White ERP lot tracking barcode labels on rolls
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

let _cachedBoxMangoLabelTexture = null;
function getBoxMangoLabelTexture() {
  if (_cachedBoxMangoLabelTexture) return _cachedBoxMangoLabelTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // White sticker paper
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Top company header
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillText('STARFLEX PACKAGING', 12, 22);

  // Illustrated Ripe Mango fruit on the left (matching photo foreground box)
  ctx.save();
  ctx.translate(46, 75);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 20, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.ellipse(-4, -4, 20, 14, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  // Green leaves
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(-16, -16, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Product Description
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px "Segoe UI", "Prompt", sans-serif';
  ctx.fillText('MANGO POUCH', 95, 48);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Segoe UI", sans-serif';
  ctx.fillText('EXPORT GRADE / REFILL', 95, 66);
  ctx.fillText('QTY: 1,200 PCS', 95, 82);

  // Barcode
  ctx.fillStyle = '#0f172a';
  const barX = 95;
  const barW = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 3, 2, 1, 4];
  let curX = barX;
  for (let i = 0; i < barW.length; i++) {
    if (i % 2 === 0) ctx.fillRect(curX, 92, barW[i], 24);
    curX += barW[i] + 1.5;
  }

  // Red QC PASSED stamp
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.strokeRect(185, 92, 58, 26);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('QC PASS', 190, 108);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedBoxMangoLabelTexture = tex;
  return tex;
}

let _cachedBoxStarflexLabelTexture = null;
function getBoxStarflexLabelTexture() {
  if (_cachedBoxStarflexLabelTexture) return _cachedBoxStarflexLabelTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // White label base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Blue top bar (matching photo background cartons)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, canvas.width, 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillText('STARFLEX CO., LTD.', 14, 24);

  // Content
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillText('HYGIENE POUCH CARTON', 14, 62);

  ctx.fillStyle = '#475569';
  ctx.font = '12px "Consolas", monospace';
  ctx.fillText('LOT: 2026-FG-9418', 14, 82);
  ctx.fillText('BATCH: SF-EXPORT-02', 14, 98);

  // Barcode
  ctx.fillStyle = '#0f172a';
  let curBx = 14;
  const bPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3];
  for (let b = 0; b < bPattern.length; b++) {
    if (b % 2 === 0) ctx.fillRect(curBx, 108, bPattern[b], 22);
    curBx += bPattern[b] + 1.8;
  }

  // QR Code square simulation
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(190, 52, 50, 50);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(195, 57, 40, 40);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(200, 62, 12, 12);
  ctx.fillRect(218, 62, 12, 12);
  ctx.fillRect(200, 80, 12, 12);

  const tex = new THREE.CanvasTexture(canvas);
  _cachedBoxStarflexLabelTexture = tex;
  return tex;
}

let _cachedRedPalletMat = null;
function getRedPalletMaterial() {
  if (!_cachedRedPalletMat) {
    _cachedRedPalletMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c }); // Industrial painted red wood
  }
  return _cachedRedPalletMat;
}

let _cachedStretchWrapMat = null;
function getStretchWrapMaterial() {
  if (!_cachedStretchWrapMat) {
    _cachedStretchWrapMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      roughness: 0.10,
      metalness: 0.05,
      depthWrite: false
    });
  }
  return _cachedStretchWrapMat;
}

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
