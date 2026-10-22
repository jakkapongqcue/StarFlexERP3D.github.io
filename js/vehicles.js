/* =========================================================================
   StarFlexERP 3D - Logistics Fleet: Forklifts, Pallet Truck & Cargo Truck
   - Counterbalanced Industrial Forklifts (RM Forklift, FG Forklift, Delivery Forklift)
   - Electric Hand Pallet Truck (Central Highway transit)
   - Heavy Logistics Semi-Trailer Container Truck with animated side loading doors
   ========================================================================= */

    function createForkliftMesh(bodyColorHex) {
      const fl = new THREE.Group();
      const bodyColor = bodyColorHex || 0xfacc15;
      const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
      const vestMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const armMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
      const skinMat = new THREE.MeshLambertMaterial({ color: 0xfde047 });

      // 1. Lower Main Yellow Chassis
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.72, 1.62), bodyMat);
      chassis.position.set(-0.15, 0.52, 0);
      fl.add(chassis);

      // 2. Heavy Rear Counterweight Block (solid black, elevated)
      const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.82, 1.60), darkMat);
      counterweight.position.set(-0.95, 0.75, 0);
      fl.add(counterweight);

      // Front cowl / dashboard
      const frontCowl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 1.55), bodyMat);
      frontCowl.position.set(0.75, 0.65, 0);
      fl.add(frontCowl);

      // 3. Driver Seat & Steering Controls
      const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.65), darkMat);
      seatBase.position.set(-0.25, 0.86, 0);
      fl.add(seatBase);
      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.58), darkMat);
      seatBack.position.set(-0.55, 1.25, 0);
      fl.add(seatBack);

      const steeringColumn = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.1), darkMat);
      steeringColumn.rotation.z = -Math.PI / 6;
      steeringColumn.position.set(0.35, 1.15, 0);
      fl.add(steeringColumn);
      const steeringWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 12), darkMat);
      steeringWheel.rotation.x = Math.PI / 4;
      steeringWheel.position.set(0.26, 1.35, 0);
      fl.add(steeringWheel);

      // 4. Seated 3D Driver with Hi-Vis Vest & Control Arms (Reference Image)
      const driverGroup = new THREE.Group();
      driverGroup.position.set(-0.25, 0.94, 0);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.44), vestMat);
      torso.position.y = 0.32;
      driverGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 10, 10), skinMat);
      head.position.set(0, 0.74, 0);
      driverGroup.add(head);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.13), armMat);
      armL.position.set(0.24, 0.35, -0.20);
      armL.rotation.y = 0.15;
      driverGroup.add(armL);

      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.13), armMat);
      armR.position.set(0.24, 0.35, 0.20);
      armR.rotation.y = -0.15;
      driverGroup.add(armR);

      fl.add(driverGroup);

      // 5. Overhead Protective Roll Cage (4 black posts + solid black roof)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.12, 1.55), darkMat);
      roof.position.set(-0.20, 2.45, 0);
      fl.add(roof);

      [[-0.82, -0.68], [-0.82, 0.68], [0.42, -0.68], [0.42, 0.68]].forEach(function (p) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.45, 0.11), darkMat);
        post.position.set(p[0], 1.72, p[1]);
        fl.add(post);
      });

      // 6. Front Vertical Mast Rails & Carriage Plate
      const mastL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.65, 0.14), darkMat);
      mastL.position.set(1.05, 1.45, -0.48);
      fl.add(mastL);
      const mastR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.65, 0.14), darkMat);
      mastR.position.set(1.05, 1.45, 0.48);
      fl.add(mastR);

      const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 1.15), darkMat);
      carriage.position.set(1.12, 0.48, 0);
      fl.add(carriage);

      // 7. TWO LONG BLACK FORKS (Ground Level) - Matching Reference Image!
      const forkL = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.16), darkMat);
      forkL.position.set(1.98, 0.08, -0.34);
      fl.add(forkL);
      const forkR = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.16), darkMat);
      forkR.position.set(1.98, 0.08, 0.34);
      fl.add(forkR);

      // 8. 4 Sturdy Dark Wheels with Tires
      [[-0.52], [0.52]].forEach(function (zOff) {
        const wF = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 14), wheelMat);
        wF.rotation.x = Math.PI / 2;
        wF.position.set(0.68, 0.42, zOff[0] * 1.58);
        fl.add(wF);
      });
      [[-0.50], [0.50]].forEach(function (zOff) {
        const wR = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 14), wheelMat);
        wR.rotation.x = Math.PI / 2;
        wR.position.set(-0.95, 0.36, zOff[0] * 1.52);
        fl.add(wR);
      });

      // Cargo holder group (for mounting pallets resting on forks)
      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(2.0, 0.12, 0);
      fl.add(cargoHolder);
      fl.userData.cargoHolder = cargoHolder;

      return fl;
    }

    function createHandPalletTruckMesh() {
      const hpt = new THREE.Group();
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const forkMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      // Two dark charcoal steel forks (ground level)
      const forkL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.28), forkMat);
      forkL.position.set(0.75, 0.14, -0.38);
      hpt.add(forkL);
      const forkR = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.28), forkMat);
      forkR.position.set(0.75, 0.14, 0.38);
      hpt.add(forkR);

      // Rear crossbar bridge connecting forks
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 1.04), forkMat);
      bridge.position.set(-0.25, 0.14, 0);
      hpt.add(bridge);

      // Hydraulic pump cylinder body
      const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.52, 12), darkMat);
      pump.position.set(-0.42, 0.38, 0);
      hpt.add(pump);

      // Steer handle (angled T-bar)
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 8), darkMat);
      handle.position.set(-0.85, 0.95, 0);
      handle.rotation.z = 0.38;
      hpt.add(handle);

      // T-bar cross handle bar
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.46), darkMat);
      crossbar.position.set(-1.12, 1.50, 0);
      hpt.add(crossbar);

      // Steer dual wheels underneath pump
      const steerWh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 14), wheelMat);
      steerWh.rotation.z = Math.PI / 2;
      steerWh.position.set(-0.42, 0.18, 0);
      hpt.add(steerWh);

      // Operator worker pulling HPT (white helmet, yellow vest with silver stripe, blue sleeves, dark pants)
      const operator = createWorkerMesh(0xfacc15, 0xffffff);
      operator.position.set(-1.45, 0, 0);
      operator.rotation.y = Math.PI / 2;
      hpt.add(operator);
      hpt.userData.operator = operator;

      const cargoHolder = new THREE.Group();
      cargoHolder.position.set(0.80, 0.22, 0);
      hpt.add(cargoHolder);
      hpt.userData.cargoHolder = cargoHolder;

      return hpt;
    }

    /* Realistic Side-Door Container Truck (รถบรรทุกตู้เปิดข้างสำหรับโหลดพาเลท) */
    function createContainerTruckMesh() {
      const truck = new THREE.Group();
      const cabMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const containerMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
      const chassisMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const glassMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
      const floorMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
      const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const hazardBlack = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      // 1. Container Floor / Bed (Thick industrial steel deck)
      const bed = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.26, 12.8), floorMat);
      bed.position.set(0, 1.33, 1.5);
      truck.add(bed);

      // 2. Container Roof (Container Blue with exterior reinforcement ribs)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.22, 12.8), containerMat);
      roof.position.set(0, 6.09, 1.5);
      truck.add(roof);

      for (let rz = -4.0; rz <= 7.0; rz += 1.8) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(5.94, 0.08, 0.16), chassisMat);
        rib.position.set(0, 6.22, rz);
        truck.add(rib);
      }

      // 3. Container Front Wall (behind Cab)
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.9, 4.6, 0.22), containerMat);
      frontWall.position.set(0, 3.70, 7.8);
      truck.add(frontWall);

      // 4. Container Rear Wall (Tailgate) with chrome vertical locking rods
      const rearWall = new THREE.Mesh(new THREE.BoxGeometry(5.9, 4.6, 0.22), containerMat);
      rearWall.position.set(0, 3.70, -4.8);
      truck.add(rearWall);

      [-1.1, 1.1].forEach(function (rx) {
        const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 10), chromeMat);
        lockBar.position.set(rx, 3.70, -4.95);
        truck.add(lockBar);
      });

      // 5. Container Right Wall (East / Non-door side: Solid Blue Wall)
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 12.8), containerMat);
      rightWall.position.set(2.85, 3.70, 1.5);
      truck.add(rightWall);

      // 6. Container Left Wall (West / Door side facing Forklift)
      // Wide Side Loading Opening spans 7.6m (from z = -3.4 to z = 4.2)
      // (a) Rear fixed wall panel (z = -4.8 to z = -3.4, length 1.4)
      const leftWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 1.4), containerMat);
      leftWallRear.position.set(-2.85, 3.70, -4.1);
      truck.add(leftWallRear);

      // (b) Front fixed wall panel (z = 4.2 to z = 7.8, length 3.6)
      const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 3.6), containerMat);
      leftWallFront.position.set(-2.85, 3.70, 6.0);
      truck.add(leftWallFront);

      // (c) Top Door Lintel / Header above opening (span 7.64m)
      const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 7.64), containerMat);
      doorLintel.position.set(-2.85, 5.86, 0.4);
      truck.add(doorLintel);

      // (d) Bottom Door Sill / Threshold (span 7.64m)
      const doorSill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 7.64), chassisMat);
      doorSill.position.set(-2.85, 1.34, 0.4);
      truck.add(doorSill);

      // Alternating yellow/black hazard safety stripes along door sill
      for (let sIdx = 0; sIdx < 14; sIdx++) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.34, 0.04, 0.45),
          sIdx % 2 === 0 ? hazardYellow : hazardBlack
        );
        stripe.position.set(-2.85, 1.46, -3.15 + sIdx * 0.54);
        truck.add(stripe);
      }

      // 7. Double Open Side Doors (ประตูตู้เปิดข้างสำหรับโหลดพาเลท)
      // (A) Rear Door Wing (Hinged at z = -3.4)
      const doorPivotRear = new THREE.Group();
      doorPivotRear.position.set(-2.95, 3.68, -3.4);
      truck.add(doorPivotRear);

      const doorLeafRear = new THREE.Group();
      const doorMeshRear = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.15, 3.8), containerMat);
      doorMeshRear.position.set(0, 0, 1.9);
      doorLeafRear.add(doorMeshRear);

      const lockBarRear = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.9, 10), chromeMat);
      lockBarRear.position.set(-0.08, 0, 1.9);
      doorLeafRear.add(lockBarRear);

      doorPivotRear.add(doorLeafRear);

      // (B) Front Door Wing (Hinged at z = 4.2)
      const doorPivotFront = new THREE.Group();
      doorPivotFront.position.set(-2.95, 3.68, 4.2);
      truck.add(doorPivotFront);

      const doorLeafFront = new THREE.Group();
      const doorMeshFront = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.15, 3.8), containerMat);
      doorMeshFront.position.set(0, 0, -1.9);
      doorLeafFront.add(doorMeshFront);

      const lockBarFront = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.9, 10), chromeMat);
      lockBarFront.position.set(-0.08, 0, -1.9);
      doorLeafFront.add(lockBarFront);

      doorPivotFront.add(doorLeafFront);

      // Set side doors wide open (~105 degrees) so interior cargo bay is completely open for loading
      function setDoorOpenRatio(ratio) {
        const maxAngle = Math.PI * 0.58;
        doorPivotRear.rotation.y = -ratio * maxAngle;
        doorPivotFront.rotation.y = ratio * maxAngle;
      }
      setDoorOpenRatio(1.0); // Default WIDE OPEN for forklift cargo loading!

      truck.userData.doorPivotRear = doorPivotRear;
      truck.userData.doorPivotFront = doorPivotFront;
      truck.userData.setDoorOpenRatio = setDoorOpenRatio;

      // 8. Interior Cargo Bay Details
      // Ceiling cargo dome lights
      [-1.5, 1.5, 4.5].forEach(function (lz) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        lamp.position.set(0, 5.96, lz);
        truck.add(lamp);
      });

      // Staged cargo boxes already stacked inside the truck near right wall
      const deepCargo1 = createKraftRackBox();
      deepCargo1.position.set(1.4, 1.95, -2.5);
      truck.add(deepCargo1);

      const deepCargo2 = createKraftRackBox();
      deepCargo2.position.set(1.4, 1.95, 4.2);
      truck.add(deepCargo2);

      // 9. Truck Cab
      const cab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 4.0), cabMat);
      cab.position.set(0, 3.1, 10.4);
      truck.add(cab);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.5, 0.2), glassMat);
      windshield.position.set(0, 4.0, 12.42);
      truck.add(windshield);

      [-2.61, 2.61].forEach(function (wx) {
        const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.4, 2.0), glassMat);
        sideWindow.position.set(wx, 3.9, 10.8);
        truck.add(sideWindow);
      });

      [-1.8, 1.8].forEach(function (hx) {
        const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 0.12), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        headlight.position.set(hx, 1.8, 12.42);
        truck.add(headlight);
      });

      const grille = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.14), chassisMat);
      grille.position.set(0, 1.8, 12.42);
      truck.add(grille);

      // 10. Chassis & Wheels
      const chassisBeams = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 17.5), chassisMat);
      chassisBeams.position.set(0, 1.1, 2.8);
      truck.add(chassisBeams);

      const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 2.4, 14), chromeMat);
      fuelTank.rotation.z = Math.PI / 2;
      fuelTank.position.set(2.4, 1.1, -1.0);
      truck.add(fuelTank);

      const wheels = [];
      [-3.2, 0.5, 6.2, 10.6].forEach(function (zPos) {
        [-2.7, 2.7].forEach(function (xPos) {
          const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.62, 16), chassisMat);
          wh.rotation.z = Math.PI / 2;
          wh.position.set(xPos, 0.92, zPos);
          truck.add(wh);
          wheels.push(wh);
        });
      });
      truck.userData.wheels = wheels;

      // 11. Loaded Pallets Group (Positioned inside the open doorway on truck bed!)
      const loadedPalletsGroup = new THREE.Group();
      loadedPalletsGroup.position.set(0, 1.46, -0.4);
      truck.add(loadedPalletsGroup);
      truck.userData.loadedPalletsGroup = loadedPalletsGroup;

      return truck;
    }
