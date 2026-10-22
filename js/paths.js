/* =========================================================================
   StarFlexERP 3D - Central Transit Highway Waypoints & Path Builders
   - Collision-Free Two-Row Central Transit Corridor:
     * North Lane (z = -1.8): Dedicated Westbound for RM Forklift
     * South Lane (z = +1.8): Dedicated Eastbound for Hand Pallet Truck
   - Station Infeed & Outfeed bay routing
   - Warehouse FG multi-tier rack slot delivery paths
   - Concurrent Digital Twin multi-vehicle mission waypoints
   ========================================================================= */

    function buildRmToStationPath(rmKey, stationId, isReturnToRm) {
      const rmDock = MATERIAL_CATALOG[rmKey].rmDock || MATERIAL_CATALOG[rmKey].rmPos;
      const st = STATION_MAP[stationId];
      const dockZ = (st.row === 1 ? -5.2 : 5.2);
      const laneZ = -1.8; // Dedicated Westbound North lane for RM Forklift

      if (isReturnToRm) {
        // Output from station departing back to RM WH departs from OUTFEED (Right Green box)
        const outX = (st.hptDock ? st.hptDock[0] : (st.pos[0] + 2.4));
        const outZ = (st.hptDock ? st.hptDock[2] : dockZ);
        return [
          new THREE.Vector3(outX, 0.15, outZ),
          new THREE.Vector3(outX, 0.15, laneZ),
          new THREE.Vector3(-63.0, 0.15, laneZ),
          new THREE.Vector3(-63.0, 0.15, rmDock[2]),
          new THREE.Vector3(rmDock[0], 0.15, rmDock[2])
        ];
      }

      // Input from RM WH arriving at station enters into INFEED (Left Yellow box)
      const inX = (st.flDock ? st.flDock[0] : (st.pos[0] - 2.4));
      const inZ = (st.flDock ? st.flDock[2] : dockZ);
      return [
        new THREE.Vector3(rmDock[0], 0.15, rmDock[2]),
        new THREE.Vector3(-63.0, 0.15, rmDock[2]),
        new THREE.Vector3(-63.0, 0.15, laneZ),
        new THREE.Vector3(inX, 0.15, laneZ),
        new THREE.Vector3(inX, 0.15, inZ)
      ];
    }

    function buildWipHptPath(fromStationId, toStationId) {
      const stA = STATION_MAP[fromStationId];
      const stB = STATION_MAP[toStationId];

      // Origin: Output MUST depart from OUTFEED (Right Green box)
      let originX = -7.6, originZ = 5.2; // default PRD WH Outfeed
      if (stA && stA.hptDock) {
        originX = stA.hptDock[0];
        originZ = stA.hptDock[2];
      } else if (fromStationId === 'ZONE_PRD_WH') {
        originX = -7.6; // PRD WH Outfeed (Right Green box)
        originZ = 5.2;
      }

      // Destination: Input MUST enter into INFEED (Left Yellow box)
      let destX = -12.4, destZ = 5.2; // default PRD WH Infeed
      if (stB && stB.flDock) {
        destX = stB.flDock[0];
        destZ = stB.flDock[2];
      } else if (toStationId === 'ZONE_PRD_WH') {
        destX = -12.4; // PRD WH Infeed (Left Yellow box)
        destZ = 5.2;
      }

      const laneZ = 1.8; // Dedicated Eastbound South lane for Hand Pallet Truck
      return [
        new THREE.Vector3(originX, 0.15, originZ),
        new THREE.Vector3(originX, 0.15, laneZ),
        new THREE.Vector3(destX, 0.15, laneZ),
        new THREE.Vector3(destX, 0.15, destZ)
      ];
    }

    function buildStationToFgRackPath(stationId, fgSlotVec3) {
      const st = STATION_MAP[stationId];
      // Finished goods leaving final conversion station MUST depart from OUTFEED (Right Green box)
      let outX = 32.4, outZ = -5.2;
      if (st && st.hptDock) {
        outX = st.hptDock[0];
        outZ = st.hptDock[2];
      }
      const laneZ = 1.8; // Eastbound South lane heading to Warehouse FG
      return [
        new THREE.Vector3(outX, 0.15, outZ),
        new THREE.Vector3(outX, 0.15, laneZ),
        new THREE.Vector3(47.0, 0.15, laneZ),
        new THREE.Vector3(47.0, 0.15, fgSlotVec3.z + 2.5),
        new THREE.Vector3(fgSlotVec3.x, 0.15, fgSlotVec3.z + 2.5)
      ];
    }

    function computePathLength(waypoints) {
      let len = 0;
      for (let i = 1; i < waypoints.length; i++) {
        len += waypoints[i - 1].distanceTo(waypoints[i]);
      }
      return Math.max(0.1, len);
    }

    function sampleWaypoints(waypoints, t01) {
      const total = computePathLength(waypoints);
      let targetDist = Math.max(0, Math.min(1, t01)) * total;
      for (let i = 1; i < waypoints.length; i++) {
        const seg = waypoints[i - 1].distanceTo(waypoints[i]);
        if (targetDist <= seg || i === waypoints.length - 1) {
          const localT = seg > 0.0001 ? targetDist / seg : 1;
          const pos = new THREE.Vector3().lerpVectors(waypoints[i - 1], waypoints[i], localT);
          const dir = new THREE.Vector3().subVectors(waypoints[i], waypoints[i - 1]);
          const yaw = (dir.lengthSq() > 0.0001) ? Math.atan2(-dir.z, dir.x) : 0;
          return { pos: pos, yaw: yaw };
        }
        targetDist -= seg;
      }
      return { pos: waypoints[waypoints.length - 1].clone(), yaw: 0 };
    }

    function buildConcurrentRmWaypoints(mission) {
      if (!mission) {
        return [new THREE.Vector3(-45, 0.15, -1.8), new THREE.Vector3(-45, 0.15, -1.8)];
      }
      const st = STATION_MAP[mission.toStation];
      const mat = MATERIAL_CATALOG[mission.fromKey] || MATERIAL_CATALOG.RESIN;
      const pickX = (mat && mat.rmDock) ? mat.rmDock[0] : ((mat && mat.rmPos) ? mat.rmPos[0] : -63);
      const pickZ = (mat && mat.rmDock) ? mat.rmDock[2] : ((mat && mat.rmPos) ? mat.rmPos[2] : -4);
      const targetX = st ? st.flDock[0] : -32.4;
      const targetZ = st ? st.flDock[2] : -5.2;
      const laneZ = -1.8; // Dedicated Westbound North lane for RM Forklift

      return [
        new THREE.Vector3(pickX, 0.15, pickZ),
        new THREE.Vector3(-63.0, 0.15, pickZ),
        new THREE.Vector3(-63.0, 0.15, laneZ),
        new THREE.Vector3(targetX, 0.15, laneZ),
        new THREE.Vector3(targetX, 0.15, targetZ),
        new THREE.Vector3(targetX, 0.15, laneZ),
        new THREE.Vector3(-63.0, 0.15, laneZ),
        new THREE.Vector3(-63.0, 0.15, pickZ),
        new THREE.Vector3(pickX, 0.15, pickZ)
      ];
    }

    function buildConcurrentHptWaypoints(mission) {
      if (!mission) {
        return [new THREE.Vector3(-10, 0.15, 1.8), new THREE.Vector3(-10, 0.15, 1.8)];
      }
      let fromX = -7.6, fromZ = -5.2, toX = 12.4, toZ = 5.2;
      if (mission.fromStation && STATION_MAP[mission.fromStation]) {
        const s = STATION_MAP[mission.fromStation];
        fromX = s.hptDock[0];
        fromZ = s.hptDock[2];
      } else if (mission.fromZone === 'ZONE_PRD_WH') {
        fromX = -7.6;
        fromZ = 5.2;
      }
      if (mission.toStation && STATION_MAP[mission.toStation]) {
        const s = STATION_MAP[mission.toStation];
        toX = s.flDock[0];
        toZ = s.flDock[2];
      } else if (mission.toZone === 'ZONE_PRD_WH') {
        toX = -12.4;
        toZ = 5.2;
      }
      const laneZ = 1.8; // Dedicated Eastbound South lane for Hand Pallet Truck

      return [
        new THREE.Vector3(fromX, 0.15, fromZ),
        new THREE.Vector3(fromX, 0.15, laneZ),
        new THREE.Vector3(toX, 0.15, laneZ),
        new THREE.Vector3(toX, 0.15, toZ),
        new THREE.Vector3(toX, 0.15, laneZ),
        new THREE.Vector3(fromX, 0.15, laneZ),
        new THREE.Vector3(fromX, 0.15, fromZ)
      ];
    }

    function buildConcurrentFgWaypoints() {
      // Pick up from the Outfeed bay (Right Green box) of Bag (12.4, -5.2) or Spout (32.4, -5.2)
      const isSpout = (appState.productType === 'FG_SPOUT');
      const pickX = isSpout ? 32.4 : 12.4;
      const pickZ = -5.2;
      return [
        new THREE.Vector3(pickX, 0.15, pickZ),
        new THREE.Vector3(pickX, 0.15, 1.8),
        new THREE.Vector3(51, 0.15, 1.8),
        new THREE.Vector3(51, 0.15, -10.0),
        new THREE.Vector3(51, 0.15, 1.8),
        new THREE.Vector3(pickX, 0.15, 1.8),
        new THREE.Vector3(pickX, 0.15, pickZ)
      ];
    }

    function buildConcurrentDeliveryWaypoints() {
      return [
        new THREE.Vector3(53, 0.15, -10.0),
        new THREE.Vector3(65, 0.15, -4.0),
        new THREE.Vector3(75, 0.15, -4.0),
        new THREE.Vector3(65, 0.15, -4.0),
        new THREE.Vector3(53, 0.15, -10.0)
      ];
    }
