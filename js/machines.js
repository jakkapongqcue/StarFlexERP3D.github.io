/* =========================================================================
   StarFlexERP 3D - Factory Machinery & Station Equipment 3D Models
   - Operators & Control Kiosks
   - Film Winders, Roll Shafts, Web Spans
   - 7 Realistic Industrial Station Models:
     1. Blown Film Extruder Tower & Bubble Cage
     2. Ink Mix Agitation Tanks & Color Tubs
     3. Rotogravure Multi-Unit Printing Press
     4. Dry Laminator with Bridge Oven
     5. Narrow-Web Slitter Rewinder
     6. Dual-Lane Stand-Up Pouch Bag Maker
     7. Rotary Ultrasonic Spout Inserter & Welder
   ========================================================================= */

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
