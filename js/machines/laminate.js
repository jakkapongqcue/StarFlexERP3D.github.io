/* =========================================================================
   StarFlexERP 3D - Machine: Dry Laminator with Bridge Oven (ST_LAM)
   ========================================================================= */

function buildLaminateMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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

  return mGroup;
}
