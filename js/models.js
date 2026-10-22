function createPalletBaseMesh() {
      const grp = new THREE.Group();
      const woodMat = new THREE.MeshLambertMaterial({ color: 0xc28b52 });
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

    /* Helper: Create Kraft Corrugated Carton Box with White Center Tape (Reference Image) */
    function createKraftRackBox() {
      const boxGrp = new THREE.Group();
      const kraftMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
      const tapeMat  = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

      const box = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.90, 1.35), kraftMat);
      box.position.y = 0.45;
      boxGrp.add(box);

      const tape = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 1.36), tapeMat);
      tape.position.set(0, 0.91, 0);
      boxGrp.add(tape);

      return boxGrp;
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
      const grp = createPalletBaseMesh();
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
        const boxColor = matKey === 'BOX' ? 0xb45309 : (matKey === 'FG_BAG_BOX' ? 0xd97706 : 0x059669);
        const cartonMat = new THREE.MeshLambertMaterial({ color: boxColor });
        const tapeMat = new THREE.MeshLambertMaterial({ color: 0xfef08a });
        for (let y = 0; y < 2; y++) {
          for (let x = -0.48; x <= 0.48; x += 0.96) {
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.58, 1.35), cartonMat);
            box.position.set(x, 0.56 + y * 0.60, 0);
            grp.add(box);
            const tape = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.04, 1.37), tapeMat);
            tape.position.set(x, 0.85 + y * 0.60, 0);
            grp.add(tape);
          }
        }
        if (matKey === 'FG_BAG_BOX') {
          [-0.48, 0.48].forEach(function (bx) {
            [-0.32, 0, 0.32].forEach(function (bz) {
              const p = createPouchMesh({
                hasSpout: false,
                width: 0.36,
                height: 0.46,
                depth: 0.075
              });
              p.position.set(bx, 1.15, bz);
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
              sp.position.set(bx, 1.15, bz);
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

    function createWorkerMesh(vestColor, hatColor) {
      const worker = new THREE.Group();
      const legMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const vestMat = new THREE.MeshLambertMaterial({ color: vestColor || 0xfacc15 });
      const skinMat = new THREE.MeshLambertMaterial({ color: 0xfdba74 });
      const helmetMat = new THREE.MeshLambertMaterial({ color: hatColor || 0xffffff });
      const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
      const stripeMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });

      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.85, 0.34), legMat);
      legs.position.y = 0.42;
      worker.add(legs);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.90, 0.40), vestMat);
      torso.position.y = 1.30;
      worker.add(torso);

      // Silver reflective stripe on safety vest
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.12, 0.41), stripeMat);
      stripe.position.y = 1.25;
      worker.add(stripe);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 12), skinMat);
      head.position.y = 2.02;
      worker.add(head);

      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.33, 0.2, 12), helmetMat);
      hat.position.y = 2.18;
      worker.add(hat);

      // Royal blue long sleeves
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.70, 0.18), sleeveMat);
      leftArm.position.set(-0.42, 1.38, 0.12);
      worker.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.70, 0.18), sleeveMat);
      rightArm.position.set(0.42, 1.38, 0.12);
      worker.add(rightArm);

      worker.userData.leftArm = leftArm;
      worker.userData.rightArm = rightArm;
      return worker;
    }

    function createBlueControlKioskMesh() {
      const kiosk = new THREE.Group();
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
      const screenMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.3, 0.95), bodyMat);
      box.position.y = 1.15;
      kiosk.add(box);
      const scr = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.55, 0.06), screenMat);
      scr.position.set(0, 1.65, 0.48);
      kiosk.add(scr);
      return kiosk;
    }

    /* Helper: Create a realistic Unwinder / Rewinder Film Roll with core, chuck spokes, and surface stripes
       Oriented horizontally (rotation.x = Math.PI / 2) so rotating .rotation.y spins the roll around its Z axle! */
    function createActiveFilmRollAssembly(radius, width, filmColorHex, stripeColorHex, coreColorHex, customTexture, endColorHex) {
      const rollAssembly = new THREE.Group();
      rollAssembly.rotation.x = Math.PI / 2;

      let bodyMat;
      if (customTexture) {
        const sideMat = new THREE.MeshStandardMaterial({
          map: customTexture,
          roughness: 0.28,
          metalness: 0.12
        });
        const faceMat = new THREE.MeshLambertMaterial({ color: endColorHex || 0xfbcfe8 });
        bodyMat = [sideMat, faceMat, faceMat];
      } else {
        bodyMat = new THREE.MeshLambertMaterial({ color: filmColorHex });
      }

      const stripeMat = new THREE.MeshLambertMaterial({ color: stripeColorHex || 0xfacc15 });
      const coreMat = new THREE.MeshLambertMaterial({ color: coreColorHex || 0x1e293b });
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.3 });

      // Main cylindrical film roll body
      const rollBody = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 24), bodyMat);
      rollAssembly.add(rollBody);

      // Extended steel core shaft
      const coreShaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.30, radius * 0.30, width + 0.36, 16), coreMat);
      rollAssembly.add(coreShaft);

      // 4 longitudinal surface indicator bars so rotation is clearly visible from any camera angle
      if (!customTexture) {
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, width - 0.06, 0.06), stripeMat);
          bar.position.set(Math.cos(angle) * (radius + 0.015), 0, Math.sin(angle) * (radius + 0.015));
          bar.rotation.y = -angle;
          rollAssembly.add(bar);
        }
      }

      // Radial chuck spokes on both end faces of the roll
      [-width / 2 - 0.03, width / 2 + 0.03].forEach(function (yEnd) {
        const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.75, 0.04, 0.14), hubMat);
        spoke1.position.y = yEnd;
        rollAssembly.add(spoke1);

        const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, radius * 1.75), stripeMat);
        spoke2.position.y = yEnd;
        rollAssembly.add(spoke2);
      });

      return { group: rollAssembly, bodyMesh: rollBody, bodyMat: bodyMat, stripeMat: stripeMat };
    }

    /* Helper: Create a tense running film web span connecting two (x, y) points across the machine width */
    function createFilmWebSpan(x1, y1, x2, y2, zCenter, webWidth, colorHex, opacityVal) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const webMat = new THREE.MeshLambertMaterial({
        color: colorHex,
        transparent: opacityVal !== undefined && opacityVal < 1.0,
        opacity: opacityVal !== undefined ? opacityVal : 0.88
      });
      const webMesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, webWidth), webMat);
      webMesh.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, zCenter);
      webMesh.rotation.z = angle;
      return webMesh;
    }

    /* Helper: Create dual side support stands for an Unwinder or Rewinder station */
    function createWinderStandPair(xPos, zCenter, height, rollWidth, standMat) {
      const grp = new THREE.Group();
      const halfSpan = rollWidth / 2 + 0.16;
      [zCenter - halfSpan, zCenter + halfSpan].forEach(function (zArm) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, height, 0.24), standMat);
        post.position.set(xPos, 0.35 + height / 2, zArm);
        grp.add(post);

        const bearingCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.28, 12),
          new THREE.MeshLambertMaterial({ color: 0xf59e0b })
        );
        bearingCap.rotation.x = Math.PI / 2;
        bearingCap.position.set(xPos, 0.35 + height - 0.18, zArm);
        grp.add(bearingCap);
      });
      return grp;
    }

    /* Bespoke Industrial Machine Models with ZERO overlapping workers/objects */
    function buildRealisticStationMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
      const mGroup = new THREE.Group();
      const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const slateMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.25 });
      const redRailMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
      const blueAccentMat = new THREE.MeshLambertMaterial({ color: 0x1e40af });
      const filmBubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.60, roughness: 0.22, metalness: 0.05 });
      const printedWebMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });

      function tagSelectable(mesh) {
        mesh.userData.selectKey = st.id;
        sceneObjects.selectableMeshes.push(mesh);
        return mesh;
      }

      if (st.id === 'ST_BLOWN') {
        /* Multi-Layer Industrial Blown Film Extrusion Line (Matching User Reference Image)
           - Right (+X): 3 Parallel Co-Extruders with Blue heater jackets + Gravimetric Dosing Feeder Towers (4 cylinders each) + Motors
           - Resin Sacks: 3 Horizontal Resin Bags stacked neatly near the extruder hoppers (createSingleResinSack)
           - Center: Circular Die Pedestal + Aerodynamic Air Ring + Lower Stabilizing Cage + Mid Calibration Basket + Translucent White Tubular Film Bubble
           - Top Tower: Haul-off Mezzanine Platform + Slat Collapsing Boards (A-Frame) + Top Driven Nip Rollers
           - Descending Path: Vertical Zig-Zag Dancer Web Guide with Idler Rollers bridging to winder
           - Left (-X): Dual Turret Surface Winder with signature White & Royal Blue cabinet housings + Pure White Output Roll */

        const whiteBubbleMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.60,
          roughness: 0.22,
          metalness: 0.05
        });
        const whiteWebMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.32,
          metalness: 0.05,
          side: THREE.DoubleSide
        });

        // 1. Tower Structure (4 Vertical Columns & Mezzanine Deck)
        const colPositions = [[-1.3, -2.1], [2.3, -2.1], [-1.3, 1.3], [2.3, 1.3]];
        colPositions.forEach(function (p) {
          const col = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.24, 9.6, 0.24), whiteSteel));
          col.position.set(p[0], 4.8, p[1]);
          mGroup.add(col);
        });

        // Top Mezzanine Haul-Off Platform Deck (y = 8.8)
        const topDeck = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 3.6), whiteSteel));
        topDeck.position.set(0.5, 8.8, -0.4);
        mGroup.add(topDeck);

        // Top Deck Safety Handrails (Royal Blue)
        const frontRail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.9, 0.08), blueAccentMat);
        frontRail.position.set(0.5, 9.35, 1.36);
        mGroup.add(frontRail);
        const backRail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.9, 0.08), blueAccentMat);
        backRail.position.set(0.5, 9.35, -2.16);
        mGroup.add(backRail);
        const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 3.6), blueAccentMat);
        rightRail.position.set(2.36, 9.35, -0.4);
        mGroup.add(rightRail);

        // 2. Extrusion Die Head & Aerodynamic Air Ring (Center Base x = 0.5, z = -0.4)
        const diePedestal = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.55, 20), slateMat));
        diePedestal.position.set(0.5, 0.35, -0.4);
        mGroup.add(diePedestal);

        const dieHead = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.65, 20), darkSteel);
        dieHead.position.set(0.5, 0.85, -0.4);
        mGroup.add(dieHead);

        // High-Efficiency Dual-Lip Air Ring (Cooling Ring in Royal Blue with silver air lip)
        const airRingBody = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.25, 0.42, 24), blueAccentMat));
        airRingBody.position.set(0.5, 1.25, -0.4);
        mGroup.add(airRingBody);

        const airRingLip = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.20, 0.12, 24), chromeMat);
        airRingLip.position.set(0.5, 1.48, -0.4);
        mGroup.add(airRingLip);

        // 4 Circular Air Distribution Blower Inlets
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2 + Math.PI / 4;
          const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 12), chromeMat);
          inlet.rotation.z = Math.PI / 2;
          inlet.rotation.y = ang;
          inlet.position.set(0.5 + Math.cos(ang) * 1.35, 1.25, -0.4 + Math.sin(ang) * 1.35);
          mGroup.add(inlet);
        }

        // 3. Lower Stabilization Cage & Spiral Helix (Above Air Ring y = 1.6 to 3.8)
        [1.85, 2.75, 3.65].forEach(function (yRing) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.05, 8, 20), blueAccentMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.set(0.5, yRing, -0.4);
          mGroup.add(ring);
        });

        for (let r = 0; r < 8; r++) {
          const rAng = (r * Math.PI) / 4;
          const vRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.9, 10), chromeMat);
          vRoller.position.set(0.5 + Math.cos(rAng) * 1.08, 2.75, -0.4 + Math.sin(rAng) * 1.08);
          mGroup.add(vRoller);
        }

        const spiralHelix = new THREE.Mesh(new THREE.CylinderGeometry(1.10, 1.10, 1.8, 16, 1, true), new THREE.MeshLambertMaterial({
          color: 0x1e40af,
          wireframe: true,
          wireframeLinewidth: 2
        }));
        spiralHelix.position.set(0.5, 2.75, -0.4);
        mGroup.add(spiralHelix);

        // 4. Mid-Level Motorized Calibration Basket (IBC Sizing Cage y = 4.4 to 6.2)
        const calibFrame1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 2.5), whiteSteel);
        calibFrame1.position.set(0.5, 4.6, -0.4);
        mGroup.add(calibFrame1);

        const calibFrame2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 2.5), whiteSteel);
        calibFrame2.position.set(0.5, 5.8, -0.4);
        mGroup.add(calibFrame2);

        for (let arm = 0; arm < 8; arm++) {
          const aAng = (arm * Math.PI) / 4;
          const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.08), blueAccentMat);
          armMesh.position.set(0.5 + Math.cos(aAng) * 1.05, 5.2, -0.4 + Math.sin(aAng) * 1.05);
          armMesh.rotation.y = -aAng;
          mGroup.add(armMesh);

          const cRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 10), chromeMat);
          cRoller.position.set(0.5 + Math.cos(aAng) * 0.88, 5.2, -0.4 + Math.sin(aAng) * 0.88);
          mGroup.add(cRoller);
        }

        // Ultrasonic Thickness Gauge Track Ring
        const gaugeTrack = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.06, 8, 24), blueAccentMat);
        gaugeTrack.rotation.x = Math.PI / 2;
        gaugeTrack.position.set(0.5, 6.4, -0.4);
        mGroup.add(gaugeTrack);

        const sensorHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.32), darkSteel);
        sensorHead.position.set(0.5 + 1.22, 6.4, -0.4);
        mGroup.add(sensorHead);

        // 5. Translucent White Tubular Film Bubble (USER REQUIREMENT: White Only)
        const bubbleMesh = tagSelectable(new THREE.Mesh(
          new THREE.CylinderGeometry(0.88, 0.94, 7.3, 24, 1, true),
          whiteBubbleMat
        ));
        bubbleMesh.position.set(0.5, 5.15, -0.4);
        mGroup.add(bubbleMesh);
        rollersOut.push(bubbleMesh);

        // 6. Top Haul-off Unit: A-Frame Collapsing Boards & Nip Rollers (y = 7.3 to 9.4)
        const slatMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
        const boardLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 1.8), whiteSteel);
        boardLeft.position.set(0.05, 7.95, -0.4);
        boardLeft.rotation.z = -0.32;
        mGroup.add(boardLeft);

        const boardRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 1.8), whiteSteel);
        boardRight.position.set(0.95, 7.95, -0.4);
        boardRight.rotation.z = 0.32;
        mGroup.add(boardRight);

        for (let s = -0.65; s <= 0.65; s += 0.28) {
          const slatL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.7), slatMat);
          slatL.position.set(0.12, 7.95 + s, -0.4);
          slatL.rotation.z = -0.32;
          mGroup.add(slatL);

          const slatR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.7), slatMat);
          slatR.position.set(0.88, 7.95 + s, -0.4);
          slatR.rotation.z = 0.32;
          mGroup.add(slatR);
        }

        // Top Haul-off Driven Nip Rollers
        const nip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 14), chromeMat);
        nip1.rotation.x = Math.PI / 2;
        nip1.position.set(0.38, 9.15, -0.4);
        mGroup.add(nip1);
        rollersOut.push(nip1);

        const nip2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 14), darkSteel);
        nip2.rotation.x = Math.PI / 2;
        nip2.position.set(0.62, 9.15, -0.4);
        mGroup.add(nip2);
        rollersOut.push(nip2);

        const haulOffMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 12), blueAccentMat);
        haulOffMotor.position.set(0.5, 9.75, 0.85);
        mGroup.add(haulOffMotor);

        // 7. Descending Vertical Zig-Zag Dancer Web Path (Matching Reference Image)
        const topWebBridge = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.95), whiteWebMat);
        topWebBridge.rotation.x = Math.PI / 2;
        topWebBridge.position.set(-0.65, 9.25, -0.4);
        mGroup.add(topWebBridge);

        [-1.6, -2.4].forEach(function (lx) {
          const upright = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.8, 0.16), whiteSteel);
          upright.position.set(lx, 5.8, -1.45);
          mGroup.add(upright);
          const uprightFront = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.8, 0.16), whiteSteel);
          uprightFront.position.set(lx, 5.8, 0.65);
          mGroup.add(uprightFront);
        });

        const zigZagLevels = [8.2, 7.0, 5.8, 4.6, 3.4];
        const zigZagXs = [-1.75, -2.25, -1.75, -2.25, -1.75];

        for (let z = 0; z < zigZagLevels.length; z++) {
          const zzRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.0, 12), chromeMat);
          zzRoller.rotation.x = Math.PI / 2;
          zzRoller.position.set(zigZagXs[z], zigZagLevels[z], -0.4);
          mGroup.add(zzRoller);
          rollersOut.push(zzRoller);
        }

        const webSeg1 = createFilmWebSpan(-0.65, 9.25, -1.75, 8.2, -0.4, 1.9, 0xffffff, 0.95);
        const webSeg2 = createFilmWebSpan(-1.75, 8.2, -2.25, 7.0, -0.4, 1.9, 0xffffff, 0.95);
        const webSeg3 = createFilmWebSpan(-2.25, 7.0, -1.75, 5.8, -0.4, 1.9, 0xffffff, 0.95);
        const webSeg4 = createFilmWebSpan(-1.75, 5.8, -2.25, 4.6, -0.4, 1.9, 0xffffff, 0.95);
        const webSeg5 = createFilmWebSpan(-2.25, 4.6, -1.75, 3.4, -0.4, 1.9, 0xffffff, 0.95);
        const webSeg6 = createFilmWebSpan(-1.75, 3.4, -3.2, 1.75, -0.4, 1.9, 0xffffff, 0.95);
        mGroup.add(webSeg1);
        mGroup.add(webSeg2);
        mGroup.add(webSeg3);
        mGroup.add(webSeg4);
        mGroup.add(webSeg5);
        mGroup.add(webSeg6);

        const dancerBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 2.2), slateMat);
        dancerBox.position.set(-2.0, 2.2, -0.4);
        mGroup.add(dancerBox);

        // 8. Dual Turret Surface Winder Station (Left Side x = -3.8, z = -0.4)
        [-1.5, 0.7].forEach(function (wz) {
          const sideCab = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.32), whiteSteel));
          sideCab.position.set(-3.8, 1.3, wz);
          mGroup.add(sideCab);

          const blueAccent = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.62, 0.34), blueAccentMat);
          blueAccent.position.set(-2.65, 1.3, wz);
          mGroup.add(blueAccent);

          const blueAccentBack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.62, 0.34), blueAccentMat);
          blueAccentBack.position.set(-4.95, 1.3, wz);
          mGroup.add(blueAccentBack);
        });

        const winderBed = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.32, 2.4), slateMat));
        winderBed.position.set(-3.8, 0.16, -0.4);
        mGroup.add(winderBed);

        const hmiConsole = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.12), darkSteel);
        hmiConsole.position.set(-2.55, 1.6, 0.88);
        mGroup.add(hmiConsole);
        const hmiScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.48), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
        hmiScreen.position.set(-2.55, 1.6, 0.95);
        mGroup.add(hmiScreen);

        const layOnRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 14), darkSteel);
        layOnRoller.rotation.x = Math.PI / 2;
        layOnRoller.position.set(-2.95, 1.45, -0.4);
        mGroup.add(layOnRoller);
        rollersOut.push(layOnRoller);

        const standbyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.15, 12), chromeMat);
        standbyShaft.rotation.x = Math.PI / 2;
        standbyShaft.position.set(-4.5, 2.1, -0.4);
        mGroup.add(standbyShaft);
        rollersOut.push(standbyShaft);

        // Active Wound Blown Film Roll (USER REQUIREMENT: Pure White Only!)
        const woundRoll = createActiveFilmRollAssembly(0.72, 1.95, 0xffffff, 0xf1f5f9, 0x1e293b);
        tagSelectable(woundRoll.bodyMesh);
        woundRoll.group.position.set(-3.8, 1.35, -0.4);
        mGroup.add(woundRoll.group);
        rollersOut.push(woundRoll.group);

        // 9. Co-Extrusion System: 3 Parallel Extruders & Dosing Feeder Towers (Right Side)
        const extBaseBed = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 3.2), slateMat));
        extBaseBed.position.set(3.7, 0.14, -0.4);
        mGroup.add(extBaseBed);

        const barrelZs = [-1.45, -0.4, 0.65];
        barrelZs.forEach(function (bz) {
          const barrel = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.6, 16), blueAccentMat));
          barrel.rotation.z = Math.PI / 2;
          barrel.position.set(3.2, 0.72, bz);
          mGroup.add(barrel);

          for (let hb = 2.2; hb <= 4.2; hb += 0.5) {
            const hRing = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.08, 14), chromeMat);
            hRing.rotation.z = Math.PI / 2;
            hRing.position.set(hb, 0.72, bz);
            mGroup.add(hRing);
          }

          const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.85, 0.55), darkSteel);
          gearbox.position.set(4.8, 0.75, bz);
          mGroup.add(gearbox);

          const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.75, 14), charcoalMat);
          motor.rotation.z = Math.PI / 2;
          motor.position.set(5.5, 0.75, bz);
          mGroup.add(motor);
          rollersOut.push(motor);

          const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.35, 12), blueAccentMat);
          throat.position.set(3.8, 1.05, bz);
          mGroup.add(throat);

          const mainBlender = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.65, 14), chromeMat);
          mainBlender.position.set(3.8, 1.55, bz);
          mGroup.add(mainBlender);

          const feederOffsets = [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]];
          feederOffsets.forEach(function (fo) {
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.85, 10), chromeMat);
            tube.position.set(3.8 + fo[0], 2.3, bz + fo[1]);
            mGroup.add(tube);
            const tubeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 10), blueAccentMat);
            tubeCap.position.set(3.8 + fo[0], 2.76, bz + fo[1]);
            mGroup.add(tubeCap);
          });

          const meltPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 12), chromeMat);
          meltPipe.rotation.z = Math.PI / 2;
          const pipeZMid = (bz + -0.4) / 2;
          meltPipe.position.set(1.3, 0.78, pipeZMid);
          meltPipe.rotation.y = Math.atan2(-0.4 - bz, 0.5 - 1.9);
          mGroup.add(meltPipe);
        });

        // 10. 3 Horizontal Resin Bags Stacked (USER REQUIREMENT: "ต้องมีถุง resin กองอยู่3ถุง")
        const sackStackGroup = new THREE.Group();
        sackStackGroup.position.set(3.8, 0.0, 1.9);

        const sack1 = createSingleResinSack(1.05, 0.60, 0.20);
        sack1.position.set(-0.55, 0.0, 0.0);
        sack1.rotation.y = 0.05;
        sackStackGroup.add(sack1);

        const sack2 = createSingleResinSack(1.05, 0.60, 0.20);
        sack2.position.set(0.55, 0.0, 0.08);
        sack2.rotation.y = -0.06;
        sackStackGroup.add(sack2);

        const sack3 = createSingleResinSack(1.05, 0.60, 0.20);
        sack3.position.set(0.02, 0.20, 0.04);
        sack3.rotation.y = 0.02;
        sackStackGroup.add(sack3);

        mGroup.add(sackStackGroup);

      } else if (st.id === 'ST_INK') {
        /* High-Detail Industrial Ink & Paint Mixing Plant (สถานีผสมหมึกพิมพ์และถังผสมสีอุตสาหกรรม)
           - Heavy steel catwalk platform with safety yellow toe-boards, handrails and side access stairs
           - 3 Large Mixing Tanks with dish bottoms, vibrant CMY ink bodies, stainless chime rings, sight glasses & drain valves
           - Top Agitator Bridges with electric gearmotors and spinning high-shear mixing impellers (rollersOut)
           - Swirling liquid ink pools inside the top open ports of each tank
           - Overhead solvent & resin manifold piping with supply valves dipping into each tank
           - 2 Standard 200L Ribbed Steel Paint Drums (ถังสี 200 ลิตร) with rolling chimes, clamp lids, bung plugs & hazard labels
           - 2 Small 20L Paint Pails (ถังสีหิ้ว 20 ลิตร) with wire handles and color lids
           - Air-operated double diaphragm pump (ปั๊มไดอะแฟรมดูดสี) with flexible suction hose dipping into a drum
           - Digital viscosity & color formulation kiosk with Zahn viscosity cup hook */

        const yellowSafetyMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
        const pipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65, roughness: 0.1, metalness: 0.1 });

        // 1. Heavy Structural Base Platform & Catwalk
        const baseFrame = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.35, 3.8), darkSteel));
        baseFrame.position.set(0, 0.18, 0.2);
        mGroup.add(baseFrame);

        const gratingDeck = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.06, 3.9), charcoalMat));
        gratingDeck.position.set(0, 0.38, 0.2);
        mGroup.add(gratingDeck);

        // Yellow Safety Toe-boards around platform edge
        [
          { size: [7.7, 0.10, 0.04], pos: [0, 0.44, 2.13] },
          { size: [0.04, 0.10, 3.9], pos: [-3.83, 0.44, 0.2] },
          { size: [0.04, 0.10, 3.9], pos: [3.83, 0.44, 0.2] }
        ].forEach(function (tb) {
          const toeBoard = new THREE.Mesh(new THREE.BoxGeometry(tb.size[0], tb.size[1], tb.size[2]), yellowSafetyMat);
          toeBoard.position.set(tb.pos[0], tb.pos[1], tb.pos[2]);
          mGroup.add(toeBoard);
        });

        // Safety Handrails along back and sides (Yellow)
        const railPosts = [
          [-3.8, 2.1], [-1.9, 2.1], [0, 2.1], [1.9, 2.1], [3.8, 2.1],
          [-3.8, 0.8], [-3.8, -0.5], [3.8, 0.8], [3.8, -0.5]
        ];
        railPosts.forEach(function (rp) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.06), yellowSafetyMat);
          post.position.set(rp[0], 0.90, rp[1]);
          mGroup.add(post);
        });

        // Top and mid rails (Back)
        const backTopRail = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.05, 0.05), yellowSafetyMat);
        backTopRail.position.set(0, 1.40, 2.1);
        mGroup.add(backTopRail);

        const backMidRail = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.04, 0.04), yellowSafetyMat);
        backMidRail.position.set(0, 0.90, 2.1);
        mGroup.add(backMidRail);

        // Side rails (Left & Right)
        [-3.8, 3.8].forEach(function (sx) {
          const sideTop = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.6), yellowSafetyMat);
          sideTop.position.set(sx, 1.40, 0.8);
          mGroup.add(sideTop);

          const sideMid = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 2.6), yellowSafetyMat);
          sideMid.position.set(sx, 0.90, 0.8);
          mGroup.add(sideMid);
        });

        // Side Access Steps on Left
        for (let stp = 0; stp < 3; stp++) {
          const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.30), charcoalMat);
          stepMesh.position.set(-4.15, 0.10 + stp * 0.10, -0.8 + stp * 0.32);
          mGroup.add(stepMesh);
        }

        // 2. 3 Large Paint / Ink Mixing Tanks (Magenta, Cyan, Yellow)
        const tankDefs = [
          {
            x: -1.9,
            name: 'Process Magenta',
            bodyColor: 0xdb2777,
            liquidColor: 0xbe185d,
            label: 'INK-M'
          },
          {
            x: 0.0,
            name: 'Process Cyan',
            bodyColor: 0x0284c7,
            liquidColor: 0x0369a1,
            label: 'INK-C'
          },
          {
            x: 1.9,
            name: 'Process Yellow',
            bodyColor: 0xeab308,
            liquidColor: 0xca8a04,
            label: 'INK-Y'
          }
        ];

        tankDefs.forEach(function (tDef) {
          const tx = tDef.x;
          const bodyMat = new THREE.MeshStandardMaterial({
            color: tDef.bodyColor,
            roughness: 0.32,
            metalness: 0.20
          });
          const liquidMat = new THREE.MeshStandardMaterial({
            color: tDef.liquidColor,
            roughness: 0.15,
            metalness: 0.25
          });

          // Tank Stainless Support Legs (3 legs in triangle arrangement)
          [[-0.65, -0.4], [0.65, -0.4], [0, 0.65]].forEach(function (lp) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.90, 10), chromeMat);
            leg.position.set(tx + lp[0], 0.83, -0.2 + lp[1]);
            mGroup.add(leg);

            const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 12), darkSteel);
            foot.position.set(tx + lp[0], 0.40, -0.2 + lp[1]);
            mGroup.add(foot);
          });

          // Conical Dish Bottom (ก้นถังกรวยปล่อยสี)
          const coneBottom = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.24, 0.45, 20), chromeMat));
          coneBottom.position.set(tx, 0.85, -0.2);
          mGroup.add(coneBottom);

          // Bottom Discharge Spout & Brass Ball Valve (วาล์วจ่ายสีด้านล่าง)
          const drainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.32, 12), chromeMat);
          drainPipe.position.set(tx, 0.52, -0.2);
          mGroup.add(drainPipe);

          const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), brassMat);
          valveBody.position.set(tx, 0.48, -0.2);
          mGroup.add(valveBody);

          const valveLever = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.22), redRailMat);
          valveLever.position.set(tx + 0.08, 0.54, -0.2);
          valveLever.rotation.x = 0.4;
          mGroup.add(valveLever);

          // Main Cylindrical Paint Tank Body (ตัวถังสีทรงกระบอกขนาดใหญ่)
          const tankBody = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.70, 24), bodyMat));
          tankBody.position.set(tx, 1.90, -0.2);
          mGroup.add(tankBody);

          // Stainless Steel Reinforcement Chime Rings (สันลอนรัดถังสแตนเลส 3 ชั้น)
          [1.10, 1.90, 2.70].forEach(function (ry) {
            const chime = new THREE.Mesh(new THREE.CylinderGeometry(0.875, 0.875, 0.07, 24), chromeMat);
            chime.position.set(tx, ry, -0.2);
            mGroup.add(chime);
          });

          // Top Flange Collar (ขอบปากถัง)
          const topCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.89, 0.89, 0.12, 24), chromeMat);
          topCollar.position.set(tx, 2.76, -0.2);
          mGroup.add(topCollar);

          // Visible Swirling Paint / Liquid Ink Pool Inside Open Tank Top (ผิวของเหลวสีหมึกสะท้อนแสง)
          const inkSurface = new THREE.Mesh(new THREE.CylinderGeometry(0.77, 0.77, 0.04, 20), liquidMat);
          inkSurface.position.set(tx, 2.68, -0.2);
          mGroup.add(inkSurface);

          // Front Sight Glass Tube (หลอดแก้วบอกระดับสีด้านหน้าถัง)
          const sightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.25, 10), glassMat);
          sightGlass.position.set(tx, 1.90, -1.08);
          mGroup.add(sightGlass);

          const sightInkColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.90, 8), liquidMat);
          sightInkColumn.position.set(tx, 1.72, -1.08);
          mGroup.add(sightInkColumn);

          [-0.60, 0.60].forEach(function (fy) {
            const fitting = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.10), brassMat);
            fitting.position.set(tx, 1.90 + fy, -1.07);
            mGroup.add(fitting);
          });

          // Top Agitator Cross-Bridge (คานยึดมอเตอร์กวนสี)
          const bridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.12, 0.32), darkSteel);
          bridgeBeam.position.set(tx, 2.82, -0.2);
          mGroup.add(bridgeBeam);

          // Heavy Electric Gearmotor on Top of Tank (มอเตอร์และชุดเกียร์กวนสี)
          const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.40), blueAccentMat);
          gearbox.position.set(tx, 3.04, -0.2);
          mGroup.add(gearbox);

          const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.60, 16), blueAccentMat);
          motorBody.position.set(tx, 3.50, -0.2);
          mGroup.add(motorBody);

          // Cooling Fins on Motor
          for (let f = -0.20; f <= 0.20; f += 0.08) {
            const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.02, 16), darkSteel);
            fin.position.set(tx, 3.50 + f, -0.2);
            mGroup.add(fin);
          }

          const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16), darkSteel);
          motorCap.position.set(tx, 3.84, -0.2);
          mGroup.add(motorCap);

          // Dynamic Spinning Agitator Shaft & Impeller Blades (แกนกวนและใบพัดกวนสี)
          const agitatorAssembly = new THREE.Group();
          agitatorAssembly.position.set(tx, 1.90, -0.2);

          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.85, 12), chromeMat);
          shaft.position.y = 0.0;
          agitatorAssembly.add(shaft);

          // Bottom High-Shear Dissolver Disc (ใบพัดกวนสีแบบฟันเลื่อย Cowles Blade)
          const dissolverDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.025, 16), chromeMat);
          dissolverDisc.position.y = -0.65;
          agitatorAssembly.add(dissolverDisc);

          // Radiating blade teeth
          for (let t = 0; t < 6; t++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.06), darkSteel);
            const ang = (t / 6) * Math.PI * 2;
            tooth.position.set(Math.cos(ang) * 0.40, -0.64, Math.sin(ang) * 0.40);
            tooth.rotation.y = -ang;
            agitatorAssembly.add(tooth);
          }

          // Mid-Level Axial Turbine Impeller (ใบพัดดันสีช่วงกลาง)
          for (let b = 0; b < 3; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.03), chromeMat);
            const bAng = (b / 3) * Math.PI * 2;
            blade.position.set(Math.cos(bAng) * 0.18, 0.10, Math.sin(bAng) * 0.18);
            blade.rotation.y = -bAng;
            blade.rotation.z = 0.45;
            agitatorAssembly.add(blade);
          }

          mGroup.add(agitatorAssembly);
          rollersOut.push(agitatorAssembly);
        });

        // 3. 200L Industrial Steel Paint Drums on Staging Deck (ถังสีแม่สี 200 ลิตร)
        function createDetailed200LPaintDrum(drumColor, labelText) {
          const drum = new THREE.Group();
          const dMat = new THREE.MeshStandardMaterial({ color: drumColor, roughness: 0.35, metalness: 0.25 });
          const lMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

          // Drum Cylinder Body
          const dBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.05, 18), dMat);
          dBody.position.y = 0.525;
          drum.add(dBody);

          // 2 Rolled Expansion Chime Ridges (ลอนขยายมาตรฐานถัง 200 ลิตร)
          [0.35, 0.70].forEach(function (chY) {
            const chime = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.04, 18), dMat);
            chime.position.y = chY;
            drum.add(chime);
          });

          // Top and Bottom Chime Rims
          [0.02, 1.03].forEach(function (rmY) {
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.04, 18), darkSteel);
            rim.position.y = rmY;
            drum.add(rim);
          });

          // Top Lid with Clamp Ring
          const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.03, 18), dMat);
          lid.position.y = 1.05;
          drum.add(lid);

          const clampRing = new THREE.Mesh(new THREE.CylinderGeometry(0.338, 0.338, 0.025, 18), chromeMat);
          clampRing.position.y = 1.055;
          drum.add(clampRing);

          // Bung Plugs (2" and 3/4" plugs)
          const bung1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 10), darkSteel);
          bung1.position.set(0.16, 1.07, 0.08);
          drum.add(bung1);

          const bung2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 8), darkSteel);
          bung2.position.set(-0.16, 1.07, -0.06);
          drum.add(bung2);

          // White Chemical Label
          const label = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.40, 18, 1, true, 0, Math.PI * 0.75), lMat);
          label.position.y = 0.525;
          label.rotation.y = Math.PI * 0.9;
          drum.add(label);

          return drum;
        }

        // Drum 1: Base Pigment Concentrate Drum (Navy Blue)
        const baseInkDrum = createDetailed200LPaintDrum(0x1e3a8a, 'BASE PIGMENT');
        baseInkDrum.position.set(-3.1, 0.41, 1.0);
        mGroup.add(baseInkDrum);

        // Drum 2: Solvent / Thinner Drum (Safety Red)
        const solventDrum = createDetailed200LPaintDrum(0xbe123c, 'SOLVENT');
        solventDrum.position.set(-3.1, 0.41, -0.2);
        mGroup.add(solventDrum);

        // 4. Air-Operated Double Diaphragm Pump (ปั๊มไดอะแฟรมสูบสี)
        const pumpGroup = new THREE.Group();
        pumpGroup.position.set(-3.1, 0.41, 0.40);

        const pumpStand = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.25), darkSteel);
        pumpStand.position.y = 0.125;
        pumpGroup.add(pumpStand);

        // Dual Diaphragm Chambers
        [-0.14, 0.14].forEach(function (cx) {
          const chamber = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), slateMat);
          chamber.position.set(cx, 0.35, 0);
          pumpGroup.add(chamber);
        });

        const airValveBlock = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.14), yellowSafetyMat);
        airValveBlock.position.set(0, 0.35, 0);
        pumpGroup.add(airValveBlock);

        // Pressure Regulator Gauge
        const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), chromeMat);
        gauge.rotation.x = Math.PI / 2;
        gauge.position.set(0, 0.48, 0.08);
        pumpGroup.add(gauge);

        // Flexible Suction Hose dipping into Base Ink Drum bung
        const suctionHose = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.85, 10), darkSteel);
        suctionHose.position.set(0, 0.65, 0.32);
        suctionHose.rotation.x = 0.55;
        pumpGroup.add(suctionHose);

        mGroup.add(pumpGroup);

        // 5. 20L Paint Pails with Wire Handles (ถังสีหิ้ว 20 ลิตร 2 ถัง)
        function create20LPaintPail(lidColor) {
          const pail = new THREE.Group();
          const pBodyMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
          const pLidMat = new THREE.MeshStandardMaterial({ color: lidColor, roughness: 0.3 });

          const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.38, 14), pBodyMat);
          bucket.position.y = 0.19;
          pail.add(bucket);

          const pLid = new THREE.Mesh(new THREE.CylinderGeometry(0.178, 0.178, 0.035, 14), pLidMat);
          pLid.position.y = 0.385;
          pail.add(pLid);

          // Wire bail handle
          const wire = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 6, 14, Math.PI), chromeMat);
          wire.position.set(0, 0.36, 0);
          wire.rotation.x = Math.PI / 2 + 0.3;
          pail.add(wire);

          return pail;
        }

        const magentaPail = create20LPaintPail(0xec4899);
        magentaPail.position.set(3.1, 0.41, 0.95);
        mGroup.add(magentaPail);

        const cyanPail = create20LPaintPail(0x06b6d4);
        cyanPail.position.set(3.1, 0.41, 0.40);
        mGroup.add(cyanPail);

        // 6. Overhead Solvent Supply Manifold & Valves (ระบบท่อส่งสารละลายด้านบน)
        const headerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 6.2, 12), pipeMat);
        headerPipe.rotation.z = Math.PI / 2;
        headerPipe.position.set(0, 4.10, 0.55);
        mGroup.add(headerPipe);

        // Pipe Support Stanchions
        [-2.8, 0, 2.8].forEach(function (sx) {
          const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.7, 0.06), darkSteel);
          stanchion.position.set(sx, 2.75, 0.55);
          mGroup.add(stanchion);
        });

        // Drop-down Solvent Nozzles with Valves into each of the 3 tanks
        [-1.9, 0, 1.9].forEach(function (tx) {
          const dropArm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.85, 10), pipeMat);
          dropArm.position.set(tx, 3.70, 0.20);
          dropArm.rotation.x = -0.55;
          mGroup.add(dropArm);

          const dropValve = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), brassMat);
          dropValve.position.set(tx, 3.40, 0.0);
          mGroup.add(dropValve);

          const dropHandle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.14), redRailMat);
          dropHandle.position.set(tx + 0.06, 3.44, 0.0);
          mGroup.add(dropHandle);
        });

        // 7. Viscosity & Color Formulation Control Console (ตู้คอนโทรลความหนืดสี)
        const kioskPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), darkSteel);
        kioskPedestal.position.set(3.1, 0.88, -0.9);
        mGroup.add(kioskPedestal);

        const kioskHead = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 0.32), whiteSteel));
        kioskHead.position.set(3.1, 1.45, -0.9);
        kioskHead.rotation.x = -0.35;
        mGroup.add(kioskHead);

        const kioskScreen = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.02), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
        kioskScreen.position.set(3.1, 1.46, -0.74);
        kioskScreen.rotation.x = -0.35;
        mGroup.add(kioskScreen);

        // Zahn Viscosity Cup Hanging on Side of Console
        const cupHook = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.10), darkSteel);
        cupHook.position.set(2.78, 1.35, -0.9);
        mGroup.add(cupHook);

        const zahnCup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.02, 0.09, 10), brassMat);
        zahnCup.position.set(2.78, 1.25, -0.85);
        mGroup.add(zahnCup);

      } else if (st.id === 'ST_PRINT') {
        /* 3. Printing Machine:
           - Left Unwinder Stand & Active Base Film Roll (x = -5.05, y = 1.45, z = -0.4): Matches Blown Film (0x60a5fa) or Purchased Film (0x3b82f6)
           - 5 Rotogravure Printing Units (x = -3.2, -1.6, 0, 1.6, 3.2) + Overhead Drying Bridge
           - Right Rewinder Stand & Active Printed Film Roll (x = +5.05, y = 1.45, z = -0.4): Royal Blue + Gold Stripes (0x2563eb / 0xfacc15)
           - Continuous running film web from Unwinder -> Printing Units -> Overhead Bridge -> Rewinder */
        const bridge = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.05, 2.7), whiteSteel));
        bridge.position.set(0, 4.5, -0.4);
        mGroup.add(bridge);
        const redRailFront = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.18, 0.14), redRailMat);
        redRailFront.position.set(0, 5.2, 0.88);
        mGroup.add(redRailFront);
        const redRailBack = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.18, 0.14), redRailMat);
        redRailBack.position.set(0, 5.2, -1.68);
        mGroup.add(redRailBack);

        [-3.2, -1.6, 0, 1.6, 3.2].forEach(function (ux) {
          const tower = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(1.15, 3.6, 2.4), whiteSteel));
          tower.position.set(ux, 2.2, -0.4);
          mGroup.add(tower);
          const panelFace = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.0, 0.08), darkSteel);
          panelFace.position.set(ux, 2.5, 0.82);
          mGroup.add(panelFace);
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 14), darkSteel);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(ux, 1.3, 0.84);
          mGroup.add(wheel);
          rollersOut.push(wheel);
        });

        // Left Unwinder Stand & Rotating Unwind Film Roll (Raw Substrate Film: Pure White before Printing)
        mGroup.add(createWinderStandPair(-5.05, -0.4, 1.6, 2.0, charcoalMat));
        const printUnwindRoll = createActiveFilmRollAssembly(0.95, 2.0, 0xffffff, 0xf1f5f9, 0x1e293b);
        tagSelectable(printUnwindRoll.bodyMesh);
        printUnwindRoll.group.position.set(-5.05, 1.45, -0.4);
        mGroup.add(printUnwindRoll.group);
        rollersOut.push(printUnwindRoll.group);
        sceneObjects.dynamicRollRefs.printUnwindRoll = printUnwindRoll;

        // Unwind guide dancer roller
        const unwindGuide = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 12), chromeMat);
        unwindGuide.rotation.x = Math.PI / 2;
        unwindGuide.position.set(-4.15, 2.45, -0.4);
        mGroup.add(unwindGuide);
        rollersOut.push(unwindGuide);

        // Right Rewinder Stand & Rotating Printed Film Roll (Hygiene Pattern + Blush Pink Faces)
        mGroup.add(createWinderStandPair(5.05, -0.4, 1.6, 2.0, charcoalMat));
        const printRewindRoll = createActiveFilmRollAssembly(0.95, 2.0, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
        tagSelectable(printRewindRoll.bodyMesh);
        printRewindRoll.group.position.set(5.05, 1.45, -0.4);
        mGroup.add(printRewindRoll.group);
        rollersOut.push(printRewindRoll.group);

        // Rewind guide roller
        const rewindGuide = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 12), chromeMat);
        rewindGuide.rotation.x = Math.PI / 2;
        rewindGuide.position.set(4.15, 2.45, -0.4);
        mGroup.add(rewindGuide);
        rollersOut.push(rewindGuide);

        // Active Running Film Web Spans (Unwinder -> Guide -> Tower 1 -> Overhead Bridge -> Tower 5 -> Guide -> Rewinder)
        // Note: Incoming web from Unwinder to Tower 1 is pure white before printing!
        const pWebIn1 = createFilmWebSpan(-5.05, 2.15, -4.15, 2.55, -0.4, 1.88, 0xffffff, 0.95);
        const pWebIn2 = createFilmWebSpan(-4.15, 2.55, -3.2, 3.85, -0.4, 1.88, 0xffffff, 0.95);
        sceneObjects.dynamicRollRefs.printUnwindWebs = [pWebIn1, pWebIn2];
        mGroup.add(pWebIn1);
        mGroup.add(pWebIn2);
        mGroup.add(createFilmWebSpan(-3.2, 3.92, 3.2, 3.92, -0.4, 1.88, 0xbe185d, 0.92));
        mGroup.add(createFilmWebSpan(3.2, 3.85, 4.15, 2.55, -0.4, 1.88, 0xbe185d, 0.92));
        mGroup.add(createFilmWebSpan(4.15, 2.55, 5.05, 2.15, -0.4, 1.88, 0xbe185d, 0.94));

      } else if (st.id === 'ST_LAM') {
        /* 4. Dry Lamination Machine:
           - Primary Unwinder on Left (x = -5.05, y = 1.45, z = -0.4): Exact match to Printing Rewinder Output (Hygiene Pattern + Blush Pink Faces)
           - Secondary Unwinder at Center-Left (x = -1.55, y = 1.32, z = -0.4): Laminate Barrier Film Roll (0x8b5cf6 + 0xe9d5ff stripes)
           - Overhead Drying Oven Bridge & Lamination Nip Unit
           - Rewinder on Right (x = +5.05, y = 1.45, z = -0.4): Laminate Roll Output (Hygiene Pattern + Glossy Finish + Blush Pink Faces)
           - Active running film webs showing both film layers merging into the laminator and winding onto the Rewinder */
        const ovenBridge = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.0, 3.0), whiteSteel));
        ovenBridge.position.set(0, 4.4, -0.4);
        mGroup.add(ovenBridge);
        const blueFascia = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.32, 3.1), blueAccentMat);
        blueFascia.position.set(0, 4.0, -0.4);
        mGroup.add(blueFascia);

        [-3.2, 0.2, 3.1].forEach(function (ux) {
          const unit = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.7, 2.8), whiteSteel));
          unit.position.set(ux, 1.75, -0.4);
          mGroup.add(unit);
          const nipRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 2.35, 16), printedWebMat);
          nipRoller.rotation.x = Math.PI / 2;
          nipRoller.position.set(ux + 0.55, 2.15, -0.4);
          mGroup.add(nipRoller);
          rollersOut.push(nipRoller);
        });

        // 1. Primary Unwinder (Left): Exact match to Printing Rewinder Output (Hygiene Pattern + Blush Pink Faces)
        mGroup.add(createWinderStandPair(-5.05, -0.4, 1.6, 2.0, charcoalMat));
        const lamPrimaryUnwind = createActiveFilmRollAssembly(0.95, 2.0, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
        tagSelectable(lamPrimaryUnwind.bodyMesh);
        lamPrimaryUnwind.group.position.set(-5.05, 1.45, -0.4);
        mGroup.add(lamPrimaryUnwind.group);
        rollersOut.push(lamPrimaryUnwind.group);

        // 2. Secondary Unwinder (Between Coating Unit & Laminating Nip): Laminate Barrier Film Roll (0x8b5cf6)
        mGroup.add(createWinderStandPair(-1.55, -0.4, 1.45, 2.0, charcoalMat));
        const lamSecondaryUnwind = createActiveFilmRollAssembly(0.78, 2.0, 0x8b5cf6, 0xe9d5ff, 0x1e293b);
        tagSelectable(lamSecondaryUnwind.bodyMesh);
        lamSecondaryUnwind.group.position.set(-1.55, 1.32, -0.4);
        mGroup.add(lamSecondaryUnwind.group);
        rollersOut.push(lamSecondaryUnwind.group);

        // 3. Rewinder (Right): Laminate Roll Output (Hygiene Pattern + Glossy Finish + Blush Pink Faces)
        mGroup.add(createWinderStandPair(5.05, -0.4, 1.6, 2.0, charcoalMat));
        const lamRewindRoll = createActiveFilmRollAssembly(0.98, 2.0, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
        tagSelectable(lamRewindRoll.bodyMesh);
        lamRewindRoll.group.position.set(5.05, 1.45, -0.4);
        mGroup.add(lamRewindRoll.group);
        rollersOut.push(lamRewindRoll.group);

        // Guide Rollers for Unwinder & Rewinder
        const lamInGuide = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 12), chromeMat);
        lamInGuide.rotation.x = Math.PI / 2;
        lamInGuide.position.set(-4.15, 2.4, -0.4);
        mGroup.add(lamInGuide);
        rollersOut.push(lamInGuide);

        const lamOutGuide = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 12), chromeMat);
        lamOutGuide.rotation.x = Math.PI / 2;
        lamOutGuide.position.set(4.18, 2.4, -0.4);
        mGroup.add(lamOutGuide);
        rollersOut.push(lamOutGuide);

        // Active Film Web Spans:
        // Primary Printed Web feeding up into Coating Unit -> Drying Oven Bridge -> Laminating Nip
        mGroup.add(createFilmWebSpan(-5.05, 2.15, -4.15, 2.50, -0.4, 1.88, 0xbe185d, 0.90));
        mGroup.add(createFilmWebSpan(-4.15, 2.50, -3.2, 3.85, -0.4, 1.88, 0xbe185d, 0.90));
        mGroup.add(createFilmWebSpan(-3.2, 3.85, 0.2, 3.85, -0.4, 1.88, 0xbe185d, 0.90));
        mGroup.add(createFilmWebSpan(0.2, 3.85, 0.75, 2.25, -0.4, 1.88, 0xbe185d, 0.90));
        // Secondary Laminate Film Web feeding from Secondary Unwinder into Laminating Nip at x = 0.75
        mGroup.add(createFilmWebSpan(-1.55, 1.95, 0.75, 2.15, -0.4, 1.86, 0x8b5cf6, 0.88));
        // Combined Laminated Web exiting Nip -> Right Pull Unit -> Rewinder Roll
        mGroup.add(createFilmWebSpan(0.75, 2.20, 3.65, 2.20, -0.4, 1.90, 0xbe185d, 0.94));
        mGroup.add(createFilmWebSpan(3.65, 2.20, 4.18, 2.48, -0.4, 1.90, 0xbe185d, 0.94));
        mGroup.add(createFilmWebSpan(4.18, 2.48, 5.05, 2.15, -0.4, 1.90, 0xbe185d, 0.95));

      } else if (st.id === 'ST_SLIT') {
        /* Slit Machine
           - Left: Master Unwind Roll matching Laminated Hygiene Roll (Hygiene Pattern + Blush Pink Faces)
           - Middle: Dark grey parallel side walls with black guide rollers + central grooved slitting roller
           - Right: 4 narrow slit Hygiene rolls + front pallet with 3 upright slit Hygiene rolls
           - Front-Left: Blue control kiosk with light-blue screen */

        // 1. Master Unwind Roll on Left (-X): Exact match to Laminated Hygiene Roll
        const masterRollObj = createActiveFilmRollAssembly(1.3, 2.8, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
        tagSelectable(masterRollObj.bodyMesh);
        masterRollObj.group.position.set(-3.7, 1.85, -0.7);
        mGroup.add(masterRollObj.group);
        rollersOut.push(masterRollObj.group);

        [-2.25, 0.85].forEach(function (zArm) {
          const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.9, 0.25), charcoalMat);
          standArm.position.set(-3.7, 1.15, zArm);
          mGroup.add(standArm);
        });

        // 2. Center Dark-Charcoal Parallel Side Walls
        const backWall = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.1, 0.32), charcoalMat));
        backWall.position.set(0.0, 1.35, -2.15);
        mGroup.add(backWall);

        const frontWall = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.1, 0.32), charcoalMat));
        frontWall.position.set(0.0, 1.35, 0.75);
        mGroup.add(frontWall);

        // Black guide rollers & grooved slitter shaft between the walls
        [-1.8, 0.0, 1.6].forEach(function (rx, idx) {
          const rShaftGrp = new THREE.Group();
          rShaftGrp.rotation.x = Math.PI / 2;
          rShaftGrp.position.set(rx, 1.65, -0.7);
          const rShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.7, 14), darkSteel);
          rShaftGrp.add(rShaft);
          if (idx === 1) {
            // Central grooved slitting knife rings
            for (let ky = -1.0; ky <= 1.0; ky += 0.4) {
              const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.14, 14), darkSteel);
              blade.position.y = ky;
              rShaftGrp.add(blade);
            }
          }
          mGroup.add(rShaftGrp);
          rollersOut.push(rShaftGrp);
        });

        // 3. Right Outfeed: 4 Narrow Slit Hygiene Rolls (Hygiene Pattern + Blush Pink Faces)
        [
          [2.7, 1.75, -1.55],
          [3.9, 1.45, -1.55],
          [2.7, 1.45, 0.15],
          [3.9, 1.15, 0.15]
        ].forEach(function (rp) {
          const sRoll = createActiveFilmRollAssembly(0.68, 0.85, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
          tagSelectable(sRoll.bodyMesh);
          sRoll.group.position.set(rp[0], rp[1], rp[2]);
          mGroup.add(sRoll.group);
          rollersOut.push(sRoll.group);
        });

        // 4. Foreground Pallet with 3 Upright Slit Hygiene Rolls (front-right, clear of worker)
        const slitPallet = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 1.3), new THREE.MeshLambertMaterial({ color: 0xfde68a }));
        slitPallet.position.set(2.2, 0.45, 2.55);
        mGroup.add(slitPallet);
        const upRollSideMat = new THREE.MeshStandardMaterial({
          map: getHygieneFilmTexture(),
          roughness: 0.28,
          metalness: 0.12
        });
        const upRollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
        [-0.7, 0, 0.7].forEach(function (ox) {
          const upRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.36, 0.36, 1.05, 20),
            [upRollSideMat, upRollFaceMat, upRollFaceMat]
          );
          upRoll.position.set(2.2 + ox, 1.05, 2.55);
          mGroup.add(upRoll);
        });

        // 5. Blue Control Kiosk at Front-Left (clear of worker)
        const slitKiosk = createBlueControlKioskMesh();
        slitKiosk.position.set(-2.9, 0.35, 2.05);
        mGroup.add(slitKiosk);

      } else if (st.id === 'ST_BAG') {
        /* Dual-Lane Bag Making Machine
           - Left: 2 Unwind Film Rolls matching Slit Hygiene Rolls (Hygiene Pattern + Blush Pink Faces)
           - Next: 2 Coral-Pink stepped forming chambers
           - Middle: 2 pairs of dark vertical sealing bars with orange top strips
           - Right: 2 Grey flat outfeed tables with standing finished Hygiene Stand-up Pouches + collection carton boxes at end
           - Front: 3 beige carton boxes on left + Blue control kiosk on right + 2 non-overlapping workers */
        const pinkChamberMat = new THREE.MeshLambertMaterial({ color: 0xe15b64 });
        const orangeStripMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });
        const tableGreyMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
        const cartonBeigeMat = new THREE.MeshLambertMaterial({ color: 0xfde68a });

        // Build two parallel bag lines at zLane = -1.7 (back) and zLane = +0.4 (front)
        [-1.7, 0.4].forEach(function (zLane, laneIdx) {
          // Unwind roll matching Slit Hygiene Roll output (Hygiene Pattern + Blush Pink Faces)
          const uRoll = createActiveFilmRollAssembly(0.85, 1.55, 0xbe185d, 0xfacc15, 0x1e293b, getHygieneFilmTexture(), 0xfbcfe8);
          tagSelectable(uRoll.bodyMesh);
          uRoll.group.position.set(-4.3, 1.35, zLane);
          mGroup.add(uRoll.group);
          rollersOut.push(uRoll.group);
          sceneObjects.dynamicRollRefs.bagUnwindRolls.push(uRoll);

          // Coral-pink stepped forming housing
          const pinkBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.65, 1.65), pinkChamberMat));
          pinkBox.position.set(-2.3, 1.18, zLane);
          mGroup.add(pinkBox);
          const pinkTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 1.15), pinkChamberMat);
          pinkTop.position.set(-2.3, 2.2, zLane);
          mGroup.add(pinkTop);

          // Pair of dark vertical sealing bars with glowing orange top strips
          [-0.75, -0.05].forEach(function (sx) {
            const barGroup = new THREE.Group();
            barGroup.position.set(sx, 1.25, zLane);
            const barBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.5, 1.65), darkSteel);
            barGroup.add(barBody);
            const orangeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 1.45), orangeStripMat);
            orangeStrip.position.y = 0.80;
            barGroup.add(orangeStrip);
            mGroup.add(barGroup);
            reciprocatorsOut.push({ mesh: barGroup, baseY: 1.25 });
          });

          // Grey flat outfeed table
          const tableBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 1.35), darkSteel);
          tableBase.position.set(1.85, 0.72, zLane);
          mGroup.add(tableBase);
          const tableTop = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.18, 1.55), tableGreyMat));
          tableTop.position.set(1.85, 1.18, zLane);
          mGroup.add(tableTop);

          // Outfeed guide rails
          const railMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
          const railBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.04), railMat);
          railBack.position.set(1.85, 1.31, zLane - 0.65);
          mGroup.add(railBack);
          const railFront = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.04), railMat);
          railFront.position.set(1.85, 1.31, zLane + 0.65);
          mGroup.add(railFront);

          // FINISHED HYGIENE REFILL POUCHES COMING OUT OF BAG MAKING MACHINE:
          const pouchX = [0.75, 1.25, 1.75, 2.25, 2.75];
          pouchX.forEach(function (px, pIdx) {
            const pouch = createPouchMesh({
              hasSpout: false,
              width: 0.44,
              height: 0.58,
              depth: 0.085
            });
            pouch.position.set(px, 1.27, zLane + (pIdx % 2 === 0 ? 0.08 : -0.08));
            pouch.rotation.y = (pIdx % 2 === 0 ? 0.05 : -0.05);
            pouch.rotation.z = -0.05;
            mGroup.add(pouch);
          });

          // Outfeed collection carton box at right end of each conveyor
          const endBox = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.75, 1.25), cartonBeigeMat);
          endBox.position.set(3.9, 0.72, zLane);
          mGroup.add(endBox);

          // Finished Hygiene pouches stacked inside the carton box at end of conveyor
          for (let row = 0; row < 3; row++) {
            const boxPouch = createPouchMesh({
              hasSpout: false,
              width: 0.40,
              height: 0.52,
              depth: 0.08
            });
            boxPouch.position.set(3.72 + row * 0.16, 0.96, zLane);
            boxPouch.rotation.z = -0.16;
            mGroup.add(boxPouch);
          }
        });

        // 3 Beige Carton Boxes along front-left edge
        [-3.8, -2.5, -1.2].forEach(function (bx) {
          const fBox = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.82, 1.05), cartonBeigeMat);
          fBox.position.set(bx, 0.76, 2.45);
          mGroup.add(fBox);
        });

        // Blue Control Kiosk at front-right
        const bagKiosk = createBlueControlKioskMesh();
        bagKiosk.position.set(2.35, 0.35, 2.45);
        mGroup.add(bagKiosk);

        // Second operator (pink shirt, yellow hat) standing cleanly in the gap between the two conveyors
        const pinkWorker = createWorkerMesh(0xf472b6, 0xfacc15);
        pinkWorker.position.set(0.85, 0.35, -0.65);
        pinkWorker.rotation.y = Math.PI / 2;
        mGroup.add(pinkWorker);
        extraWorkersOut.push(pinkWorker);

      } else if (st.id === 'ST_SPOUT') {
        /* Automatic Spout Inserting & Ultrasonic Welding Machine
           - Base enclosure with safety light curtains and acrylic guards (Industrial Grey)
           - Vibratory bowl feeder with green caps
           - Stainless cap feed chute connecting bowl to ultrasonic welding horn
           - Infeed conveyor on left with incoming plain Hygiene pouches
           - Ultrasonic weld horn at x = -1.2 reciprocating vertically
           - Outfeed conveyor on right with FINISHED HYGIENE SPOUT POUCHES (ซองไฮยีนมีฝาจุก)
           - Outfeed collection box with packed Hygiene spout pouches */
        const spoutGreyMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
        const cellBase = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 3.0), spoutGreyMat));
        cellBase.position.set(0, 1.25, -0.45);
        mGroup.add(cellBase);

        // Stainless conveyor bed across the front of the machine
        const conveyorBase = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.55, 0.85), darkSteel);
        conveyorBase.position.set(0, 1.52, 0.65);
        mGroup.add(conveyorBase);

        const conveyorBelt = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.12, 0.95), new THREE.MeshLambertMaterial({ color: 0x94a3b8 })));
        conveyorBelt.position.set(0, 1.85, 0.65);
        mGroup.add(conveyorBelt);

        // Conveyor guide rails
        const cRailMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
        const cRailBack = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.08, 0.04), cRailMat);
        cRailBack.position.set(0, 1.95, 0.22);
        mGroup.add(cRailBack);
        const cRailFront = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.08, 0.04), cRailMat);
        cRailFront.position.set(0, 1.95, 1.08);
        mGroup.add(cRailFront);

        // Vibratory bowl feeder on right stand
        const bowlStand = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.5, 14), darkSteel);
        bowlStand.position.set(2.2, 2.35, -0.6);
        mGroup.add(bowlStand);

        const bowl = tagSelectable(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.75, 0.72, 20), chromeMat));
        bowl.position.set(2.2, 3.35, -0.6);
        mGroup.add(bowl);
        rollersOut.push(bowl);

        // Green spout caps visible inside the bowl
        const capMat = new THREE.MeshLambertMaterial({ color: 0x10b981 });
        for (let i = 0; i < 6; i++) {
          const capAngle = (i * Math.PI) / 3;
          const capM = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 10), capMat);
          capM.position.set(2.2 + Math.cos(capAngle) * 0.55, 3.48, -0.6 + Math.sin(capAngle) * 0.55);
          mGroup.add(capM);
        }

        // Slanted Spout Cap Feeder Chute from bowl down to ultrasonic welder
        const chuteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.6, roughness: 0.3 });
        const chute = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.22), chuteMat);
        chute.position.set(0.5, 2.9, -0.15);
        chute.rotation.z = Math.PI * 0.12;
        chute.rotation.y = -Math.PI * 0.22;
        mGroup.add(chute);

        // Miniature spout caps sliding down the chute
        [-0.8, -0.2, 0.4, 1.0, 1.6].forEach(function (cx, idx) {
          const capOnChute = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), capMat);
          capOnChute.position.set(cx, 2.35 + (idx * 0.18), 0.35 - (idx * 0.18));
          mGroup.add(capOnChute);
        });

        // Ultrasonic Welding Column & Horn
        const weldColumn = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.1, 1.2), blueAccentMat);
        weldColumn.position.set(-1.2, 3.0, 0.15);
        mGroup.add(weldColumn);

        const weldHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 1.0, 14), redRailMat);
        weldHorn.position.set(-1.2, 2.45, 0.65);
        mGroup.add(weldHorn);
        reciprocatorsOut.push({ mesh: weldHorn, baseY: 2.45 });

        // INCOMING PLAIN HYGIENE POUCHES (Left side, moving toward welder at x = -1.2)
        [-2.7, -2.1, -1.5].forEach(function (px, idx) {
          const inPouch = createPouchMesh({
            hasSpout: false,
            width: 0.44,
            height: 0.58,
            depth: 0.085
          });
          inPouch.position.set(px, 1.91, 0.65 + (idx % 2 === 0 ? 0.04 : -0.04));
          inPouch.rotation.z = -0.04;
          mGroup.add(inPouch);
        });

        // Hygiene Pouch right under the welding horn (being welded)
        const underWelderPouch = createPouchMesh({
          hasSpout: true,
          spoutColor: 0x10b981,
          width: 0.44,
          height: 0.58,
          depth: 0.085
        });
        underWelderPouch.position.set(-1.05, 1.91, 0.65);
        mGroup.add(underWelderPouch);

        // FINISHED HYGIENE SPOUTED POUCHES COMING OUT ALONG OUTFEED TRACK
        const outSpoutX = [-0.4, 0.25, 0.90, 1.55, 2.20];
        outSpoutX.forEach(function (px, sIdx) {
          const spPouch = createPouchMesh({
            hasSpout: true,
            spoutColor: 0x10b981, // emerald green screw cap
            width: 0.44,
            height: 0.58,
            depth: 0.085,
            isCornerSpout: true
          });
          spPouch.position.set(px, 1.91, 0.65 + (sIdx % 2 === 0 ? 0.04 : -0.04));
          spPouch.rotation.y = (sIdx % 2 === 0 ? 0.06 : -0.06);
          spPouch.rotation.z = -0.05;
          mGroup.add(spPouch);
        });

        // Outfeed collection carton box at right end of conveyor
        const spoutCartonMat = new THREE.MeshLambertMaterial({ color: 0xfde68a });
        const spoutEndBox = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.75, 1.15), spoutCartonMat);
        spoutEndBox.position.set(3.2, 1.45, 0.65);
        mGroup.add(spoutEndBox);

        // Finished Hygiene spouted pouches stacked inside collection carton box
        for (let row = 0; row < 3; row++) {
          const boxSpoutPouch = createPouchMesh({
            hasSpout: true,
            spoutColor: 0x10b981,
            width: 0.40,
            height: 0.52,
            depth: 0.08,
            isCornerSpout: true
          });
          boxSpoutPouch.position.set(3.02 + row * 0.16, 1.68, 0.65);
          boxSpoutPouch.rotation.z = -0.16;
          mGroup.add(boxSpoutPouch);
        }

        // Control kiosk for Spout Station operator
        const spoutKiosk = createBlueControlKioskMesh();
        spoutKiosk.position.set(-2.6, 0.35, 2.2);
        mGroup.add(spoutKiosk);
      }

      return mGroup;
    }

    function createForkliftMesh(bodyColorHex) {
      const fl = new THREE.Group();
      const bodyColor = bodyColorHex || 0xfacc15;
      const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
      const vestMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const armMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
      const skinMat = new THREE.MeshLambertMaterial({ color: 0xfde047 });

      // 1. Lower Main Yellow Chassis
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.72, 1.62), bodyMat);
      chassis.position.set(-0.15, 0.52, 0);
      fl.add(chassis);

      // 2. Heavy Rear Counterweight Block (solid black, elevated)
      const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.82, 1.60), darkMat);
      counterweight.position.set(-0.95, 0.75, 0);
      fl.add(counterweight);

      // Front cowl / dashboard
      const frontCowl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 1.55), bodyMat);
      frontCowl.position.set(0.75, 0.65, 0);
      fl.add(frontCowl);

      // 3. Driver Seat & Steering Controls
      const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.65), darkMat);
      seatBase.position.set(-0.25, 0.86, 0);
      fl.add(seatBase);
      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.58), darkMat);
      seatBack.position.set(-0.55, 1.25, 0);
      fl.add(seatBack);

      const steeringColumn = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.1), darkMat);
      steeringColumn.rotation.z = -Math.PI / 6;
      steeringColumn.position.set(0.35, 1.15, 0);
      fl.add(steeringColumn);
      const steeringWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 12), darkMat);
      steeringWheel.rotation.x = Math.PI / 4;
      steeringWheel.position.set(0.26, 1.35, 0);
      fl.add(steeringWheel);

      // 4. Seated 3D Driver with Hi-Vis Vest & Control Arms (Reference Image)
      const driverGroup = new THREE.Group();
      driverGroup.position.set(-0.25, 0.94, 0);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.44), vestMat);
      torso.position.y = 0.32;
      driverGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 10, 10), skinMat);
      head.position.set(0, 0.74, 0);
      driverGroup.add(head);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.13), armMat);
      armL.position.set(0.24, 0.35, -0.20);
      armL.rotation.y = 0.15;
      driverGroup.add(armL);

      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.13), armMat);
      armR.position.set(0.24, 0.35, 0.20);
      armR.rotation.y = -0.15;
      driverGroup.add(armR);

      fl.add(driverGroup);

      // 5. Overhead Protective Roll Cage (4 black posts + solid black roof)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 1.55), darkMat);
      roof.position.set(-0.20, 2.45, 0);
      fl.add(roof);

      [[-0.82, -0.68], [-0.82, 0.68], [0.42, -0.68], [0.42, 0.68]].forEach(function (p) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.45, 0.11), darkMat);
        post.position.set(p[0], 1.72, p[1]);
        fl.add(post);
      });

      // 6. Front Vertical Mast Rails & Carriage Plate
      const mastL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.65, 0.14), darkMat);
      mastL.position.set(1.05, 1.45, -0.48);
      fl.add(mastL);
      const mastR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.65, 0.14), darkMat);
      mastR.position.set(1.05, 1.45, 0.48);
      fl.add(mastR);

      const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 1.15), darkMat);
      carriage.position.set(1.12, 0.48, 0);
      fl.add(carriage);

      // 7. TWO LONG BLACK FORKS (Ground Level) - Matching Reference Image!
      const forkL = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.16), darkMat);
      forkL.position.set(1.98, 0.08, -0.34);
      fl.add(forkL);
      const forkR = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.16), darkMat);
      forkR.position.set(1.98, 0.08, 0.34);
      fl.add(forkR);

      // 8. 4 Sturdy Dark Wheels with Tires
      [[-0.52], [0.52]].forEach(function (zOff) {
        const wF = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 14), wheelMat);
        wF.rotation.x = Math.PI / 2;
        wF.position.set(0.68, 0.42, zOff[0] * 1.58);
        fl.add(wF);
      });
      [[-0.50], [0.50]].forEach(function (zOff) {
        const wR = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 14), wheelMat);
        wR.rotation.x = Math.PI / 2;
        wR.position.set(-0.95, 0.36, zOff[0] * 1.52);
        fl.add(wR);
      });

      // Cargo holder group (for mounting pallets resting on forks)
      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(2.0, 0.12, 0);
      fl.add(cargoHolder);
      fl.userData.cargoHolder = cargoHolder;

      return fl;
    }

    function createHandPalletTruckMesh() {
      const hpt = new THREE.Group();
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const forkMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      // Two dark charcoal steel forks (ground level)
      const forkL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.28), forkMat);
      forkL.position.set(0.75, 0.14, -0.38);
      hpt.add(forkL);
      const forkR = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.28), forkMat);
      forkR.position.set(0.75, 0.14, 0.38);
      hpt.add(forkR);

      // Rear crossbar bridge connecting forks
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 1.04), forkMat);
      bridge.position.set(-0.25, 0.14, 0);
      hpt.add(bridge);

      // Hydraulic pump cylinder body
      const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.52, 12), darkMat);
      pump.position.set(-0.42, 0.38, 0);
      hpt.add(pump);

      // Steer handle (angled T-bar)
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 8), darkMat);
      handle.position.set(-0.85, 0.95, 0);
      handle.rotation.z = 0.38;
      hpt.add(handle);

      // T-bar cross handle bar
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.46), darkMat);
      crossbar.position.set(-1.12, 1.50, 0);
      hpt.add(crossbar);

      // Steer dual wheels underneath pump
      const steerWh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 14), wheelMat);
      steerWh.rotation.z = Math.PI / 2;
      steerWh.position.set(-0.42, 0.18, 0);
      hpt.add(steerWh);

      // Operator worker pulling HPT (white helmet, yellow vest with silver stripe, blue sleeves, dark pants)
      const operator = createWorkerMesh(0xfacc15, 0xffffff);
      operator.position.set(-1.45, 0, 0);
      operator.rotation.y = Math.PI / 2;
      hpt.add(operator);
      hpt.userData.operator = operator;

      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(0.80, 0.22, 0);
      hpt.add(cargoHolder);
      hpt.userData.cargoHolder = cargoHolder;

      return hpt;
    }

    /* Realistic Side-Door Container Truck (รถบรรทุกตู้เปิดข้างสำหรับโหลดพาเลท) */
    function createContainerTruckMesh() {
      const truck = new THREE.Group();
      const cabMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const containerMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
      const chassisMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const glassMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
      const floorMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
      const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const hazardBlack = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      // 1. Container Floor / Bed (Thick industrial steel deck)
      const bed = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.26, 12.8), floorMat);
      bed.position.set(0, 1.33, 1.5);
      truck.add(bed);

      // 2. Container Roof (Container Blue with exterior reinforcement ribs)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.22, 12.8), containerMat);
      roof.position.set(0, 6.09, 1.5);
      truck.add(roof);

      for (let rz = -4.0; rz <= 7.0; rz += 1.8) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(5.94, 0.08, 0.16), chassisMat);
        rib.position.set(0, 6.22, rz);
        truck.add(rib);
      }

      // 3. Container Front Wall (behind Cab)
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.9, 4.6, 0.22), containerMat);
      frontWall.position.set(0, 3.70, 7.8);
      truck.add(frontWall);

      // 4. Container Rear Wall (Tailgate) with chrome vertical locking rods
      const rearWall = new THREE.Mesh(new THREE.BoxGeometry(5.9, 4.6, 0.22), containerMat);
      rearWall.position.set(0, 3.70, -4.8);
      truck.add(rearWall);

      [-1.1, 1.1].forEach(function (rx) {
        const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 10), chromeMat);
        lockBar.position.set(rx, 3.70, -4.95);
        truck.add(lockBar);
      });

      // 5. Container Right Wall (East / Non-door side: Solid Blue Wall)
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 12.8), containerMat);
      rightWall.position.set(2.85, 3.70, 1.5);
      truck.add(rightWall);

      // 6. Container Left Wall (West / Door side facing Forklift)
      // Wide Side Loading Opening spans 7.6m (from z = -3.4 to z = 4.2)
      // (a) Rear fixed wall panel (z = -4.8 to z = -3.4, length 1.4)
      const leftWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 1.4), containerMat);
      leftWallRear.position.set(-2.85, 3.70, -4.1);
      truck.add(leftWallRear);

      // (b) Front fixed wall panel (z = 4.2 to z = 7.8, length 3.6)
      const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 3.6), containerMat);
      leftWallFront.position.set(-2.85, 3.70, 6.0);
      truck.add(leftWallFront);

      // (c) Top Door Lintel / Header above opening (span 7.64m)
      const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 7.64), containerMat);
      doorLintel.position.set(-2.85, 5.86, 0.4);
      truck.add(doorLintel);

      // (d) Bottom Door Sill / Threshold (span 7.64m)
      const doorSill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 7.64), chassisMat);
      doorSill.position.set(-2.85, 1.34, 0.4);
      truck.add(doorSill);

      // Alternating yellow/black hazard safety stripes along door sill
      for (let sIdx = 0; sIdx < 14; sIdx++) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.34, 0.04, 0.45),
          sIdx % 2 === 0 ? hazardYellow : hazardBlack
        );
        stripe.position.set(-2.85, 1.46, -3.15 + sIdx * 0.54);
        truck.add(stripe);
      }

      // 7. Double Open Side Doors (ประตูตู้เปิดข้างสำหรับโหลดพาเลท)
      // (A) Rear Door Wing (Hinged at z = -3.4)
      const doorPivotRear = new THREE.Group();
      doorPivotRear.position.set(-2.95, 3.68, -3.4);
      truck.add(doorPivotRear);

      const doorLeafRear = new THREE.Group();
      const doorMeshRear = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.15, 3.8), containerMat);
      doorMeshRear.position.set(0, 0, 1.9);
      doorLeafRear.add(doorMeshRear);

      const lockBarRear = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.9, 10), chromeMat);
      lockBarRear.position.set(-0.08, 0, 1.9);
      doorLeafRear.add(lockBarRear);

      doorPivotRear.add(doorLeafRear);

      // (B) Front Door Wing (Hinged at z = 4.2)
      const doorPivotFront = new THREE.Group();
      doorPivotFront.position.set(-2.95, 3.68, 4.2);
      truck.add(doorPivotFront);

      const doorLeafFront = new THREE.Group();
      const doorMeshFront = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.15, 3.8), containerMat);
      doorMeshFront.position.set(0, 0, -1.9);
      doorLeafFront.add(doorMeshFront);

      const lockBarFront = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.9, 10), chromeMat);
      lockBarFront.position.set(-0.08, 0, -1.9);
      doorLeafFront.add(lockBarFront);

      doorPivotFront.add(doorLeafFront);

      // Set side doors wide open (~105 degrees) so interior cargo bay is completely open for loading
      function setDoorOpenRatio(ratio) {
        const maxAngle = Math.PI * 0.58;
        doorPivotRear.rotation.y = -ratio * maxAngle;
        doorPivotFront.rotation.y = ratio * maxAngle;
      }
      setDoorOpenRatio(1.0); // Default WIDE OPEN for forklift cargo loading!

      truck.userData.doorPivotRear = doorPivotRear;
      truck.userData.doorPivotFront = doorPivotFront;
      truck.userData.setDoorOpenRatio = setDoorOpenRatio;

      // 8. Interior Cargo Bay Details
      // Ceiling cargo dome lights
      [-1.5, 1.5, 4.5].forEach(function (lz) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        lamp.position.set(0, 5.96, lz);
        truck.add(lamp);
      });

      // Staged cargo boxes already stacked inside the truck near right wall
      const deepCargo1 = createKraftRackBox();
      deepCargo1.position.set(1.4, 1.95, -2.5);
      truck.add(deepCargo1);

      const deepCargo2 = createKraftRackBox();
      deepCargo2.position.set(1.4, 1.95, 4.2);
      truck.add(deepCargo2);

      // 9. Truck Cab
      const cab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 4.0), cabMat);
      cab.position.set(0, 3.1, 10.4);
      truck.add(cab);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.5, 0.2), glassMat);
      windshield.position.set(0, 4.0, 12.42);
      truck.add(windshield);

      [-2.61, 2.61].forEach(function (wx) {
        const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.4, 2.0), glassMat);
        sideWindow.position.set(wx, 3.9, 10.8);
        truck.add(sideWindow);
      });

      [-1.8, 1.8].forEach(function (hx) {
        const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 0.12), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        headlight.position.set(hx, 1.8, 12.42);
        truck.add(headlight);
      });

      const grille = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.14), chassisMat);
      grille.position.set(0, 1.8, 12.42);
      truck.add(grille);

      // 10. Chassis & Wheels
      const chassisBeams = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 17.5), chassisMat);
      chassisBeams.position.set(0, 1.1, 2.8);
      truck.add(chassisBeams);

      const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 2.4, 14), chromeMat);
      fuelTank.rotation.z = Math.PI / 2;
      fuelTank.position.set(2.4, 1.1, -1.0);
      truck.add(fuelTank);

      const wheels = [];
      [-3.2, 0.5, 6.2, 10.6].forEach(function (zPos) {
        [-2.7, 2.7].forEach(function (xPos) {
          const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.62, 16), chassisMat);
          wh.rotation.z = Math.PI / 2;
          wh.position.set(xPos, 0.92, zPos);
          truck.add(wh);
          wheels.push(wh);
        });
      });
      truck.userData.wheels = wheels;

      // 11. Loaded Pallets Group (Positioned inside the open doorway on truck bed!)
      const loadedPalletsGroup = new THREE.Group();
      loadedPalletsGroup.position.set(0, 1.46, -0.4);
      truck.add(loadedPalletsGroup);
      truck.userData.loadedPalletsGroup = loadedPalletsGroup;

      return truck;
    }


    /* Helper: Create Demarcated Station Material Bay
       - Infeed (Input, on the Left, x = -2.4): Hollow bright Safety Yellow (0xfacc15) outline box
       - Outfeed (Output, on the Right, x = +2.4): Hollow bright Safety Green (0x22c55e) outline box */
    function createDemarcatedStationBay(label, matKeysList, xPos, zPos, isRow1, hasInitialPallet) {
      const bayGroup = new THREE.Group();
      bayGroup.position.set(xPos, 0.12, zPos);

      // Infeed (Input) = Bright Safety Yellow (0xfacc15); Outfeed (Output) = Bright Safety Green (0x22c55e)
      const isOutfeed = (label === 'OUTFEED');
      const frameColor = isOutfeed ? 0x22c55e : 0xfacc15;
      const borderMat = new THREE.MeshLambertMaterial({ color: frameColor });
      const w = 2.4;
      const d = 2.4;
      const thick = 0.10;
      const h = 0.025;

      const top = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
      top.position.set(0, h / 2, -d / 2 + thick / 2);
      bayGroup.add(top);

      const btm = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
      btm.position.set(0, h / 2, d / 2 - thick / 2);
      bayGroup.add(btm);

      const left = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d - thick * 2), borderMat);
      left.position.set(-w / 2 + thick / 2, h / 2, 0);
      bayGroup.add(left);

      const right = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d - thick * 2), borderMat);
      right.position.set(w / 2 - thick / 2, h / 2, 0);
      bayGroup.add(right);

      // Subtle translucent epoxy floor tint pad matching frame color (Yellow for Infeed, Green for Outfeed)
      const padMat = new THREE.MeshBasicMaterial({ color: frameColor, transparent: true, opacity: 0.16 });
      const innerPad = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, 0.01, d - 0.2), padMat);
      innerPad.position.set(0, 0.005, 0);
      bayGroup.add(innerPad);

      // Dedicated cargo holder group inside the demarcated bay
      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(0, 0.03, 0);
      bayGroup.add(cargoHolder);

      bayGroup.userData.cargoHolder = cargoHolder;
      bayGroup.userData.label = label;
      bayGroup.userData.isOutfeed = isOutfeed;
      bayGroup.userData.matKeysList = matKeysList;
      bayGroup.userData.currentMatKey = null;

      // Optional pallet cargo inside box if populated
      if (hasInitialPallet) {
        const primaryKey = (matKeysList && matKeysList[0]) ? matKeysList[0] : 'BLOWN_FILM';
        setBayCargo(bayGroup, primaryKey);
      }

      return bayGroup;
    }

    /* Station Bay Cargo & Dynamic Machine Speed Helpers
       - setBayCargo: Mounts cargo visual into bay (Yellow Infeed or Green Outfeed)
       - clearBayCargo: Empties cargo from bay immediately
       - bayHasCargo: Checks if bay currently holds materials
       - isStationInputReady: Checks if station has input ready in Infeed or is actively running */
    function setBayCargo(bayGroup, matKey) {
      if (!bayGroup || !bayGroup.userData || !bayGroup.userData.cargoHolder) return;
      const holder = bayGroup.userData.cargoHolder;
      while (holder.children.length > 0) {
        holder.remove(holder.children[0]);
      }
      bayGroup.userData.currentMatKey = matKey || null;
      if (matKey) {
        const cargo = createCargoVisualByKey(matKey);
        cargo.scale.set(0.78, 0.78, 0.78);
        applyShadowFlags(cargo);
        holder.add(cargo);
      }
    }

    function clearBayCargo(bayGroup) {
      setBayCargo(bayGroup, null);
    }

    function bayHasCargo(bayGroup) {
      if (!bayGroup || !bayGroup.userData || !bayGroup.userData.cargoHolder) return false;
      return bayGroup.userData.cargoHolder.children.length > 0;
    }

    function isStationInputReady(stationId) {
      const stObj = (sceneObjects && sceneObjects.stationObjs) ? sceneObjects.stationObjs[stationId] : null;
      if (!stObj) return false;
      const rt = (appState && appState.stationRuntime) ? appState.stationRuntime[stationId] : null;
      if (appState.isConcurrent && appState.concurrentData && appState.concurrentData.stationCycles) {
        const sc = appState.concurrentData.stationCycles[stationId];
        return Boolean(sc && sc.status === 'RUNNING');
      }
      return Boolean(rt && rt.status === 'RUNNING');
    }

    function resetAllStationBays() {
      if (!sceneObjects || !sceneObjects.stationObjs) return;
      STATIONS_CONFIG.forEach(function (st) {
        const stObj = sceneObjects.stationObjs[st.id];
        if (!stObj) return;
        if (stObj.infeedBay) clearBayCargo(stObj.infeedBay);
        if (stObj.outfeedBay) clearBayCargo(stObj.outfeedBay);
      });
      if (sceneObjects.prdBayIn) clearBayCargo(sceneObjects.prdBayIn);
      if (sceneObjects.prdBayOut) clearBayCargo(sceneObjects.prdBayOut);
    }
