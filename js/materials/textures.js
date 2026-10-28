/* =========================================================================
   StarFlexERP 3D - Procedural Canvas Textures (textures.js)
   Generates high-resolution 2D Canvas textures for film webs, pouches & labels
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

