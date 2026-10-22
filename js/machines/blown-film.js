/* =========================================================================
   StarFlexERP 3D - Machine: Blown Film Extruder Tower (ST_BLOWN)
   ========================================================================= */

function buildBlownFilmMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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

  return mGroup;
}
