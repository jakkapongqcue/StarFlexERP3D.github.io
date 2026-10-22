/* =========================================================================
   StarFlexERP 3D - Common Machine Components & Human Operators
   - Standard Factory Worker / Operator Model (Custom vest & hardhat colors)
   - Blue Machine HMI Control Kiosk
   - Active Rotating Film Roll Assembly (Unwinder & Rewinder shafts)
   - Running Film Web Span mesh
   - Turret Winder Stand Pairs
   ========================================================================= */

    function createWorkerMesh(vestColor, hatColor) {
      const worker = new THREE.Group();
      const legMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const vestMat = new THREE.MeshLambertMaterial({ color: vestColor || 0xfacc15 });
      const skinMat = new THREE.MeshLambertMaterial({ color: 0xfdba74 });
      const helmetMat = new THREE.MeshLambertMaterial({ color: hatColor || 0xffffff });
      const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
      const stripeMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });

      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.85, 0.34), legMat);
      legs.position.y = 0.42;
      worker.add(legs);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.90, 0.40), vestMat);
      torso.position.y = 1.30;
      worker.add(torso);

      // Silver reflective stripe on safety vest
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.12, 0.41), stripeMat);
      stripe.position.y = 1.25;
      worker.add(stripe);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 12), skinMat);
      head.position.y = 2.02;
      worker.add(head);

      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.33, 0.2, 12), helmetMat);
      hat.position.y = 2.18;
      worker.add(hat);

      // Royal blue long sleeves
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.70, 0.18), sleeveMat);
      leftArm.position.set(-0.42, 1.38, 0.12);
      worker.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.70, 0.18), sleeveMat);
      rightArm.position.set(0.42, 1.38, 0.12);
      worker.add(rightArm);

      worker.userData.leftArm = leftArm;
      worker.userData.rightArm = rightArm;
      return worker;
    }

    function createBlueControlKioskMesh() {
      const kiosk = new THREE.Group();
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
      const screenMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.3, 0.95), bodyMat);
      box.position.y = 1.15;
      kiosk.add(box);
      const scr = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.55, 0.06), screenMat);
      scr.position.set(0, 1.65, 0.48);
      kiosk.add(scr);
      return kiosk;
    }

    /* Helper: Create a realistic Unwinder / Rewinder Film Roll with core, chuck spokes, and surface stripes
       Oriented horizontally (rotation.x = Math.PI / 2) so rotating .rotation.y spins the roll around its Z axle! */
    function createActiveFilmRollAssembly(radius, width, filmColorHex, stripeColorHex, coreColorHex, customTexture, endColorHex) {
      const rollAssembly = new THREE.Group();
      rollAssembly.rotation.x = Math.PI / 2;

      let bodyMat;
      if (customTexture) {
        const sideMat = new THREE.MeshStandardMaterial({
          map: customTexture,
          roughness: 0.28,
          metalness: 0.12
        });
        const faceMat = new THREE.MeshLambertMaterial({ color: endColorHex || 0xfbcfe8 });
        bodyMat = [sideMat, faceMat, faceMat];
      } else {
        bodyMat = new THREE.MeshLambertMaterial({ color: filmColorHex });
      }

      const stripeMat = new THREE.MeshLambertMaterial({ color: stripeColorHex || 0xfacc15 });
      const coreMat = new THREE.MeshLambertMaterial({ color: coreColorHex || 0x1e293b });
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.3 });

      // Main cylindrical film roll body
      const rollBody = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 24), bodyMat);
      rollAssembly.add(rollBody);

      // Extended steel core shaft
      const coreShaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.30, radius * 0.30, width + 0.36, 16), coreMat);
      rollAssembly.add(coreShaft);

      // 4 longitudinal surface indicator bars so rotation is clearly visible from any camera angle
      if (!customTexture) {
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, width - 0.06, 0.06), stripeMat);
          bar.position.set(Math.cos(angle) * (radius + 0.015), 0, Math.sin(angle) * (radius + 0.015));
          bar.rotation.y = -angle;
          rollAssembly.add(bar);
        }
      }

      // Radial chuck spokes on both end faces of the roll
      [-width / 2 - 0.03, width / 2 + 0.03].forEach(function (yEnd) {
        const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.75, 0.04, 0.14), hubMat);
        spoke1.position.y = yEnd;
        rollAssembly.add(spoke1);

        const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, radius * 1.75), stripeMat);
        spoke2.position.y = yEnd;
        rollAssembly.add(spoke2);
      });

      return { group: rollAssembly, bodyMesh: rollBody, bodyMat: bodyMat, stripeMat: stripeMat };
    }

    /* Helper: Create a tense running film web span connecting two (x, y) points across the machine width */
    function createFilmWebSpan(x1, y1, x2, y2, zCenter, webWidth, colorHex, opacityVal) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const webMat = new THREE.MeshLambertMaterial({
        color: colorHex,
        transparent: opacityVal !== undefined && opacityVal < 1.0,
        opacity: opacityVal !== undefined ? opacityVal : 0.88
      });
      const webMesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, webWidth), webMat);
      webMesh.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, zCenter);
      webMesh.rotation.z = angle;
      return webMesh;
    }

    /* Helper: Create dual side support stands for an Unwinder or Rewinder station */
    function createWinderStandPair(xPos, zCenter, height, rollWidth, standMat) {
      const grp = new THREE.Group();
      const halfSpan = rollWidth / 2 + 0.16;
      [zCenter - halfSpan, zCenter + halfSpan].forEach(function (zArm) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, height, 0.24), standMat);
        post.position.set(xPos, 0.35 + height / 2, zArm);
        grp.add(post);

        const bearingCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.28, 12),
          new THREE.MeshLambertMaterial({ color: 0xf59e0b })
        );
        bearingCap.rotation.x = Math.PI / 2;
        bearingCap.position.set(xPos, 0.35 + height - 0.18, zArm);
        grp.add(bearingCap);
      });
      return grp;
    }

