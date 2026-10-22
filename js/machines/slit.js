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

        // 4. Foreground Pallet with 3 Upright Slit Hygiene Rolls (front-right, resting on floor)
        const slitPallet = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 1.3), new THREE.MeshLambertMaterial({ color: 0xfde68a }));
        slitPallet.position.set(2.2, 0.10, 2.55);
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
          upRoll.position.set(2.2 + ox, 0.725, 2.55);
          mGroup.add(upRoll);
        });

        // 5. Blue Control Kiosk at Front-Left resting on floor
        const slitKiosk = createBlueControlKioskMesh();
        slitKiosk.position.set(-2.9, 0.0, 2.05);
        mGroup.add(slitKiosk);

  return mGroup;
}
