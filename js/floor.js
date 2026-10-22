/* =========================================================================
   StarFlexERP 3D - Factory Floor & Demarcation System (js/floor.js)
   - Reusable Industrial Concrete Floor & Procedural Texture Generation
   - Flush Zone Floors (No stepped drop-offs or floating pedestals)
   - Flat Safety Floor Demarcations (Painted safety border striping)
   - Central Transit Corridor Dividing Highway Dashes
   - Reusable Floor Boundary Rectangles & Aisle Markings
   ========================================================================= */

/**
 * Generates a seamless procedural concrete texture with aggregate grain,
 * surface micro-specks, and subtle saw-cut expansion joint grooves.
 *
 * @param {Object} [options]
 * @param {number} [options.size=512] - Texture canvas resolution
 * @param {number} [options.grainIntensity=18] - Micro-grain variation (+/-)
 * @param {number} [options.speckCount=240] - Aggregate speckle count
 * @param {string} [options.baseColor='#e8edf3'] - Base concrete tone
 * @returns {THREE.CanvasTexture|null}
 */
function createConcreteCanvasTexture(options) {
  if (typeof document === 'undefined') return null;

  options = options || {};
  const size = options.size || 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Base industrial concrete fill (Bright clean concrete)
  ctx.fillStyle = options.baseColor || '#e8edf3';
  ctx.fillRect(0, 0, size, size);

  // 2. Procedural Aggregate Micro-Grain Noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  const intensity = options.grainIntensity !== undefined ? options.grainIntensity : 14;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * intensity;
    data[i]     = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Aggregate Sand & Gravel Specks
  const specks = options.speckCount !== undefined ? options.speckCount : 200;
  for (let s = 0; s < specks; s++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const r = Math.random() * 1.5 + 0.4;
    const isDark = Math.random() > 0.45;
    ctx.fillStyle = isDark ? 'rgba(71, 85, 105, 0.18)' : 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Subtle Saw-Cut Concrete Expansion Joints along tile perimeter
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.28)';
  ctx.lineWidth = 2.0;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  // Subtle beveled light reflection along the joint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
  ctx.lineWidth = 1.0;
  ctx.strokeRect(2.5, 2.5, size - 4, size - 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates the continuous foundation industrial concrete slab.
 *
 * @param {THREE.Scene} scene
 * @param {number} width - Total floor width (X axis, default 280)
 * @param {number} depth - Total floor depth (Z axis, default 140)
 * @param {string|number} colorHex - Floor tint color
 * @param {THREE.Texture} [concreteTexture] - Procedural concrete texture
 * @returns {THREE.Mesh}
 */
function createMainConcreteFloor(scene, width, depth, colorHex, concreteTexture) {
  width = width || 280;
  depth = depth || 140;

  const groundGeo = new THREE.PlaneGeometry(width, depth);
  const matParams = { color: colorHex };

  if (concreteTexture) {
    // Tile texture every ~10 meters for realistic concrete slab proportions
    const repeatX = Math.round(width / 10);
    const repeatZ = Math.round(depth / 10);
    concreteTexture.repeat.set(repeatX, repeatZ);
    matParams.map = concreteTexture;
  }

  const groundMat = new THREE.MeshLambertMaterial(matParams);
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, 0, 0); // Flat on ground level
  groundMesh.receiveShadow = true;

  if (scene) {
    scene.add(groundMesh);
  }
  return groundMesh;
}

/**
 * Creates flat safety painted floor demarcation borders around a zone or area.
 * Returns a THREE.Group with a shared material, supporting `.material.color.set()`
 * for dynamic theme color updates.
 *
 * @param {number[]|THREE.Vector3} center - [x, y, z] or [x, z]
 * @param {number[]} size - [width, depth]
 * @param {string|number} colorHex - Border stripe color
 * @param {number} [lineWidth=0.22] - Stripe width in meters
 * @param {number} [yPos=0.012] - Height above ground (meters)
 * @returns {THREE.Group}
 */
function createFlatFloorBorder(center, size, colorHex, lineWidth, yPos) {
  const group = new THREE.Group();
  const cX = center[0];
  const cZ = center.length === 3 ? center[2] : center[1];
  const w = size[0];
  const d = size[1];
  const thick = lineWidth || 0.22;
  const h = 0.01;
  const y = yPos !== undefined ? yPos : 0.012;

  const borderMat = new THREE.MeshLambertMaterial({ color: colorHex });
  group.material = borderMat; // Backwards compatibility for UI theme updates

  // North border
  const bN = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
  bN.position.set(cX, y, cZ - d / 2);
  bN.receiveShadow = true;
  group.add(bN);

  // South border
  const bS = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), borderMat);
  bS.position.set(cX, y, cZ + d / 2);
  bS.receiveShadow = true;
  group.add(bS);

  // West border
  const bW = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d), borderMat);
  bW.position.set(cX - w / 2, y, cZ);
  bW.receiveShadow = true;
  group.add(bW);

  // East border
  const bE = new THREE.Mesh(new THREE.BoxGeometry(thick, h, d), borderMat);
  bE.position.set(cX + w / 2, y, cZ);
  bE.receiveShadow = true;
  group.add(bE);

  return group;
}

