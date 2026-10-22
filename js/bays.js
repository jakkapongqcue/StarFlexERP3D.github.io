/* =========================================================================
   StarFlexERP 3D - Demarcated Station Floor Bays & Bay Cargo Management
   - Hollow Infeed (Left Yellow Frame) & Outfeed (Right Green Frame) bays
   - Cargo placement, removal, and readiness verification
   ========================================================================= */

    /* Helper: Create Demarcated Station Material Bay
       - Infeed (Input, on the Left, x = -2.4): Hollow bright Safety Yellow (0xfacc15) outline box
       - Outfeed (Output, on the Right, x = +2.4): Hollow bright Safety Green (0x22c55e) outline box */
    function createDemarcatedStationBay(label, matKeysList, xPos, zPos, isRow1, hasInitialPallet) {
      const bayGroup = new THREE.Group();
      bayGroup.position.set(xPos, 0.12, zPos);

      // Infeed (Input) = Bright Safety Yellow (0xfacc15); Outfeed (Output) = Bright Safety Green (0x22c55e)
      const isOutfeed = (label === 'OUTFEED');
      const frameColor = isOutfeed ? 0x22c55e : 0xfacc15;
      const borderMat = new THREE.MeshLambertMaterial({ color: frameColor });
      const w = 2.4;
      const d = 2.4;
      const thick = 0.10;
      const h = 0.025;

      const top = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
      top.position.set(0, h / 2, -d / 2 + thick / 2);
      bayGroup.add(top);

      const btm = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
      btm.position.set(0, h / 2, d / 2 - thick / 2);
      bayGroup.add(btm);

      const left = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d - thick * 2), borderMat);
      left.position.set(-w / 2 + thick / 2, h / 2, 0);
      bayGroup.add(left);

      const right = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d - thick * 2), borderMat);
      right.position.set(w / 2 - thick / 2, h / 2, 0);
      bayGroup.add(right);

      // Subtle translucent epoxy floor tint pad matching frame color (Yellow for Infeed, Green for Outfeed)
      const padMat = new THREE.MeshBasicMaterial({ color: frameColor, transparent: true, opacity: 0.16 });
      const innerPad = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, 0.01, d - 0.2), padMat);
      innerPad.position.set(0, 0.005, 0);
      bayGroup.add(innerPad);

      // Dedicated cargo holder group inside the demarcated bay
      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(0, 0.03, 0);
      bayGroup.add(cargoHolder);

      bayGroup.userData.cargoHolder = cargoHolder;
      bayGroup.userData.label = label;
      bayGroup.userData.isOutfeed = isOutfeed;
      bayGroup.userData.matKeysList = matKeysList;
      bayGroup.userData.currentMatKey = null;

      // Optional pallet cargo inside box if populated
      if (hasInitialPallet) {
        const primaryKey = (matKeysList && matKeysList[0]) ? matKeysList[0] : 'BLOWN_FILM';
        setBayCargo(bayGroup, primaryKey);
      }

      return bayGroup;
    }

    /* Station Bay Cargo & Dynamic Machine Speed Helpers
       - setBayCargo: Mounts cargo visual into bay (Yellow Infeed or Green Outfeed)
       - clearBayCargo: Empties cargo from bay immediately
       - bayHasCargo: Checks if bay currently holds materials
       - isStationInputReady: Checks if station has input ready in Infeed or is actively running */
    function setBayCargo(bayGroup, matKey) {
      if (!bayGroup || !bayGroup.userData || !bayGroup.userData.cargoHolder) return;
      const holder = bayGroup.userData.cargoHolder;
      while (holder.children.length > 0) {
        holder.remove(holder.children[0]);
      }
      bayGroup.userData.currentMatKey = matKey || null;
      if (matKey) {
        const cargo = createCargoVisualByKey(matKey);
        cargo.scale.set(0.78, 0.78, 0.78);
        applyShadowFlags(cargo);
        holder.add(cargo);
      }
    }

    function clearBayCargo(bayGroup) {
      setBayCargo(bayGroup, null);
    }

    function bayHasCargo(bayGroup) {
      if (!bayGroup || !bayGroup.userData || !bayGroup.userData.cargoHolder) return false;
      return bayGroup.userData.cargoHolder.children.length > 0;
    }

    function isStationInputReady(stationId) {
      const stObj = (sceneObjects && sceneObjects.stationObjs) ? sceneObjects.stationObjs[stationId] : null;
      if (!stObj) return false;
      const rt = (appState && appState.stationRuntime) ? appState.stationRuntime[stationId] : null;
      if (appState.isConcurrent && appState.concurrentData && appState.concurrentData.stationCycles) {
        const sc = appState.concurrentData.stationCycles[stationId];
        return Boolean(sc && sc.status === 'RUNNING');
      }
      return Boolean(rt && rt.status === 'RUNNING');
    }

    function resetAllStationBays() {
      if (!sceneObjects || !sceneObjects.stationObjs) return;
      STATIONS_CONFIG.forEach(function (st) {
        const stObj = sceneObjects.stationObjs[st.id];
        if (!stObj) return;
        if (stObj.infeedBay) clearBayCargo(stObj.infeedBay);
        if (stObj.outfeedBay) clearBayCargo(stObj.outfeedBay);
      });
      if (sceneObjects.prdBayIn) clearBayCargo(sceneObjects.prdBayIn);
      if (sceneObjects.prdBayOut) clearBayCargo(sceneObjects.prdBayOut);
    }
