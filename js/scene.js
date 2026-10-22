/* =========================================================================
       4. THREE.JS SCENE, RACKS & REALISTIC INDUSTRIAL MACHINE BUILDERS
       ========================================================================= */
    const canvasEl = document.getElementById('viewportCanvas');
    const overlayEl = document.getElementById('overlayLayer');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 750);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    function getCssVar(name, fallback) {
      if (!window.getComputedStyle) return fallback;
      const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return val || fallback;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.84);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.40);
    dirLight.position.set(70, 130, 85);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 360;
    dirLight.shadow.camera.left = -140;
    dirLight.shadow.camera.right = 140;
    dirLight.shadow.camera.top = 85;
    dirLight.shadow.camera.bottom = -85;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.025;
    dirLight.shadow.radius = 2.5;
    scene.add(dirLight);

    function applyShadowFlags(rootObj) {
      if (!rootObj) return;
      rootObj.traverse(function (child) {
        if (!child.isMesh) return;
        const isGround = (child === sceneObjects.floorGround);
        const isZoneFloor = sceneObjects.zoneFloors && Object.values(sceneObjects.zoneFloors).indexOf(child) !== -1;
        const isFloorStripe = (child.geometry && child.geometry.parameters &&
          child.geometry.parameters.height !== undefined &&
          child.geometry.parameters.height <= 0.05 &&
          child.position.y <= 0.25);
        if (isGround || isZoneFloor || isFloorStripe) {
          child.receiveShadow = true;
          child.castShadow = false;
        } else {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    // Custom Orbit / Zoom Camera State tailored for the wide linear layout
    const camControl = {
      target: new THREE.Vector3(0, 0, 0),
      desiredTarget: new THREE.Vector3(0, 0, 0),
      spherical: { radius: 118, theta: 0.12, phi: 0.90 },
      desiredSpherical: { radius: 118, theta: 0.12, phi: 0.90 },
      isDragging: false,
      isPanning: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0
    };

    function syncCameraPosition() {
      camControl.target.lerp(camControl.desiredTarget, 0.12);
      camControl.spherical.radius += (camControl.desiredSpherical.radius - camControl.spherical.radius) * 0.12;
      camControl.spherical.theta += (camControl.desiredSpherical.theta - camControl.spherical.theta) * 0.12;
      camControl.spherical.phi += (camControl.desiredSpherical.phi - camControl.spherical.phi) * 0.12;

      const r = camControl.spherical.radius;
      const phi = Math.max(0.25, Math.min(1.42, camControl.spherical.phi));
      const theta = camControl.spherical.theta;

      camera.position.x = camControl.target.x + r * Math.sin(phi) * Math.sin(theta);
      camera.position.y = camControl.target.y + r * Math.cos(phi);
      camera.position.z = camControl.target.z + r * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(camControl.target);
    }
    syncCameraPosition();

    function focusCameraOnTarget(targetKey) {
      if (targetKey === 'ALL') {
        camControl.desiredTarget.set(0, 0, 0);
        camControl.desiredSpherical.radius = 118;
        camControl.desiredSpherical.theta = 0.12;
        camControl.desiredSpherical.phi = 0.90;
      } else if (targetKey === 'STEP_FG') {
        camControl.desiredTarget.set(51, 2.0, 0);
        camControl.desiredSpherical.radius = 42;
        camControl.desiredSpherical.phi = 0.82;
        camControl.desiredSpherical.theta = 0.16;
      } else if (targetKey === 'STEP_DELIVERED') {
        camControl.desiredTarget.set(81, 2.0, -4);
        camControl.desiredSpherical.radius = 44;
        camControl.desiredSpherical.phi = 0.80;
        camControl.desiredSpherical.theta = 0.22;
      } else if (ZONES_CONFIG[targetKey]) {
        const zc = ZONES_CONFIG[targetKey].center;
        if (targetKey === 'ZONE_PRD_WH') {
          camControl.desiredTarget.set(zc[0], 2.0, zc[2] + 2.5);
          camControl.desiredSpherical.radius = 38;
          camControl.desiredSpherical.phi = 0.82;
          camControl.desiredSpherical.theta = 0.18;
        } else if (targetKey === 'ZONE_RM') {
          camControl.desiredTarget.set(zc[0], 1.5, zc[2]);
          camControl.desiredSpherical.radius = 56;
          camControl.desiredSpherical.phi = 0.86;
          camControl.desiredSpherical.theta = 0.16;
        } else if (targetKey === 'ZONE_FG') {
          camControl.desiredTarget.set(zc[0], 1.5, zc[2]);
          camControl.desiredSpherical.radius = 56;
          camControl.desiredSpherical.phi = 0.86;
          camControl.desiredSpherical.theta = 0.16;
        } else {
          camControl.desiredTarget.set(zc[0], 0, zc[2]);
          camControl.desiredSpherical.radius = (targetKey === 'ZONE_PRD') ? 78 : 56;
          camControl.desiredSpherical.phi = 0.86;
          camControl.desiredSpherical.theta = 0.14;
        }
      } else if (STATION_MAP[targetKey]) {
        const sp = STATION_MAP[targetKey].pos;
        const isBlown = (targetKey === 'ST_BLOWN');
        camControl.desiredTarget.set(sp[0], isBlown ? 2.5 : 1.8, sp[2]);
        camControl.desiredSpherical.radius = isBlown ? 38 : 32;
        camControl.desiredSpherical.phi = 0.78;
        camControl.desiredSpherical.theta = 0.16;
      }
    }

    const sceneObjects = {
      floorGround: null,
      roadMesh: null,
      zoneFloors: {},
      zoneBorders: {},
      selectableMeshes: [],
      rmVisualGroups: {},
      stationObjs: {},
      dynamicRollRefs: {
        printUnwindRoll: null,
        printUnwindWebs: [],
        bagUnwindRolls: []
      },
      fgRackSlots: [],
      fgStoredMeshes: [],
      rmForklift: null,
      fgForklift: null,
      deliveryForklift: null,
      handPalletTruck: null,
      containerTruck: null,
      labels3D: []
    };


    function registerLabel3D(textHtml, worldPosVec3, cssClass, clickTargetKey) {
      const div = document.createElement('div');
      div.className = 'tag-3d ' + (cssClass || '');
      div.innerHTML = textHtml;
      if (clickTargetKey) {
        div.addEventListener('click', function (ev) {
          ev.stopPropagation();
          selectZoneOrStation(clickTargetKey);
        });
      }
      overlayEl.appendChild(div);
      const item = {
        el: div,
        pos: worldPosVec3.clone(),
        followObj: null,
        offsetY: 0,
        isMaterialTag: cssClass && (cssClass.indexOf('tag-rm') !== -1 || cssClass.indexOf('tag-io') !== -1 || cssClass.indexOf('tag-pallet') !== -1),
        visible: true
      };
      sceneObjects.labels3D.push(item);
      return item;
    }


    function buildFactoryScene() {
      scene.background = new THREE.Color(getCssVar('--scene-sky', '#e8eff7'));

      // Build unified concrete industrial floor, flush zone slabs, safety demarcations & highway
      buildFactoryFloorSystem(scene, ZONES_CONFIG, sceneObjects, getCssVar, registerLabel3D);

      /* =========================================================================
         BUILD ZONE 1: RM WH (4 SUB-WAREHOUSES MATCHING REFERENCE IMAGE)
         - Top-Left (NW): Cylinder WH (Selective rack + 8 vertical black cylinders)
         - Top-Right (NE): Chemical WH (4 dark drums + 2 green drums + 4 yellow/orange drums)
         - Bottom-Left (SW): Supplies Used WH (Rack with 4 paper cores + 2 carton boxes + spout tray)
         - Bottom-Right (SE): Resin & Film Storage (Stacked resin sacks + 6 vertical standing film rolls)
         - Yellow floor boundary boxes & cross-aisle demarcations
         ========================================================================= */

      const rmGroup = new THREE.Group();
      scene.add(rmGroup);

      const rmLineMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const whiteMat   = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const bluePostMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
      const orangeBeamMat = new THREE.MeshLambertMaterial({ color: 0xf97316 });

      // Helper: Draw rectangular yellow border line on concrete floor using reusable floor module
      function addFloorRect(xMin, xMax, zMin, zMax) {
        rmGroup.add(createFlatFloorRect(xMin, xMax, zMin, zMax, 0xfacc15, 0.22, 0.015));
      }

      // Yellow boundary boxes for the 4 quadrants (matching reference image)
      addFloorRect(-79, -65, -20, -3); // Cylinder WH (NW)
      addFloorRect(-61, -47, -20, -3); // Chemical WH (NE)
      addFloorRect(-79, -65,   3, 20); // Supplies Used WH (SW)
      addFloorRect(-61, -47,   3, 20); // Resin & Film Storage (SE)

      // 4 Main 3D Floating Tags (matching reference image pills)
      registerLabel3D('Cylinder WH', new THREE.Vector3(-72, 6.4, -11.5), 'tag-zone', 'ZONE_RM');
      registerLabel3D('Chemical WH', new THREE.Vector3(-54, 6.4, -11.5), 'tag-zone', 'ZONE_RM');
      registerLabel3D('Supplies Used WH', new THREE.Vector3(-72, 6.4, 11.5), 'tag-zone', 'ZONE_RM');
      registerLabel3D('Resin & Film Storage', new THREE.Vector3(-54, 6.4, 11.5), 'tag-zone', 'ZONE_RM');

      // 1. CYLINDER WH (NW Quadrant: Selective rack + 8 vertical black cylinders)
      const cylRackGroup = new THREE.Group();
      cylRackGroup.position.set(-72, 0.0, -11.5);

      // 4 Blue upright corner posts
      [[-3.8, -3.2], [3.8, -3.2], [-3.8, 3.2], [3.8, 3.2]].forEach(function (pt) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.4, 0.32), bluePostMat);
        post.position.set(pt[0], 2.2, pt[1]);
        cylRackGroup.add(post);
      });

      // Orange horizontal beams
      [-3.2, 3.2].forEach(function (zOff) {
        const bmLow = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.22, 0.14), orangeBeamMat);
        bmLow.position.set(0, 1.25, zOff);
        cylRackGroup.add(bmLow);
        const bmHigh = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.22, 0.14), orangeBeamMat);
        bmHigh.position.set(0, 2.65, zOff);
        cylRackGroup.add(bmHigh);
      });
      [-3.8, 3.8].forEach(function (xOff) {
        const sideLow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 6.4), orangeBeamMat);
        sideLow.position.set(xOff, 1.25, 0);
        cylRackGroup.add(sideLow);
        const sideHigh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 6.4), orangeBeamMat);
        sideHigh.position.set(xOff, 2.65, 0);
        cylRackGroup.add(sideHigh);
      });

      // White storage deck platform
      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.14, 6.2), whiteMat);
      deckMesh.position.set(0, 1.95, 0);
      cylRackGroup.add(deckMesh);

      // 8 Vertical Black Gravure Printing Cylinders (2 rows of 4 cylinders)
      const cylMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.28 });
      const cylMeshes = [];
      [-1.4, 1.4].forEach(function (zOff) {
        [-2.7, -0.9, 0.9, 2.7].forEach(function (xOff) {
          const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 4.2, 18), cylMat);
          cyl.position.set(xOff, 2.3, zOff);
          cylRackGroup.add(cyl);
          cylMeshes.push(cyl);
        });
      });
      rmGroup.add(cylRackGroup);

      sceneObjects.rmVisualGroups.CYLINDER = {
        group: cylRackGroup,
        pallets: cylMeshes
      };

      // 2. CHEMICAL WH (NE Quadrant: 4 dark drums + 2 green drums + 4 yellow/orange drums)
      const chemGroup = new THREE.Group();
      chemGroup.position.set(-54, 0.0, -11.5);

      // (a) 4 Large Navy / Dark Slate Drums (2x2 grid at back-left: Base Ink & Solvent)
      const navyMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const inkDrums = [];
      [[-3.8, -3.8], [-1.8, -3.8], [-3.8, -1.8], [-1.8, -1.8]].forEach(function (pt) {
        const dGroup = new THREE.Group();
        dGroup.position.set(pt[0], 0, pt[1]);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.85, 18), navyMat);
        body.position.y = 0.92;
        dGroup.add(body);
        const rimTop = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.08, 18), navyMat);
        rimTop.position.y = 1.84;
        dGroup.add(rimTop);
        const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 10), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
        plug.position.set(0.4, 1.88, 0.2);
        dGroup.add(plug);
        chemGroup.add(dGroup);
        inkDrums.push(dGroup);
      });

      // (b) 2 Green / Teal Drums (Solvent / Adhesive at back-right)
      const greenMat = new THREE.MeshLambertMaterial({ color: 0x10b981 });
      const solventDrums = [];
      [[2.2, -3.5], [2.2, -1.8]].forEach(function (pt) {
        const dGroup = new THREE.Group();
        dGroup.position.set(pt[0], 0, pt[1]);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.55, 16), greenMat);
        body.position.y = 0.77;
        dGroup.add(body);
        const rimTop = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 16), greenMat);
        rimTop.position.y = 1.54;
        dGroup.add(rimTop);
        chemGroup.add(dGroup);
        solventDrums.push(dGroup);
      });

      // (c) Front row of 4 Yellow & Orange Drums (Specialty / Mixed / Adhesive)
      const frontColors = [0xfacc15, 0xfacc15, 0xf97316, 0xc2410c];
      const frontX = [-4.0, -2.4, -0.8, 0.8];
      const adhDrums = [];
      frontX.forEach(function (fx, idx) {
        const dGroup = new THREE.Group();
        dGroup.position.set(fx, 0, 2.8);
        const colMat = new THREE.MeshLambertMaterial({ color: frontColors[idx] });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.45, 16), colMat);
        body.position.y = 0.72;
        dGroup.add(body);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.71, 0.71, 0.06, 16), colMat);
        rim.position.y = 1.44;
        dGroup.add(rim);
        chemGroup.add(dGroup);
        adhDrums.push(dGroup);
      });
      rmGroup.add(chemGroup);

      sceneObjects.rmVisualGroups.RM_INK = { group: chemGroup, pallets: inkDrums };
      sceneObjects.rmVisualGroups.SOLVENT = { group: chemGroup, pallets: solventDrums };
      sceneObjects.rmVisualGroups.ADHESIVE = { group: chemGroup, pallets: adhDrums.slice(0, 2) };
      sceneObjects.rmVisualGroups.MIXED_INK = { group: chemGroup, pallets: adhDrums.slice(2) };

      // 3. SUPPLIES USED WH (SW Quadrant: Industrial Rack Row with Paper Cores + Floor Box Stacks matching User Reference Image)
      const supGroup = new THREE.Group();
      supGroup.position.set(-72, 0.0, 11.5);

      // (a) Industrial Multi-Tier Storage Rack (1 Row of Racks on the Left side, local x = -3.2, z = 0.0)
      const supRack = new THREE.Group();
      supRack.position.set(-3.2, 0, 0);

      const rW = 4.4; // width along X
      const rD = 2.8; // depth along Z
      const rH = 4.2; // rack height

      // 4 Blue upright corner posts (0x1d4ed8)
      [[-rW / 2 + 0.16, -rD / 2 + 0.16],
       [ rW / 2 - 0.16, -rD / 2 + 0.16],
       [-rW / 2 + 0.16,  rD / 2 - 0.16],
       [ rW / 2 - 0.16,  rD / 2 - 0.16]].forEach(function (pt) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, rH, 0.32), bluePostMat);
        post.position.set(pt[0], rH / 2, pt[1]);
        supRack.add(post);
      });

      // 3 Tiers of Orange Horizontal Load Beams & White Shelf Decks (matching reference image)
      const tierHeights = [1.15, 2.55, 3.95];
      tierHeights.forEach(function (yBm) {
        // Front & Back beams along X
        [-rD / 2 + 0.16, rD / 2 - 0.16].forEach(function (zB) {
          const bm = new THREE.Mesh(new THREE.BoxGeometry(rW, 0.22, 0.14), orangeBeamMat);
          bm.position.set(0, yBm, zB);
          supRack.add(bm);
        });
        // Left & Right side crossbeams along Z
        [-rW / 2 + 0.16, rW / 2 - 0.16].forEach(function (xB) {
          const sideBm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, rD - 0.32), orangeBeamMat);
          sideBm.position.set(xB, yBm, 0);
          supRack.add(sideBm);
        });
        // White shelf deck platform
        const deck = new THREE.Mesh(new THREE.BoxGeometry(rW - 0.28, 0.10, rD - 0.28), whiteMat);
        deck.position.set(0, yBm + 0.05, 0);
        supRack.add(deck);
      });

      // Brown Cardboard Paper Cores resting on Tier 1 and Tier 2 shelves
      const coreMat = new THREE.MeshLambertMaterial({ color: 0xc28b52 });
      const coreHoleMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const coreMeshes = [];

      function createStandingCore(x, y, z) {
        const coreGrp = new THREE.Group();
        coreGrp.position.set(x, y, z);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.15, 16), coreMat);
        body.position.y = 0.58;
        coreGrp.add(body);
        const innerHole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 14), coreHoleMat);
        innerHole.position.y = 1.16;
        coreGrp.add(innerHole);
        supRack.add(coreGrp);
        return coreGrp;
      }

      // Tier 1 (bottom shelf, y = 1.20): 2 rows of 3 cores
      [-1.3, 0, 1.3].forEach(function (cx) {
        [-0.65, 0.65].forEach(function (cz) {
          const c1 = createStandingCore(cx, 1.20, cz);
          coreMeshes.push(c1);
        });
      });

      // Tier 2 (middle shelf, y = 2.60): 2 rows of 3 cores
      [-1.3, 0, 1.3].forEach(function (cx) {
        [-0.65, 0.65].forEach(function (cz) {
          const c2 = createStandingCore(cx, 2.60, cz);
          coreMeshes.push(c2);
        });
      });

      supGroup.add(supRack);

      // (b) Stack of 3 Kraft Corrugated Cardboard Carton Boxes on the floor (matching reference image)
      // Placed directly on the concrete floor next to the rack: local x = 0.4, z = 0.0
      const boxMeshes = [];
      const bW = 2.4;
      const bD = 2.0;
      const bH = 0.52;

      for (let i = 0; i < 3; i++) {
        const bGrp = createKraftCartonBox(bW, bH, bD, 'z');
        bGrp.position.set(0.4, i * bH, 0);
        supGroup.add(bGrp);
        boxMeshes.push(bGrp);
      }

      // (c) Stack of 2 Kraft Carton Boxes (Spout Caps / Fitment cartons) on the floor
      // Placed directly on the concrete floor to the right of cardboard boxes: local x = 3.0, z = 0.0
      const spoutMeshes = [];
      const sW = 1.8;
      const sD = 1.6;
      const sH = 0.52;

      for (let j = 0; j < 2; j++) {
        const sGrp = createKraftCartonBox(sW, sH, sD, 'z');
        sGrp.position.set(3.0, j * sH, 0);
        supGroup.add(sGrp);
        spoutMeshes.push(sGrp);
      }
      rmGroup.add(supGroup);

      sceneObjects.rmVisualGroups.PAPERCORE = { group: supGroup, pallets: coreMeshes };
      sceneObjects.rmVisualGroups.BOX = { group: supGroup, pallets: boxMeshes };
      sceneObjects.rmVisualGroups.SPOUT = { group: supGroup, pallets: spoutMeshes };

      // 4. RESIN & FILM STORAGE (SE Quadrant: Stacked resin sacks + 6 vertical standing film rolls)
      const rfGroup = new THREE.Group();
      rfGroup.position.set(-54, 0.0, 11.5);

      // (a) Polymer Resin Bags (Realistic horizontal sacks stacked on wooden pallets matching user reference)
      const resinMeshes = [];
      // Pallet 1 (Front Stack at z = 2.4)
      const resinPallet1 = createPalletBaseMesh();
      resinPallet1.position.set(-2.6, 0, 2.4);
      buildResinSackPalletLayers(resinPallet1, 0.26);
      rfGroup.add(resinPallet1);
      resinMeshes.push(resinPallet1);

      // Pallet 2 (Rear Stack at z = -0.2)
      const resinPallet2 = createPalletBaseMesh();
      resinPallet2.position.set(-2.6, 0, -0.2);
      buildResinSackPalletLayers(resinPallet2, 0.26);
      rfGroup.add(resinPallet2);
      resinMeshes.push(resinPallet2);

      // Helper for vertical film rolls standing upright
      function createUprightRoll(colHex, xPos, zPos) {
        const rollGrp = new THREE.Group();
        rollGrp.position.set(xPos, 0, zPos);
        const rMat = new THREE.MeshLambertMaterial({ color: colHex });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.80, 0.80, 2.4, 20), rMat);
        body.position.y = 1.2;
        rollGrp.add(body);
        const innerHole = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 14), coreHoleMat);
        innerHole.position.y = 2.41;
        rollGrp.add(innerHole);
        rfGroup.add(rollGrp);
        return rollGrp;
      }

      // (b) 2 White Vertical Film Rolls (Purchased / Base Film)
      const rWhite1 = createUprightRoll(0xf8fafc, 0.2, 0.2);
      const rWhite2 = createUprightRoll(0xf8fafc, 0.2, 3.4);
      const purMeshes = [rWhite1, rWhite2];

      // (c) 2 White Vertical Film Rolls (Blown Film: Must be pure white before Printing)
      const rBlue1 = createUprightRoll(0xf8fafc, 2.2, -1.8);
      const rBlue2 = createUprightRoll(0xf8fafc, 2.2, 1.4);
      const blownMeshes = [rBlue1, rBlue2];

      // (d) 2 Pastel Lavender / Light Purple Vertical Film Rolls (Laminate Film)
      const rPurp1 = createUprightRoll(0xc4b5fd, 4.0, 0.2);
      const rPurp2 = createUprightRoll(0xc4b5fd, 4.0, 3.4);
      const lamMeshes = [rPurp1, rPurp2];

      rmGroup.add(rfGroup);

      sceneObjects.rmVisualGroups.RESIN = { group: rfGroup, pallets: resinMeshes };
      sceneObjects.rmVisualGroups.PURCHASED_FILM = { group: rfGroup, pallets: purMeshes };
      sceneObjects.rmVisualGroups.BLOWN_FILM = { group: rfGroup, pallets: blownMeshes };
      sceneObjects.rmVisualGroups.LAMINATE_FILM = { group: rfGroup, pallets: lamMeshes };

      // Build Zone 2: 7 PRD Process Stations in 2 Rows with dedicated Infeed & Outfeed bays (User Request)
      STATIONS_CONFIG.forEach(function (st) {
        const stGroup = new THREE.Group();
        stGroup.position.set(st.pos[0], 0.0, st.pos[2]);

        const isRow1 = (st.pos[2] < 0);

        // Station base pad removed as requested by user (Requirement 4)

        // Dedicated Infeed & Outfeed demarcation boxes placed side-by-side
        // directly on the concrete floor facing the Central Transit Corridor (world z = -5.2 for Row 1, +5.2 for Row 2)
        const bayLocalZ = isRow1 ? 6.8 : -6.8;

        // 1. INFEED BAY (Left yellow box: local x = -2.4 -> world x = st.pos[0] - 2.4)
        const infeedBay = createDemarcatedStationBay('INFEED', st.infeedMat || ['RESIN'], -2.4, bayLocalZ, isRow1, false);
        stGroup.add(infeedBay);

        // 2. MACHINE MODEL in center of station
        const rollers = [];
        const reciprocators = [];
        const extraWorkers = [];
        const machineModel = buildRealisticStationMachine(st, rollers, reciprocators, extraWorkers);
        stGroup.add(machineModel);

        // 3. OUTFEED BAY (Right green box: local x = +2.4 -> world x = st.pos[0] + 2.4)
        const outfeedBay = createDemarcatedStationBay('OUTFEED', st.outfeedMat || ['BLOWN_FILM'], 2.4, bayLocalZ, isRow1, false);
        stGroup.add(outfeedBay);

        // Status Beacon Light
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), beaconMat);
        beacon.position.set(5.8, 5.4, isRow1 ? -2.5 : 2.5);
        stGroup.add(beacon);

        // Primary Station Worker placed centered behind the two yellow demarcation boxes facing the central corridor
        let workerColor = 0xfacc15;
        let workerX = 0;
        let workerZ = isRow1 ? 4.8 : -4.8;
        if (st.id === 'ST_SLIT') {
          workerColor = 0x10b981; // Green shirt worker matching Slit reference image
          workerX = -0.4;
        } else if (st.id === 'ST_BAG') {
          workerColor = 0x2563eb; // Blue shirt worker next to kiosk
          workerX = 0.8;
        }
        const worker = createWorkerMesh(workerColor, 0xfacc15);
        worker.position.set(workerX, 0.0, workerZ);
        worker.rotation.y = isRow1 ? Math.PI : 0;
        stGroup.add(worker);

        scene.add(stGroup);

        const headerHeight = (st.id === 'ST_BLOWN') ? 10.2 : 6.6;
        const headerTag = registerLabel3D(
          st.stepNum + '. ' + st.name,
          new THREE.Vector3(st.pos[0], headerHeight, st.pos[2]),
          'tag-station',
          st.id
        );

        const inTag = registerLabel3D(
          'In: ' + st.inputSummary,
          new THREE.Vector3(st.pos[0] - 2.4, 2.4, isRow1 ? -5.2 : 5.2),
          'tag-io io-in',
          st.id
        );
        const outTag = registerLabel3D(
          'Out: ' + st.outputSummary,
          new THREE.Vector3(st.pos[0] + 2.4, 2.4, isRow1 ? -5.2 : 5.2),
          'tag-io io-out',
          st.id
        );

        sceneObjects.stationObjs[st.id] = {
          group: stGroup,
          baseMesh: null,
          infeedBay: infeedBay,
          outfeedBay: outfeedBay,
          rollers: rollers,
          reciprocators: reciprocators,
          extraWorkers: extraWorkers,
          beaconMat: beaconMat,
          worker: worker,
          headerTag: headerTag,
          inTag: inTag,
          outTag: outTag
        };
      });

      // Build PRD WH (Production Warehouse & Curing Area) in Row 2, Column 2 at x = -10, z = +12 (Reference Image Layout)
      const prdWhGroup = new THREE.Group();
      prdWhGroup.position.set(-10, 0.0, 12);

      // Pair of hollow bright yellow floor demarcation boxes facing Central Transit Corridor at world z = +5.2 (local z = -6.8)
      // Left yellow box (Infeed from Printing / Laminate)
      const prdBayIn = createDemarcatedStationBay('INFEED', ['PRINTING_ROLL'], -2.4, -6.8, false, false);
      prdWhGroup.add(prdBayIn);

      // Right yellow box (Outfeed to Laminate / Slit)
      const prdBayOut = createDemarcatedStationBay('OUTFEED', ['LAMINATE_ROLL'], 2.4, -6.8, false, false);
      prdWhGroup.add(prdBayOut);

      // Standing PRD WH Operator standing behind the yellow boxes facing the central corridor
      const prdWorker = createWorkerMesh(0xfacc15, 0xffffff);
      prdWorker.position.set(0, 0.0, -4.8);
      prdWorker.rotation.y = 0; // facing North towards corridor
      prdWhGroup.add(prdWorker);

      // Bright Yellow Equipment Base Pad covering selective racks and curing roll rack row
      const prdPadGeo = new THREE.BoxGeometry(14.8, 0.015, 5.6);
      const prdYellowPad = new THREE.Mesh(
        prdPadGeo,
        new THREE.MeshLambertMaterial({ color: 0xfacc15 })
      );
      prdYellowPad.position.set(0, 0.006, 2.25);
      prdYellowPad.receiveShadow = true;
      prdYellowPad.userData.selectKey = 'ZONE_PRD_WH';
      prdWhGroup.add(prdYellowPad);
      sceneObjects.selectableMeshes.push(prdYellowPad);

      // Helper: Euro Pallet with Burgundy Chemical Drums and White Graphic Wrap Labels
      function createEuroPalletWithDrums(drumCount) {
        const grp = new THREE.Group();
        const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
        const pallet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 1.9), woodMat);
        pallet.position.y = 0.07;
        grp.add(pallet);

        const blockMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
        [-0.88, 0, 0.88].forEach(function (bx) {
          const block = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 1.85), blockMat);
          block.position.set(bx, 0.04, 0);
          grp.add(block);
        });

        const count = drumCount || 2;
        const zOffsets = (count === 2) ? [-0.44, 0.44] : [0];
        zOffsets.forEach(function (zOff) {
          const drum = createBurgundyRackDrum();
          drum.position.set(0, 0.14, zOff);
          grp.add(drum);
        });
        return grp;
      }

      // Helper: Euro Pallet with Kraft Carton Boxes (Top Tier Storage)
      function createEuroPalletWithBoxes() {
        const grp = new THREE.Group();
        const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
        const pallet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 1.9), woodMat);
        pallet.position.y = 0.07;
        grp.add(pallet);
        const kBox = createKraftRackBox();
        kBox.position.set(0, 0.14, 0);
        grp.add(kBox);
        return grp;
      }

      // Helper: Euro Pallet with Standing Paper Cores (Top Tier Storage)
      function createEuroPalletWithCores() {
        const grp = new THREE.Group();
        const woodMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
        const pallet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 1.9), woodMat);
        pallet.position.y = 0.07;
        grp.add(pallet);
        const coreMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
        const holeMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
        [[-0.45, -0.4], [0.45, -0.4], [-0.45, 0.4], [0.45, 0.4]].forEach(function (cp) {
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.95, 14), coreMat);
          core.position.set(cp[0], 0.14 + 0.475, cp[1]);
          grp.add(core);
          const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), holeMat);
          hole.position.set(cp[0], 0.14 + 0.96, cp[1]);
          grp.add(hole);
        });
        return grp;
      }

      // Dual Side-by-Side Selective Industrial Racks (Facing forward, matching Reference Image)
      // Rack 1 (Left Rack)
      const prdRack1 = createIndustrialRackUnit(5.2, 2.6, 3.8, 0x1d4ed8, 0xf97316, 2);
      prdRack1.position.set(-3.2, 0.0, 1.0);
      prdRack1.rotation.y = 0;
      prdWhGroup.add(prdRack1);

      // Rack 1 Lower Tier (y = 0.93): Two pallets with Burgundy drums
      const pal1L = createEuroPalletWithDrums(2);
      pal1L.position.set(-1.25, 0.93, 0);
      prdRack1.add(pal1L);

      const pal1R = createEuroPalletWithDrums(2);
      pal1R.position.set(1.25, 0.93, 0);
      prdRack1.add(pal1R);

      // Rack 1 Upper Tier (y = 2.73): Pallet with Boxes & Pallet with Cores (User Request 1)
      const palTop1L = createEuroPalletWithBoxes();
      palTop1L.position.set(-1.25, 2.73, 0);
      prdRack1.add(palTop1L);

      const palTop1R = createEuroPalletWithCores();
      palTop1R.position.set(1.25, 2.73, 0);
      prdRack1.add(palTop1R);

      // Rack 2 (Right Rack)
      const prdRack2 = createIndustrialRackUnit(5.2, 2.6, 3.8, 0x1d4ed8, 0xf97316, 2);
      prdRack2.position.set(3.2, 0.0, 1.0);
      prdRack2.rotation.y = 0;
      prdWhGroup.add(prdRack2);

      // Rack 2 Lower Tier (y = 0.93): Two pallets with Burgundy drums
      const pal2L = createEuroPalletWithDrums(2);
      pal2L.position.set(-1.25, 0.93, 0);
      prdRack2.add(pal2L);

      const pal2R = createEuroPalletWithDrums(2);
      pal2R.position.set(1.25, 0.93, 0);
      prdRack2.add(pal2R);

      // Rack 2 Upper Tier (y = 2.73): Pallet with Drums & Pallet with Boxes (User Request 1)
      const palTop2L = createEuroPalletWithDrums(2);
      palTop2L.position.set(-1.25, 2.73, 0);
      prdRack2.add(palTop2L);

      const palTop2R = createEuroPalletWithBoxes();
      palTop2R.position.set(1.25, 2.73, 0);
      prdRack2.add(palTop2R);

      // Staging Roll Stand on Left with Flexible Packaging Printed Film Roll (Matching Reference Image)
      const rollStand = new THREE.Group();
      rollStand.position.set(-7.2, 0.0, 1.0);

      const standMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 2.2), standMat);
      standBase.position.y = 0.14;
      rollStand.add(standBase);

      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 1.25, 0.22), standMat);
      postL.position.set(0, 0.76, -0.92);
      rollStand.add(postL);

      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.20, 1.25, 0.22), standMat);
      postR.position.set(0, 0.76, 0.92);
      rollStand.add(postR);

      // Large Printed Packaging Film Roll with pink face & core (Authentic Hygiene Print Pattern)
      const rollFilmMat = new THREE.MeshStandardMaterial({
        map: getHygieneFilmTexture(),
        roughness: 0.28,
        metalness: 0.12
      });
      const rollFaceMat = new THREE.MeshLambertMaterial({ color: 0xfbcfe8 });
      const rollCoreMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

      const prdRollBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.12, 1.12, 1.65, 24),
        [rollFilmMat, rollFaceMat, rollFaceMat]
      );
      prdRollBody.rotation.x = Math.PI / 2;
      prdRollBody.position.set(0, 1.24, 0);
      rollStand.add(prdRollBody);

      const prdRollShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.15, 14), rollCoreMat);
      prdRollShaft.rotation.x = Math.PI / 2;
      prdRollShaft.position.set(0, 1.24, 0);
      rollStand.add(prdRollShaft);

      prdWhGroup.add(rollStand);

      // High-Bay Roll Curing Rack Row (Suspended horizontal master rolls)
      const curingRackRow1 = createRollCuringRackRow({
        baysCount: 4,
        tiersCount: 4,
        bayWidth: 2.6,
        depth: 1.85,
        height: 4.8,
        uprightColor: 0x1d4ed8,
        beamColor: 0xf97316
      });
      curingRackRow1.position.set(0, 0.0, 3.8);
      prdWhGroup.add(curingRackRow1);

      scene.add(prdWhGroup);

      // Build Zone 3 (Warehouse FG) Multi-Tier Industrial Storage Racks & Delivery Dock (Image 3 & 4 style)
      for (let row = 0; row < 3; row++) {
        const zPos = -13 + row * 9;
        const fgRackGroup = new THREE.Group();
        fgRackGroup.position.set(54, 0.0, zPos);

        const rackStruct = createIndustrialRackUnit(11.5, 3.6, 5.0, 0x1d4ed8, 0xf97316);
        fgRackGroup.add(rackStruct);

        // Middle & Top Shelves populated with Burgundy Drums & Kraft Boxes (Reference Image)
        // Level 2 (y = 2.40):
        const drum1 = createBurgundyRackDrum();
        drum1.position.set(-3.6, 2.48, -0.6);
        fgRackGroup.add(drum1);
        const drum2 = createBurgundyRackDrum();
        drum2.position.set(-2.2, 2.48, -0.6);
        fgRackGroup.add(drum2);

        const box1 = createKraftRackBox();
        box1.position.set(0.4, 2.48, 0);
        fgRackGroup.add(box1);
        const box2 = createKraftRackBox();
        box2.position.set(2.2, 2.48, 0);
        fgRackGroup.add(box2);

        // Level 3 (y = 3.90):
        const topBox1 = createKraftRackBox();
        topBox1.position.set(-3.0, 3.98, 0);
        fgRackGroup.add(topBox1);

        const topDrum1 = createBurgundyRackDrum();
        topDrum1.position.set(1.2, 3.98, -0.6);
        fgRackGroup.add(topDrum1);
        const topDrum2 = createBurgundyRackDrum();
        topDrum2.position.set(2.6, 3.98, -0.6);
        fgRackGroup.add(topDrum2);

        scene.add(fgRackGroup);

        // Lower deck slots for live FG order storage
        sceneObjects.fgRackSlots.push(
          new THREE.Vector3(51.2, 0.95, zPos),
          new THREE.Vector3(56.8, 0.95, zPos)
        );
      }

      // Open Concrete Truck Loading Yard (Level Ground - No Bays, No Elevated Platform, No Roads)
      const truckYardGroup = new THREE.Group();
      scene.add(truckYardGroup);

      // Yellow painted truck parking stall boundary directly on concrete floor
      const stallBorderMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const stallWhiteMat  = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

      // Staging / Parking box border lines around truck at x = 81, z = -4
      const lineN = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.01, 0.22), stallBorderMat);
      lineN.position.set(81, 0.015, -12);
      lineN.receiveShadow = true;
      truckYardGroup.add(lineN);

      const lineS = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.01, 0.22), stallBorderMat);
      lineS.position.set(81, 0.015, 8);
      lineS.receiveShadow = true;
      truckYardGroup.add(lineS);

      const lineE = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 20.2), stallBorderMat);
      lineE.position.set(85.1, 0.015, -2);
      lineE.receiveShadow = true;
      truckYardGroup.add(lineE);

      const lineW = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 20.2), stallBorderMat);
      lineW.position.set(76.9, 0.015, -2);
      lineW.receiveShadow = true;
      truckYardGroup.add(lineW);

      // Yellow wheel stop curbs on concrete behind truck rear
      [-2.2, 2.2].forEach(function (offset) {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.35), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
        curb.position.set(81 + offset, 0.11, -11.6);
        truckYardGroup.add(curb);
      });

      // Landscaped Perimeter Tree Clusters (User Request: 3 clustered groves on the exterior perimeter)
      function createPerimeterTreeCluster(centerX, centerZ, rotAngle) {
        const cluster = new THREE.Group();
        cluster.position.set(centerX, 0.12, centerZ);
        cluster.rotation.y = rotAngle || 0;

        // 1. Organic landscaped turf bed / green garden mound
        const turfMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
        const turfBed = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 6.4, 0.10, 24), turfMat);
        turfBed.position.y = 0.05;
        turfBed.receiveShadow = true;
        cluster.add(turfBed);

        const innerSoilMat = new THREE.MeshLambertMaterial({ color: 0x166534 });
        const innerMound = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 0.08, 24), innerSoilMat);
        innerMound.position.y = 0.09;
        innerMound.receiveShadow = true;
        cluster.add(innerMound);

        // Curbs / stone border ring
        const curbMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
        const curbRing = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.6, 0.08, 24), curbMat);
        curbRing.position.y = 0.04;
        cluster.add(curbRing);

        // Trunk & foliage materials with distinct natural shades
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
        const foliageMats = [
          new THREE.MeshLambertMaterial({ color: 0x059669 }), // Rich emerald
          new THREE.MeshLambertMaterial({ color: 0x10b981 }), // Vibrant jade
          new THREE.MeshLambertMaterial({ color: 0x047857 }), // Deep forest
          new THREE.MeshLambertMaterial({ color: 0x34d399 }), // Fresh spring green
          new THREE.MeshLambertMaterial({ color: 0x16a34a })  // Classic leaf green
        ];

        // 2. Clustered Trees of varying heights, sizes & orientations
        const treeDefs = [
          { x: -1.6, z: -1.0, trunkH: 2.8, r: 1.85, sy: 1.45, matIdx: 0 },
          { x:  1.8, z: -0.6, trunkH: 2.2, r: 1.55, sy: 1.40, matIdx: 1 },
          { x: -0.6, z:  1.9, trunkH: 2.4, r: 1.65, sy: 1.42, matIdx: 2 },
          { x:  2.1, z:  1.4, trunkH: 1.8, r: 1.30, sy: 1.35, matIdx: 3 },
          { x: -2.4, z:  1.0, trunkH: 1.6, r: 1.25, sy: 1.32, matIdx: 4 }
        ];

        treeDefs.forEach(function (td) {
          const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.20, 0.28, td.trunkH, 8),
            trunkMat
          );
          trunk.position.set(td.x, td.trunkH / 2 + 0.1, td.z);
          trunk.castShadow = true;
          trunk.receiveShadow = true;
          cluster.add(trunk);

          const fol = new THREE.Mesh(
            new THREE.SphereGeometry(td.r, 14, 12),
            foliageMats[td.matIdx]
          );
          fol.scale.set(1.0, td.sy, 1.0);
          fol.position.set(td.x, td.trunkH + td.r * td.sy * 0.72 + 0.05, td.z);
          fol.castShadow = true;
          fol.receiveShadow = true;
          cluster.add(fol);
        });

        // 3. Low decorative shrub spheres scattered on the green bed
        const shrubDefs = [
          { x: -2.8, z: -1.6, r: 0.85, matIdx: 0 },
          { x:  0.8, z: -2.6, r: 0.72, matIdx: 1 },
          { x:  2.9, z: -0.8, r: 0.65, matIdx: 3 },
          { x:  0.2, z:  0.3, r: 0.55, matIdx: 4 }
        ];

        shrubDefs.forEach(function (sd) {
          const shrub = new THREE.Mesh(
            new THREE.SphereGeometry(sd.r, 10, 8),
            foliageMats[sd.matIdx]
          );
          shrub.scale.set(1.0, 0.85, 1.0);
          shrub.position.set(sd.x, sd.r * 0.85 + 0.08, sd.z);
          shrub.castShadow = true;
          shrub.receiveShadow = true;
          cluster.add(shrub);
        });

        scene.add(cluster);
      }

      // 2 Exterior Perimeter Spots (Northwest and Northeast) - Front (South) removed per user request
      createPerimeterTreeCluster(-65, -33, 0.2);   // Spot 1: Northwest exterior (behind RM WH)
      createPerimeterTreeCluster( 65, -33, -0.4);  // Spot 2: Northeast exterior (behind Warehouse FG)

      // Container Truck parked on level concrete floor (Direct forklift loading)
      const truck = createContainerTruckMesh();
      truck.position.set(81, 0.0, -4);
      scene.add(truck);
      sceneObjects.containerTruck = truck;

      const truckLabel = registerLabel3D(
        'Container Truck (Loading Yard)',
        new THREE.Vector3(81, 7.2, -4),
        'tag-zone',
        'ZONE_FG'
      );
      truckLabel.followObj = truck;
      truckLabel.offsetY = 7.0;

      registerLabel3D(
        'Truck Loading Yard',
        new THREE.Vector3(81, 9.4, -4),
        'tag-zone',
        'ZONE_FG'
      );

      // Material Handling Fleet placed along dedicated Central Transit Corridor lanes
      // Westbound North Lane (z = -1.8) for RM Forklift; Eastbound South Lane (z = +1.8) for Hand Pallet Truck
      sceneObjects.rmForklift = createForkliftMesh(0xf59e0b);
      sceneObjects.rmForklift.position.set(-45, 0.0, -1.8);
      sceneObjects.rmForklift.rotation.y = Math.PI; // facing West
      scene.add(sceneObjects.rmForklift);

      sceneObjects.fgForklift = createForkliftMesh(0x10b981);
      sceneObjects.fgForklift.position.set(45, 0.0, 1.8);
      sceneObjects.fgForklift.rotation.y = 0; // facing East
      scene.add(sceneObjects.fgForklift);

      sceneObjects.deliveryForklift = createForkliftMesh(0x3b82f6);
      sceneObjects.deliveryForklift.position.set(63, 0.0, -4);
      scene.add(sceneObjects.deliveryForklift);

      sceneObjects.handPalletTruck = createHandPalletTruckMesh();
      sceneObjects.handPalletTruck.position.set(-10, 0.0, 1.8);
      sceneObjects.handPalletTruck.rotation.y = 0; // facing East
      scene.add(sceneObjects.handPalletTruck);

      [
        { veh: sceneObjects.rmForklift },
        { veh: sceneObjects.fgForklift },
        { veh: sceneObjects.deliveryForklift },
        { veh: sceneObjects.handPalletTruck }
      ].forEach(function (vItem) {
        const tag = registerLabel3D('', new THREE.Vector3(), 'tag-pallet', null);
        tag.followObj = vItem.veh;
        tag.offsetY = 3.6;
        tag.visible = false;
        vItem.veh.userData.palletTag = tag;
      });

      // Apply realistic contact shadow flags across all factory scene objects
      applyShadowFlags(scene);
    }

    function setupCameraAndPointerControls() {
      const raycaster = new THREE.Raycaster();
      const pointerNDC = new THREE.Vector2();

      canvasEl.addEventListener('pointerdown', function (ev) {
        camControl.isDragging = true;
        camControl.isPanning = (ev.button === 2 || ev.shiftKey);
        camControl.startX = ev.clientX;
        camControl.startY = ev.clientY;
        camControl.lastX = ev.clientX;
        camControl.lastY = ev.clientY;
      });

      window.addEventListener('pointermove', function (ev) {
        if (!camControl.isDragging) return;
        const dx = ev.clientX - camControl.lastX;
        const dy = ev.clientY - camControl.lastY;
        camControl.lastX = ev.clientX;
        camControl.lastY = ev.clientY;

        if (camControl.isPanning) {
          camControl.desiredTarget.x -= dx * 0.14;
          camControl.desiredTarget.z -= dy * 0.14;
        } else {
          camControl.desiredSpherical.theta -= dx * 0.0065;
          camControl.desiredSpherical.phi = Math.max(
            0.28,
            Math.min(1.38, camControl.desiredSpherical.phi - dy * 0.0055)
          );
        }
      });

      window.addEventListener('pointerup', function (ev) {
        if (!camControl.isDragging) return;
        const movedDist = Math.hypot(ev.clientX - camControl.startX, ev.clientY - camControl.startY);
        camControl.isDragging = false;

        if (movedDist < 5 && ev.target === canvasEl) {
          const rect = canvasEl.getBoundingClientRect();
          pointerNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
          pointerNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointerNDC, camera);
          const hits = raycaster.intersectObjects(sceneObjects.selectableMeshes, false);
          if (hits.length > 0 && hits[0].object.userData.selectKey) {
            selectZoneOrStation(hits[0].object.userData.selectKey);
          }
        }
      });

      canvasEl.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });

      canvasEl.addEventListener('wheel', function (ev) {
        ev.preventDefault();
        camControl.desiredSpherical.radius = Math.max(
          26,
          Math.min(210, camControl.desiredSpherical.radius + ev.deltaY * 0.07)
        );
      }, { passive: false });

      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
