/* =========================================================================
   StarFlexERP 3D - Base Reusable Materials (base.js)
   Shared Three.js materials & cached shader instances
   ========================================================================= */

    let _cachedKraftBoxMat = null;
    let _cachedWhiteTapeMat = null;
    let _cachedDarkInnerMat = null;

    function getKraftBoxMaterial() {
      if (!_cachedKraftBoxMat) {
        _cachedKraftBoxMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
      }
      return _cachedKraftBoxMat;
    }

    function getWhiteTapeMaterial() {
      if (!_cachedWhiteTapeMat) {
        _cachedWhiteTapeMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      }
      return _cachedWhiteTapeMat;
    }

    function getDarkInnerMaterial() {
      if (!_cachedDarkInnerMat) {
        _cachedDarkInnerMat = new THREE.MeshLambertMaterial({ color: 0xa87747 });
      }
      return _cachedDarkInnerMat;
    }


    let _cachedResinSackMaterials = null;
    function getResinSackMaterials() {
      if (_cachedResinSackMaterials) return _cachedResinSackMaterials;
      const tex = getResinSackTexture();
      const topMat = new THREE.MeshLambertMaterial({ map: tex });
      const sideMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const btmMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
      const boxMaterials = [sideMat, sideMat, topMat, btmMat, sideMat, sideMat];
      const seamMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const tapeMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });

      _cachedResinSackMaterials = {
        box: boxMaterials,
        side: sideMat,
        seam: seamMat,
        tape: tapeMat
      };
      return _cachedResinSackMaterials;
    }

let _cachedRedPalletMat = null;
function getRedPalletMaterial() {
  if (!_cachedRedPalletMat) {
    _cachedRedPalletMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c }); // Industrial painted red wood
  }
  return _cachedRedPalletMat;
}

let _cachedStretchWrapMat = null;
function getStretchWrapMaterial() {
  if (!_cachedStretchWrapMat) {
    _cachedStretchWrapMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      roughness: 0.10,
      metalness: 0.05,
      depthWrite: false
    });
  }
  return _cachedStretchWrapMat;
}

