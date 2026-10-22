/* =========================================================================
   StarFlexERP 3D - Machine: Dual-Lane Stand-Up Pouch Bag Maker (ST_BAG)
   ========================================================================= */

function buildBagMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
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
          uRoll.group.position.set(-4.3, 1.00, zLane);
          mGroup.add(uRoll.group);
          rollersOut.push(uRoll.group);
          sceneObjects.dynamicRollRefs.bagUnwindRolls.push(uRoll);

          // Coral-pink stepped forming housing resting on floor
          const pinkBox = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.65, 1.65), pinkChamberMat));
          pinkBox.position.set(-2.3, 0.83, zLane);
          mGroup.add(pinkBox);
          const pinkTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 1.15), pinkChamberMat);
          pinkTop.position.set(-2.3, 1.85, zLane);
          mGroup.add(pinkTop);

          // Pair of dark vertical sealing bars with glowing orange top strips
          [-0.75, -0.05].forEach(function (sx) {
            const barGroup = new THREE.Group();
            barGroup.position.set(sx, 0.90, zLane);
            const barBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.5, 1.65), darkSteel);
            barGroup.add(barBody);
            const orangeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 1.45), orangeStripMat);
            orangeStrip.position.y = 0.80;
            barGroup.add(orangeStrip);
            mGroup.add(barGroup);
            reciprocatorsOut.push({ mesh: barGroup, baseY: 0.90 });
          });

          // Grey flat outfeed table resting on floor
          const tableBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 1.35), darkSteel);
          tableBase.position.set(1.85, 0.38, zLane);
          mGroup.add(tableBase);
          const tableTop = tagSelectable(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.18, 1.55), tableGreyMat));
          tableTop.position.set(1.85, 0.83, zLane);
          mGroup.add(tableTop);

          // Outfeed guide rails
          const railMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
          const railBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.04), railMat);
          railBack.position.set(1.85, 0.96, zLane - 0.65);
          mGroup.add(railBack);
          const railFront = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.04), railMat);
          railFront.position.set(1.85, 0.96, zLane + 0.65);
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
            pouch.position.set(px, 0.92, zLane + (pIdx % 2 === 0 ? 0.08 : -0.08));
            pouch.rotation.y = (pIdx % 2 === 0 ? 0.05 : -0.05);
            pouch.rotation.z = -0.05;
            mGroup.add(pouch);
          });

          // Outfeed collection carton box at right end of each conveyor
          const endBox = createKraftCartonBox({ width: 1.15, height: 0.75, depth: 1.25, openTop: true });
          endBox.position.set(3.9, 0.0, zLane);
          mGroup.add(endBox);

          // Finished Hygiene pouches stacked inside the carton box at end of conveyor
          for (let row = 0; row < 3; row++) {
            const boxPouch = createPouchMesh({
              hasSpout: false,
              width: 0.40,
              height: 0.52,
              depth: 0.08
            });
            boxPouch.position.set(3.72 + row * 0.16, 0.61, zLane);
            boxPouch.rotation.z = -0.16;
            mGroup.add(boxPouch);
          }
        });

        // 3 Kraft Corrugated Carton Boxes with white tape along front-left edge resting on floor
        [-3.8, -2.5, -1.2].forEach(function (bx) {
          const fBox = createKraftCartonBox(1.05, 0.82, 1.05, 'z');
          fBox.position.set(bx, 0.0, 2.45);
          mGroup.add(fBox);
        });

        // Blue Control Kiosk at front-right resting on floor
        const bagKiosk = createBlueControlKioskMesh();
        bagKiosk.position.set(2.35, 0.0, 2.45);
        mGroup.add(bagKiosk);

        // Second operator (pink shirt, yellow hat) standing on floor
        const pinkWorker = createWorkerMesh(0xf472b6, 0xfacc15);
        pinkWorker.position.set(0.85, 0.0, -0.65);
        pinkWorker.rotation.y = Math.PI / 2;
        mGroup.add(pinkWorker);
        extraWorkersOut.push(pinkWorker);

  return mGroup;
}
