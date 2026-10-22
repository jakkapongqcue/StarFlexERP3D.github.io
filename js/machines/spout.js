/* =========================================================================
   StarFlexERP 3D - Machine: Automatic Ultrasonic Spout Inserter & Welder (ST_SPOUT)
   ========================================================================= */

function buildSpoutMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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
  return mGroup;
}
