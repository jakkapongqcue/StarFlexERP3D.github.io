/* =========================================================================
       7. INITIALIZATION & MAIN ANIMATION LOOP
       ========================================================================= */
    buildFactoryScene();
    setupCameraAndPointerControls();
    syncUnitOptionsAndPresets();
    renderWasteInputsGrid();
    renderStationTimingGrid();
    bindAllUIEvents();
    let initTheme = 'light';
    try {
      initTheme = localStorage.getItem('sf_theme_mode') || 'light';
    } catch (e) {}
    applyThemeMode(initTheme);
    syncFollowAndLoopButtonsUI();
    recalculateAndRenderUI();
    updateTopHeaderOffsetVar();
    appendEventLog('Starflex ERP 3D initialized with linear PRD line.');

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
