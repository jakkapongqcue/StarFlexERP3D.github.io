/* =========================================================================
   StarFlexERP 3D - Machine: Ink & Paint Mixing Plant (ST_INK)
   ========================================================================= */

function buildInkMixMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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

  return mGroup;
}
