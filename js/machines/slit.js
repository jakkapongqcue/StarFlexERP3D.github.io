/* =========================================================================
   StarFlexERP 3D - Machine: Narrow-Web Slitter Rewinder (ST_SLIT)
   ========================================================================= */

function buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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
          const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.25), charcoalMat);
          standArm.position.set(-3.7, 1.10, zArm);
          mGroup.add(standArm);
        });

        // 2. Center Dark-Charcoal Parallel Side Walls resting on floor
        const backWall = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.7, 0.32), charcoalMat));
        backWall.position.set(0.0, 1.35, -2.15);
        mGroup.add(backWall);

        const frontWall = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.7, 0.32), charcoalMat));
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

        // 4. Foreground Square Pallet with 3 Tiers of Upright Slit Hygiene Rolls & Cardboard Interlayers
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

        // Shorter slit rolls (adjusted height as requested)
        const rollRadius = 0.35;
        const rollHeight = 0.45; // Shorter roll height (reduced from 1.05)
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
          // Cardboard interlayer sheet (placed on base pallet and between tiers)
          const sheetY = currentY + sheetThick / 2;
          createCardboardInterlayer(sheetY);
          currentY += sheetThick;

          // 4 Upright Rolls on this tier (2x2 grid)
          const rollCenterY = currentY + rollHeight / 2;
          gridOffsets.forEach(function (ox, rIdx) {
            gridOffsets.forEach(function (oz, cIdx) {
              const roll = new THREE.Mesh(rollGeo, rollMaterials);
              roll.position.set(palX + ox, rollCenterY, palZ + oz);
              roll.rotation.y = tier * 1.8 + rIdx * 2.2 + cIdx * 1.4; // Varied orientation
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

        // 5. Blue Control Kiosk at Front-Left resting on floor
        const slitKiosk = createBlueControlKioskMesh();
        slitKiosk.position.set(-2.9, 0.0, 2.05);
        mGroup.add(slitKiosk);

  return mGroup;
}
