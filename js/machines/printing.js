/* =========================================================================
   StarFlexERP 3D - Machine: Rotogravure Multi-Unit Printing Press (ST_PRINT)
   ========================================================================= */

function buildPrintingMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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

        // Heavy steel machine base chassis resting on the floor
        const baseBed = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.42, 2.4), darkSteel);
        baseBed.position.set(0, 0.21, -0.4);
        mGroup.add(baseBed);

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

  return mGroup;
}