/**
 * Creates a flat rectangular boundary box given min and max coordinates.
 * Replaces hardcoded quadrant/bay drawing in warehouses and workstations.
 *
 * @param {number} xMin
 * @param {number} xMax
 * @param {number} zMin
 * @param {number} zMax
 * @param {string|number} [colorHex=0xfacc15]
 * @param {number} [lineWidth=0.20]
 * @param {number} [yPos=0.015]
 * @returns {THREE.Group}
 */
function createFlatFloorRect(xMin, xMax, zMin, zMax, colorHex, lineWidth, yPos) {
  const w = xMax - xMin;
  const d = zMax - zMin;
  const xC = (xMin + xMax) / 2;
  const zC = (zMin + zMax) / 2;
  return createFlatFloorBorder([xC, zC], [w, d], colorHex || 0xfacc15, lineWidth || 0.20, yPos || 0.015);
}

/**
 * Creates the yellow dashed center dividing line down the central transit highway.
 *
 * @param {number} [xStart=-63]
 * @param {number} [xEnd=65]
 * @param {number} [step=5.0]
 * @param {number} [zPos=0.0]
 * @param {string|number} [colorHex=0xfacc15]
 * @param {number} [dashLength=2.8]
 * @param {number} [dashWidth=0.22]
 * @param {number} [yPos=0.015]
 * @returns {THREE.Group}
 */
function createCentralHighwayDashes(xStart, xEnd, step, zPos, colorHex, dashLength, dashWidth, yPos) {
  // Dashed highway markings removed per user request ("ลบเส้นประที่ทางเดินออกไปให้หมด")
  const group = new THREE.Group();
  return group;
}

/**
 * Creates a flush, level clickable zone floor mesh sitting cleanly on top of the
 * main concrete ground slab.
 *
 * @param {string} zKey - Zone configuration key (e.g. 'ZONE_RM', 'ZONE_PRD')
 * @param {Object} zCfg - Zone config with center and size
 * @param {string|number} colorHex - Zone floor color
 * @param {number} [yPos=0.003] - Vertical offset to avoid z-fighting
 * @returns {THREE.Mesh}
 */
function createZoneFloorMesh(zKey, zCfg, colorHex, yPos) {
  const y = yPos !== undefined ? yPos : 0.003;
  const fGeo = new THREE.PlaneGeometry(zCfg.size[0], zCfg.size[1]);
  const fMat = new THREE.MeshLambertMaterial({ color: colorHex });
  const fMesh = new THREE.Mesh(fGeo, fMat);
  fMesh.rotation.x = -Math.PI / 2;
  fMesh.position.set(zCfg.center[0], y, zCfg.center[2]);
  fMesh.receiveShadow = true;
  fMesh.userData.selectKey = zKey;
  return fMesh;
}

