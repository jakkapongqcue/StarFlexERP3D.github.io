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

    /* =========================================================================
       Realistic Modern Logistics Box Truck (Stylized Starflex Logistics Truck)
       - Visual Style: Matches User Reference (media_1792665338934_60c5fff2.png)
       - Cab: Royal Blue (#1d4ed8), Stepped Aero Roof Spoiler, Dark Tint Glass Visor,
              Charcoal Bumper (#111827) with Yellow Rectangular Headlights (#fde047)
       - Cargo Box: Crisp White Body (#ffffff), Royal Blue Lower Accent Stripe (#1d4ed8),
                    High-Res Official STARFLEX Logo (img/Starflex_loog.png)
       - Axles & Wheels: 1 Front Steering Axle + 2 Tandem Rear Axles (Matching Photo!)
       - Simulation: Animated side loading doors & loadedPalletsGroup for forklift loading,
                     rolling wheels on departure
       ========================================================================= */
    let _cachedStarflexTruckTexture = null;

    function getStarflexTruckLogoTexture() {
      if (_cachedStarflexTruckTexture) return _cachedStarflexTruckTexture;
      if (typeof document === 'undefined') return null;

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 384;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      function renderBaseTrailerWall() {
        // 1. Crisp white cargo trailer base
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Royal Blue lower accent band (matching cab #1d4ed8)
        const stripeH = 50;
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(0, canvas.height - stripeH, canvas.width, stripeH);

        // Thin cyan accent pinstripe above the blue band
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, canvas.height - stripeH - 3, canvas.width, 3);

        // 3. Subtle horizontal panel seams across the trailer wall
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        for (let y = 52; y < canvas.height - stripeH - 12; y += 64) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      renderBaseTrailerWall();

      // 4. Instant Vector Fallback: Starflex Ribbon & Bold Typography
      function drawVectorStarflexFallback() {
        ctx.save();
        const icX = 145;
        const icY = 145;
        const r = 58;

        // Top cyan ribbon
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(icX, icY - r);
        ctx.lineTo(icX + r * 0.86, icY - r * 0.5);
        ctx.lineTo(icX + r * 0.45, icY - r * 0.25);
        ctx.lineTo(icX, icY - r * 0.5);
        ctx.closePath();
        ctx.fill();

        // Mid light blue ribbon
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(icX - r * 0.86, icY - r * 0.5);
        ctx.lineTo(icX, icY);
        ctx.lineTo(icX - r * 0.45, icY + r * 0.25);
        ctx.lineTo(icX - r * 0.86, icY);
        ctx.closePath();
        ctx.fill();

        // Bottom royal blue ribbon
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(icX, icY + r);
        ctx.lineTo(icX + r * 0.86, icY + r * 0.5);
        ctx.lineTo(icX + r * 0.45, icY + r * 0.25);
        ctx.lineTo(icX, icY + r * 0.5);
        ctx.closePath();
        ctx.fill();

        // Bold STARFLEX lettering
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 84px "Montserrat", "Segoe UI", "Arial Black", sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('STARFLEX', icX + 105, icY - 4);
        ctx.restore();
      }
      drawVectorStarflexFallback();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      _cachedStarflexTruckTexture = texture;

      // 5. Load High-Resolution Official PNG Logo from img/Starflex_loog.png
      if (typeof Image !== 'undefined') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          renderBaseTrailerWall();
          const stripeH = 50;
          const padX = 70;
          const maxW = canvas.width - padX * 2;
          const maxH = canvas.height - stripeH - 60;
          const aspect = img.width / img.height;
          let drawW = maxW;
          let drawH = drawW / aspect;
          if (drawH > maxH) {
            drawH = maxH;
            drawW = drawH * aspect;
          }
          const drawX = (canvas.width - drawW) / 2;
          const drawY = (canvas.height - stripeH - drawH) / 2 + 6;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          texture.needsUpdate = true;
        };
        img.src = 'img/Starflex_loog.png';
      }

      return texture;
    }

    function createContainerTruckMesh() {
      const truck = new THREE.Group();

      // Materials matching the Reference 3D Model (media_1792665338934)
      const cabMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }); // Royal Blue
      const bumperMat = new THREE.MeshLambertMaterial({ color: 0x111827 }); // Charcoal bumper
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // Bright yellow headlights
      const darkGlassMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // Dark tinted visor
      const boxWhiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc }); // Crisp white trailer
      const boxStripeMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }); // Royal blue lower trim
      const chassisMat = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // Chassis rails
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // Dark tires
      const rimMat = new THREE.MeshLambertMaterial({ color: 0x475569 }); // Hub rims
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
      const floorMat = new THREE.MeshLambertMaterial({ color: 0x334155 }); // Ribbed steel deck
      const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const hazardBlack = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      // Starflex Trailer Side Logo Texture
      const logoTexture = getStarflexTruckLogoTexture();
      const logoSideMat = logoTexture
        ? new THREE.MeshLambertMaterial({
            map: logoTexture,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2
          })
        : boxWhiteMat;

      // 1. Cargo Floor / Bed Deck
      const bed = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.28, 13.6), floorMat);
      bed.position.set(0, 1.32, 1.1);
      truck.add(bed);

      // 2. Cargo Roof (White with subtle roof trim)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(5.62, 0.24, 13.62), boxWhiteMat);
      roof.position.set(0, 6.18, 1.1);
      truck.add(roof);

      // 3. Cargo Front Wall (behind Cab at z = 7.8)
      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.74, 0.22), boxWhiteMat);
      frontWall.position.set(0, 3.75, 7.8);
      truck.add(frontWall);

      // 4. Cargo Rear Wall (Tailgate at z = -5.6)
      const rearWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.74, 0.22), boxWhiteMat);
      rearWall.position.set(0, 3.75, -5.6);
      truck.add(rearWall);

      // Chrome vertical rear lock bars
      [-1.2, 1.2].forEach(function (rx) {
        const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.5, 10), chromeMat);
        lockBar.position.set(rx, 3.75, -5.75);
        truck.add(lockBar);
      });

      // Rear tail lamp clusters (Red & Amber)
      [-2.1, 2.1].forEach(function (tx) {
        const tailRed = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.08), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        tailRed.position.set(tx, 1.25, -5.73);
        truck.add(tailRed);
        const tailAmber = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.20, 0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
        tailAmber.position.set(tx + (tx > 0 ? 0.35 : -0.35), 1.25, -5.73);
        truck.add(tailAmber);
      });

      // 5. Container Right Wall (East Wall facing Yard & Camera at x = +2.81)
      // Solid White Wall branded with the High-Res STARFLEX Logo and lower blue stripe!
      const rightWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(13.56, 4.74), logoSideMat);
      rightWallMesh.position.set(2.82, 3.75, 1.1);
      rightWallMesh.rotation.y = Math.PI / 2; // Facing East
      truck.add(rightWallMesh);

      // Backing thickness slab for East wall (recessed behind logo plane to eliminate Z-fighting)
      const rightWallBacking = new THREE.Mesh(new THREE.BoxGeometry(0.14, 4.74, 13.56), boxWhiteMat);
      rightWallBacking.position.set(2.70, 3.75, 1.1);
      truck.add(rightWallBacking);

      // 6. Container Left Wall (West Wall facing Forklift loading at x = -2.81)
      // Features Wide Side Opening for forklift pallet loading + animated folding doors
      // (a) Rear fixed panel (z = -5.6 to z = -3.4, len 2.2)
      const leftWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.20, 4.74, 2.2), boxWhiteMat);
      leftWallRear.position.set(-2.81, 3.75, -4.5);
      truck.add(leftWallRear);

      const rearBlueSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 2.2), boxStripeMat);
      rearBlueSkirt.position.set(-2.81, 1.58, -4.5);
      truck.add(rearBlueSkirt);

      // (b) Front fixed panel (z = 4.0 to z = 7.8, len 3.8)
      const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.20, 4.74, 3.8), boxWhiteMat);
      leftWallFront.position.set(-2.81, 3.75, 5.9);
      truck.add(leftWallFront);

      const frontBlueSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 3.8), boxStripeMat);
      frontBlueSkirt.position.set(-2.81, 1.58, 5.9);
      truck.add(frontBlueSkirt);

      // (c) Top Door Header / Lintel (span 7.4m)
      const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 7.44), boxWhiteMat);
      doorLintel.position.set(-2.81, 5.99, 0.3);
      truck.add(doorLintel);

      // (d) Bottom Door Sill (span 7.4m)
      const doorSill = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 7.44), chassisMat);
      doorSill.position.set(-2.81, 1.33, 0.3);
      truck.add(doorSill);

      // Alternating yellow/black hazard safety threshold
      for (let sIdx = 0; sIdx < 14; sIdx++) {
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.04, 0.44),
          sIdx % 2 === 0 ? hazardYellow : hazardBlack
        );
        stripe.position.set(-2.81, 1.45, -3.15 + sIdx * 0.53);
        truck.add(stripe);
      }

      // 7. Double Animated Side Doors (Opening for forklift pallet loading)
      const doorPivotRear = new THREE.Group();
      doorPivotRear.position.set(-2.91, 3.73, -3.4);
      truck.add(doorPivotRear);

      const doorLeafRear = new THREE.Group();
      const doorMeshRear = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.25, 3.7), boxWhiteMat);
      doorMeshRear.position.set(0, 0, 1.85);
      doorLeafRear.add(doorMeshRear);

      const doorSkirtRear = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 3.7), boxStripeMat);
      doorSkirtRear.position.set(0, -1.88, 1.85);
      doorLeafRear.add(doorSkirtRear);

      const lockBarRear = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.0, 10), chromeMat);
      lockBarRear.position.set(-0.08, 0, 1.85);
      doorLeafRear.add(lockBarRear);
      doorPivotRear.add(doorLeafRear);

      const doorPivotFront = new THREE.Group();
      doorPivotFront.position.set(-2.91, 3.73, 4.0);
      truck.add(doorPivotFront);

      const doorLeafFront = new THREE.Group();
      const doorMeshFront = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.25, 3.7), boxWhiteMat);
      doorMeshFront.position.set(0, 0, -1.85);
      doorLeafFront.add(doorMeshFront);

      const doorSkirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 3.7), boxStripeMat);
      doorSkirtFront.position.set(0, -1.88, -1.85);
      doorLeafFront.add(doorSkirtFront);

      const lockBarFront = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.0, 10), chromeMat);
      lockBarFront.position.set(-0.08, 0, -1.85);
      doorLeafFront.add(lockBarFront);
      doorPivotFront.add(doorLeafFront);

      function setDoorOpenRatio(ratio) {
        const maxAngle = Math.PI * 0.58;
        doorPivotRear.rotation.y = -ratio * maxAngle;
        doorPivotFront.rotation.y = ratio * maxAngle;
      }
      setDoorOpenRatio(1.0); // Default open for loading

      truck.userData.doorPivotRear = doorPivotRear;
      truck.userData.doorPivotFront = doorPivotFront;
      truck.userData.setDoorOpenRatio = setDoorOpenRatio;

      // 8. Interior Cargo Bay
      [-1.5, 1.5, 4.5].forEach(function (lz) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        lamp.position.set(0, 6.05, lz);
        truck.add(lamp);
      });

      // Staged kraft carton boxes inside
      const deepCargo1 = createKraftRackBox();
      deepCargo1.position.set(1.3, 1.95, -2.5);
      truck.add(deepCargo1);

      const deepCargo2 = createKraftRackBox();
      deepCargo2.position.set(1.3, 1.95, 4.0);
      truck.add(deepCargo2);

      // 9. Modern Royal Blue Truck Cab (Matching Reference Image media_1792665338934)
      const cabGroup = new THREE.Group();
      cabGroup.position.set(0, 0, 9.4);

      // (a) Main Lower Cab Body
      const cabBody = new THREE.Mesh(new THREE.BoxGeometry(5.1, 3.8, 3.2), cabMat);
      cabBody.position.set(0, 2.70, 0);
      cabGroup.add(cabBody);

      // (b) Stepped Aero Roof Spoiler (Wind Deflector on Cab Roof per Photo!)
      const aeroRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.18, 2.4), cabMat);
      aeroRoof.position.set(0, 5.10, -0.2);
      cabGroup.add(aeroRoof);

      // (c) Charcoal Front Bumper
      const bumper = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.72, 0.55), bumperMat);
      bumper.position.set(0, 0.65, 1.55);
      cabGroup.add(bumper);

      // (d) Yellow Rectangular Headlights (Corner mounted above bumper)
      [-1.85, 1.85].forEach(function (hx) {
        const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.38, 0.08), headlightMat);
        headlight.position.set(hx, 1.25, 1.62);
        cabGroup.add(headlight);
      });

      // (e) Front Windshield (Dark Visor Tint Glass)
      const windshield = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.35, 0.12), darkGlassMat);
      windshield.position.set(0, 3.65, 1.62);
      cabGroup.add(windshield);

      // (f) Side Windows (Driver & Passenger Dark Tint Glass)
      [-2.57, 2.57].forEach(function (wx) {
        const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 1.6), darkGlassMat);
        sideWindow.position.set(wx, 3.65, 0.2);
        cabGroup.add(sideWindow);
      });

      truck.add(cabGroup);

      // 10. Chassis & Tandem Wheels (Matching Reference Image 2 Rear Axles + 1 Front Axle)
      const chassisBeams = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 18.4), chassisMat);
      chassisBeams.position.set(0, 1.05, 2.6);
      truck.add(chassisBeams);

      // Fuel Tank & Battery Box
      const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 2.6, 14), chromeMat);
      fuelTank.rotation.z = Math.PI / 2;
      fuelTank.position.set(2.35, 1.05, -0.6);
      truck.add(fuelTank);

      const battBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 1.2), chassisMat);
      battBox.position.set(-2.25, 1.05, -0.6);
      truck.add(battBox);

      // 6 Wheels: 1 Front Steering Axle + 2 Tandem Rear Axles (Per Reference Photo!)
      // Front axle at z = 9.4
      // Rear axle 1 at z = -2.2
      // Rear axle 2 at z = -4.5
      const wheels = [];
      const axlePositions = [-4.5, -2.2, 9.4];

      axlePositions.forEach(function (zPos) {
        [-2.65, 2.65].forEach(function (xPos) {
          const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.58, 20), chassisMat);
          wh.rotation.z = Math.PI / 2;
          wh.position.set(xPos, 0.92, zPos);
          truck.add(wh);
          wheels.push(wh);
        });
      });
      truck.userData.wheels = wheels;

      // 11. Loaded Pallets Group (Positioned inside the open doorway on truck bed!)
      const loadedPalletsGroup = new THREE.Group();
      loadedPalletsGroup.position.set(0, 1.46, 0.4);
      truck.add(loadedPalletsGroup);
      truck.userData.loadedPalletsGroup = loadedPalletsGroup;

      return truck;
    }
