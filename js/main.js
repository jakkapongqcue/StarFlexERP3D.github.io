/* =========================================================================
   7. INITIALIZATION & MAIN ANIMATION LOOP
   ========================================================================= */
async function initApplication() {
  const loadingEl = document.getElementById('loadingScreen');
  const barFillEl = document.getElementById('loadingBarFill');
  const percentEl = document.getElementById('loadingPercentText');
  const statusEl = document.getElementById('loadingStatusText');

  function updateLoadingUI(pct, text) {
    const rounded = Math.min(100, Math.max(0, Math.round(pct)));
    if (barFillEl) barFillEl.style.width = rounded + '%';
    if (percentEl) percentEl.textContent = rounded + '%';
    if (statusEl && text) statusEl.textContent = text;
    if (loadingEl) loadingEl.setAttribute('aria-valuenow', rounded);
  }

  try {
    updateLoadingUI(5, 'กำลังเตรียมระบบ Three.js Viewport...');

    // Asynchronously build all 3D factory models with live progress updates
    if (typeof buildFactorySceneAsync === 'function') {
      await buildFactorySceneAsync(updateLoadingUI);
    } else {
      buildFactoryScene();
      updateLoadingUI(90, 'กำลังเตรียมระบบควบคุม...');
    }

    // Initialize controls, grids, inputs and UI bindings
    setupCameraAndPointerControls();
    syncUnitOptionsAndPresets();
    renderWasteInputsGrid();
    renderStationTimingGrid();
    bindAllUIEvents();

    try {
      localStorage.removeItem('sf_theme_mode');
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', 'light');
    applyThemeMode();
    syncFollowAndLoopButtonsUI();
    recalculateAndRenderUI();
    updateTopHeaderOffsetVar();

    updateLoadingUI(100, 'โหลดโมเดล 3D สำเร็จ พร้อมเปิดใช้งาน!');
    appendEventLog('Starflex ERP 3D initialized with linear PRD line.');

    // Start 60 FPS animation loop
    let lastFrameTime = performance.now();
    function animateLoop(now) {
      requestAnimationFrame(animateLoop);
      const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      syncCameraPosition();
      stepSimulationFrame(dt);
      renderer.render(scene, camera);
      project3DLabelsToScreen();
    }
    requestAnimationFrame(animateLoop);

    // Smooth fade out of the loading screen
    setTimeout(function () {
      if (loadingEl) {
        loadingEl.classList.add('loading-hidden');
        setTimeout(function () {
          loadingEl.style.display = 'none';
        }, 650);
      }
    }, 450);

  } catch (err) {
    console.error('Fatal initialization error:', err);
    if (statusEl) {
      statusEl.textContent = 'เกิดข้อผิดพลาดในการโหลดโมเดล: ' + (err.message || err);
      statusEl.style.color = '#ef4444';
    }
    if (barFillEl) {
      barFillEl.style.background = '#ef4444';
    }
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApplication);
} else {
  initApplication();
}