/**
 * High-level orchestrator: Builds the complete factory floor system.
 * Connects the main continuous slab, flush zone areas, flat safety demarcations,
 * highway markings, and zone labels.
 *
 * @param {THREE.Scene} scene
 * @param {Object} zonesConfig - ZONES_CONFIG object
 * @param {Object} sceneObjects - Global scene objects registry
 * @param {Function} getCssVar - CSS variable resolver helper
 * @param {Function} [registerLabel3D] - 3D HTML label registration callback
 * @returns {Object} { floorGround, zoneFloors, zoneBorders, centralHighway }
 */
function buildFactoryFloorSystem(scene, zonesConfig, sceneObjects, getCssVar, registerLabel3D) {
  // 1. Generate procedural seamless concrete texture (Light Industrial Concrete)
  const concreteTexture = createConcreteCanvasTexture({
    size: 512,
    grainIntensity: 14,
    speckCount: 200,
    baseColor: '#e8edf3'
  });

  // 2. Base continuous industrial concrete floor at Y = 0.0
  const groundColor = getCssVar('--scene-ground', '#dce3ec');
  const groundMesh = createMainConcreteFloor(scene, 280, 140, groundColor, concreteTexture);
  if (sceneObjects) {
    sceneObjects.floorGround = groundMesh;
  }

  // Zone CSS Variable mappings
  const zoneColorVars = {
    ZONE_RM:     { floor: '--zone-rm-floor',  border: '--zone-rm-border' },
    ZONE_PRD:    { floor: '--zone-prd-floor', border: '--zone-prd-border' },
    ZONE_PRD_WH: { floor: '--zone-prd-floor', border: '--zone-prd-border' },
    ZONE_FG:     { floor: '--zone-fg-floor',  border: '--zone-fg-border' }
  };

  const zoneFloors = {};
  const zoneBorders = {};

  // 3. Level flush zone floors and painted flat demarcation borders
  Object.keys(zonesConfig).forEach(function (zKey) {
    const zCfg = zonesConfig[zKey];
    const colorVars = zoneColorVars[zKey] || { floor: '--scene-ground', border: '--zone-prd-border' };
    const floorColor = getCssVar(colorVars.floor, '#d2dbe5');
    const borderColor = getCssVar(colorVars.border, '#facc15');

    // ZONE_PRD_WH sits slightly above ZONE_PRD to prevent z-fighting
    const isSubZone = (zKey === 'ZONE_PRD_WH');
    const floorY = isSubZone ? 0.006 : 0.003;
    const borderY = isSubZone ? 0.016 : 0.012;
    const borderWidth = isSubZone ? 0.16 : 0.22;

    // Flush clickable zone floor mesh
    const fMesh = createZoneFloorMesh(zKey, zCfg, floorColor, floorY);
    scene.add(fMesh);
    zoneFloors[zKey] = fMesh;

    if (sceneObjects) {
      sceneObjects.zoneFloors[zKey] = fMesh;
      if (sceneObjects.selectableMeshes) {
        sceneObjects.selectableMeshes.push(fMesh);
      }
    }

    // Flat painted safety demarcation border line
    const borderGroup = createFlatFloorBorder(zCfg.center, zCfg.size, borderColor, borderWidth, borderY);
    scene.add(borderGroup);
    zoneBorders[zKey] = borderGroup;

    if (sceneObjects) {
      sceneObjects.zoneBorders[zKey] = borderGroup;
    }

    // 3D Zone Labels
    if (typeof registerLabel3D === 'function') {
      const labelHtml = isSubZone
        ? '<span class="mat-dot" style="background:#94a3b8;"></span>PRD WH'
        : zCfg.name;
      const labelY = isSubZone ? 4.8 : 8.8;
      const labelZ = isSubZone ? 5.2 : (zCfg.center[2] - zCfg.size[1] / 2 + 2);
      registerLabel3D(
        labelHtml,
        new THREE.Vector3(zCfg.center[0], labelY, labelZ),
        'tag-zone',
        zKey
      );
    }
  });

  // 4. Central Transit Highway (Dashed lines removed per user request)
  const highwayGroup = new THREE.Group();

  return {
    floorGround: groundMesh,
    zoneFloors: zoneFloors,
    zoneBorders: zoneBorders,
    centralHighway: highwayGroup
  };
}
