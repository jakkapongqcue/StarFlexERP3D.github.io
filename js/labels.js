/* =========================================================================
   StarFlexERP 3D - Floating 3D Text Labels, Pallet Tags & Event Logs
   - HTML 3D Billboards & HUD tags projected via Three.js camera
   - Station live status beacons & process focus banner
   - Pallet cargo manifest tooltips
   - Real-time simulation event logger
   ========================================================================= */

    function formatPalletTagHtml(itemsList) {
      if (!itemsList || itemsList.length === 0) return '';
      const isMinimal = (appState.inputMode === 'MINIMAL');
      const maxLines = 3;
      const shown = itemsList.slice(0, maxLines);
      const linesHtml = shown.map(function (entry) {
        const cat = MATERIAL_CATALOG[entry.key] || { name: entry.key, color: '#60a5fa' };
        const qtySuffix = (!isMinimal && entry.qtyText) ? (' – ' + entry.qtyText) : '';
        return '<div><span class="mat-dot" style="background:' + cat.color + ';"></span>' +
          cat.name + qtySuffix + '</div>';
      });
      if (itemsList.length > maxLines) {
        linesHtml.push('<div style="color:#93c5fd;font-weight:700;">+' + (itemsList.length - maxLines) + ' more</div>');
      }
      return linesHtml.join('');
    }

    function updateFocusProcessBanner() {
      const bannerEl = document.getElementById('focusProcessBanner');
      const titleEl = document.getElementById('focusBannerTitle');
      const badgeEl = document.getElementById('focusBannerBadge');
      const inEl = document.getElementById('focusBannerInText');
      const outEl = document.getElementById('focusBannerOutText');

      let focusTarget = null;
      if (STATION_MAP[appState.selectedTarget] || appState.selectedTarget === 'STEP_FG' || appState.selectedTarget === 'STEP_DELIVERED') {
        focusTarget = appState.selectedTarget;
      } else if (appState.followFlow && appState.simStatus === 'RUNNING' && STATION_MAP[appState.activeStepId]) {
        focusTarget = appState.activeStepId;
      }

      if (!focusTarget) {
        bannerEl.classList.add('hidden');
        return;
      }

      bannerEl.classList.remove('hidden');

      if (focusTarget === 'STEP_FG') {
        titleEl.textContent = 'Process Focus: 8. Warehouse FG';
        badgeEl.textContent = 'STORAGE & QA';
        badgeEl.className = 'status-badge status-idle';
        inEl.textContent = 'Palletized finished pouches & rolls from PRD line';
        outEl.textContent = 'Inspected packaging staged in multi-tier racks';
        return;
      }

      if (focusTarget === 'STEP_DELIVERED') {
        titleEl.textContent = 'Process Focus: 9. Logistics Delivery Yard';
        badgeEl.textContent = 'DISPATCH';
        badgeEl.className = 'status-badge status-running';
        inEl.textContent = 'FG pallets loaded via side-doors by Delivery Forklift';
        outEl.textContent = 'Container truck sealed and dispatched to customer';
        return;
      }

      const st = STATION_MAP[focusTarget];
      const rt = appState.stationRuntime[focusTarget];
      const plan = appState.plan || computeOrderPlan();
      const stepCalc = plan.stepMap[focusTarget];
      const isMinimal = (appState.inputMode === 'MINIMAL');

      titleEl.textContent = 'Process Focus: ' + st.stepNum + '. ' + st.name;

      const statusStr = !stepCalc ? 'SKIPPED' : (rt ? rt.status : 'IDLE');
      badgeEl.textContent = statusStr;
      badgeEl.className = 'status-badge ' +
        (statusStr === 'RUNNING' ? 'status-running' : (statusStr === 'SKIPPED' ? 'status-skipped' : 'status-idle'));

      if (isMinimal || !stepCalc) {
        inEl.textContent = rt ? rt.activeInputs : st.inputSummary;
        outEl.textContent = rt ? rt.activeOutput : st.outputSummary;
      } else {
        inEl.textContent = (rt ? rt.activeInputs : st.inputSummary) + ' (' + formatNum(stepCalc.inputKg, 1) + ' kg)';
        outEl.textContent = (rt ? rt.activeOutput : st.outputSummary) + ' (' + formatNum(stepCalc.outputKg, 1) + ' kg)';
      }
    }

    function refreshAll3DTextLabels() {
      const isMinimal = (appState.inputMode === 'MINIMAL');

      Object.keys(sceneObjects.rmVisualGroups).forEach(function (matKey) {
        const entry = sceneObjects.rmVisualGroups[matKey];
        if (!entry) return;
        const cat = MATERIAL_CATALOG[matKey];
        if (!cat) return;
        const currentVal = Math.max(0, appState.rmStock[matKey] || 0);
        if (entry.tag && entry.tag.el) {
          if (isMinimal) {
            entry.tag.el.innerHTML =
              '<span class="mat-dot" style="background:' + cat.color + ';"></span>' + cat.name;
          } else {
            entry.tag.el.innerHTML =
              '<span class="mat-dot" style="background:' + cat.color + ';"></span>' +
              cat.name + ': <strong>' + formatNum(currentVal, 0) + ' ' + cat.unit + '</strong>';
          }
        }
        if (entry.pallets && entry.pallets.length > 0) {
          entry.pallets.forEach(function (p, idx) {
            if (p) p.visible = currentVal > (cat.initStock * (idx === 0 ? 0 : 0.35));
          });
        }
      });

      const activeRoute = appState.plan ? appState.plan.routeIds : getActiveRouteIds();
      STATIONS_CONFIG.forEach(function (st) {
        const stObj = sceneObjects.stationObjs[st.id];
        if (!stObj) return;
        const runtime = appState.stationRuntime[st.id];
        const isSkipped = activeRoute.indexOf(st.id) === -1;
        const isRunning = runtime && runtime.status === 'RUNNING';
        const isFocused = (appState.selectedTarget === st.id) || (appState.followFlow && appState.activeStepId === st.id);

        stObj.headerTag.el.className = 'tag-3d tag-station' +
          (isRunning ? ' active-station' : '') +
          (isFocused ? ' focused-station' : '');
        stObj.headerTag.el.innerHTML =
          st.stepNum + '. ' + st.name + ' <span style="opacity:0.8;">(' +
          (isSkipped ? 'SKIPPED' : (runtime ? runtime.status : 'IDLE')) + ')</span>';

        stObj.inTag.el.className = 'tag-3d tag-io io-in' + (isFocused ? ' io-focused' : '');
        stObj.outTag.el.className = 'tag-3d tag-io io-out' + (isFocused ? ' io-focused' : '');
        stObj.inTag.el.innerHTML = 'In: ' + (runtime ? runtime.activeInputs : st.inputSummary);
        stObj.outTag.el.innerHTML = 'Out: ' + (runtime ? runtime.activeOutput : st.outputSummary);

        if (isSkipped) {
          stObj.beaconMat.color.setHex(0x64748b);
        } else if (isRunning) {
          stObj.beaconMat.color.setHex(0x22c55e);
        } else if (appState.completedSteps[st.id]) {
          stObj.beaconMat.color.setHex(0x3b82f6);
        } else {
          stObj.beaconMat.color.setHex(0xf59e0b);
        }
      });

      updateFocusProcessBanner();
    }

    const tempProjVec = new THREE.Vector3();
    function project3DLabelsToScreen() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const zoomScale = Math.max(0.72, Math.min(1.1, 110 / camControl.spherical.radius));
      const hideSmallTags = camControl.spherical.radius > 195;

      sceneObjects.labels3D.forEach(function (lbl) {
        if (!lbl.visible) {
          lbl.el.style.display = 'none';
          return;
        }
        if (lbl.isMaterialTag && (!appState.showMaterialLabels || hideSmallTags)) {
          lbl.el.style.display = 'none';
          return;
        }

        if (lbl.followObj) {
          tempProjVec.copy(lbl.followObj.position);
          tempProjVec.y += lbl.offsetY;
        } else {
          tempProjVec.copy(lbl.pos);
        }

        tempProjVec.project(camera);
        if (tempProjVec.z > 1 || tempProjVec.z < -1) {
          lbl.el.style.display = 'none';
          return;
        }

        const sx = (tempProjVec.x * 0.5 + 0.5) * w;
        const sy = (-tempProjVec.y * 0.5 + 0.5) * h;
        lbl.el.style.display = 'block';
        lbl.el.style.left = sx.toFixed(1) + 'px';
        lbl.el.style.top = sy.toFixed(1) + 'px';
        lbl.el.style.transform = 'translate(-50%, -100%) scale(' + zoomScale.toFixed(2) + ')';
      });
    }

    function appendEventLog(msg) {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      appState.logs.unshift({ time: timeStr, text: msg });
      if (appState.logs.length > 80) appState.logs.pop();
      renderEventLogDOM();
    }

    function renderEventLogDOM() {
      const box = document.getElementById('eventLogContainer');
      if (!box) return;
      if (appState.logs.length === 0) {
        box.innerHTML = '<div style="color:var(--text-muted);">No simulation events yet. Press Start to begin.</div>';
        return;
      }
      box.innerHTML = appState.logs.map(function (entry) {
        return '<div class="log-entry"><span class="log-time">[' + entry.time + ']</span>' + entry.text + '</div>';
      }).join('');
    }
