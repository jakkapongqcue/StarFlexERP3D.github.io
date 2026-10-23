/* =========================================================================
       6. UI BINDINGS: THEME MODES (LIGHT/DARK/SYSTEM), MINIMAL/DETAILED & INSPECTOR
       ========================================================================= */
    function refresh3DSceneThemeColors() {
      scene.background = new THREE.Color(getCssVar('--scene-sky', '#e8eff7'));
      if (sceneObjects.floorGround) {
        sceneObjects.floorGround.material.color.set(getCssVar('--scene-ground', '#dde5ef'));
      }
      const zoneColorVars = {
        ZONE_RM:     { floor: '--zone-rm-floor',  border: '--zone-rm-border' },
        ZONE_PRD:    { floor: '--zone-prd-floor', border: '--zone-prd-border' },
        ZONE_PRD_WH: { floor: '--zone-prd-floor', border: '--zone-prd-border' },
        ZONE_FG:     { floor: '--zone-fg-floor',  border: '--zone-fg-border' }
      };
      Object.keys(zoneColorVars).forEach(function (zKey) {
        if (sceneObjects.zoneFloors[zKey]) {
          sceneObjects.zoneFloors[zKey].material.color.set(getCssVar(zoneColorVars[zKey].floor, '#dbeafe'));
        }
        if (sceneObjects.zoneBorders[zKey]) {
          sceneObjects.zoneBorders[zKey].material.color.set(getCssVar(zoneColorVars[zKey].border, '#3b82f6'));
        }
      });
    }

    function updateTopHeaderOffsetVar() {
      const topHeaderEl = document.getElementById('topHeader');
      if (!topHeaderEl) return;
      const h = topHeaderEl.offsetHeight || 58;
      document.documentElement.style.setProperty('--top-header-offset', (h + 10) + 'px');
    }

    function applyThemeMode(mode) {
      appState.themeMode = mode; // 'light' | 'dark' | 'system'
      try {
        localStorage.setItem('sf_theme_mode', mode);
      } catch (e) {}

      const root = document.documentElement;
      if (mode === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', mode);
      }

      const themeMeta = {
        light: { icon: 'light_mode', label: 'Light' },
        dark: { icon: 'dark_mode', label: 'Dark' },
        system: { icon: 'desktop_windows', label: 'System' }
      }[mode] || { icon: 'light_mode', label: 'Light' };

      const iconEl = document.getElementById('themeDropdownIcon');
      const labelEl = document.getElementById('themeDropdownLabel');
      if (iconEl) iconEl.textContent = themeMeta.icon;
      if (labelEl) labelEl.textContent = themeMeta.label;

      document.querySelectorAll('#themeDropdownMenu .theme-dropdown-item').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-theme-mode') === mode);
      });

      refresh3DSceneThemeColors();
    }

    function getPresetsForCurrentUnit() {
      if (appState.productType === 'FG_ROLL') {
        if (appState.unit === 'roll') return [10, 20, 50, 100];
        if (appState.unit === 'meter') return [5000, 10000, 25000, 50000];
        return [250, 500, 1000, 2500];
      }
      return [1500, 3000, 6000, 15000];
    }

    function syncUnitOptionsAndPresets() {
      const unitSelect = document.getElementById('orderUnitSelect');
      if (appState.productType === 'FG_ROLL') {
        unitSelect.innerHTML =
          '<option value="roll">roll</option>' +
          '<option value="meter">meter</option>' +
          '<option value="kilogram">kilogram</option>';
        if (['roll', 'meter', 'kilogram'].indexOf(appState.unit) === -1) {
          appState.unit = 'roll';
          appState.quantity = 20;
          document.getElementById('orderQtyInput').value = '20';
        }
        unitSelect.value = appState.unit;
      } else {
        unitSelect.innerHTML = '<option value="pieces">pieces</option>';
        if (appState.unit !== 'pieces') {
          appState.unit = 'pieces';
          appState.quantity = 3000;
          document.getElementById('orderQtyInput').value = '3000';
        }
        unitSelect.value = 'pieces';
      }

      const presetRow = document.getElementById('qtyPresetRow');
      const presets = getPresetsForCurrentUnit();
      presetRow.innerHTML = '<span style="font-size:10px;color:var(--text-muted);">Quick:</span>' +
        presets.map(function (val) {
          return '<button type="button" class="preset-chip" data-preset="' + val + '">' +
            formatNum(val, 0) + ' ' + appState.unit + '</button>';
        }).join('');

      presetRow.querySelectorAll('.preset-chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const v = Number(btn.getAttribute('data-preset'));
          appState.quantity = v;
          document.getElementById('orderQtyInput').value = String(v);
          recalculateAndRenderUI();
        });
      });
    }

    function renderWasteInputsGrid() {
      const grid = document.getElementById('wasteInputsGrid');
      const routeIds = getActiveRouteIds();
      grid.innerHTML = routeIds.map(function (stId) {
        const st = STATION_MAP[stId];
        const val = appState.wasteByStep[stId];
        return '<div class="waste-item">' +
          '<label for="waste_' + stId + '">' + st.stepNum + '. ' + st.name + '</label>' +
          '<div style="display:flex;align-items:center;gap:2px;">' +
          '<input type="number" id="waste_' + stId + '" data-stid="' + stId + '" value="' + val + '" min="0" max="45" step="0.5" />' +
          '<span>%</span></div></div>';
      }).join('');

      grid.querySelectorAll('input[data-stid]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          const id = inp.getAttribute('data-stid');
          appState.wasteByStep[id] = Math.max(0, Math.min(45, Number(inp.value) || 0));
          recalculateAndRenderUI();
        });
      });
    }

    function renderStationTimingGrid() {
      const grid = document.getElementById('stationTimingGrid');
      if (!grid) return;
      const routeIds = getActiveRouteIds();
      grid.innerHTML = routeIds.map(function (stId) {
        const st = STATION_MAP[stId];
        const timing = (appState.stationTiming && appState.stationTiming[stId]) || DEFAULT_TIMING_MAP[stId] || { inputMin: 15, outputMin: 18 };
        return '<div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg-muted);border:1px solid var(--border-color);border-radius:4px;padding:4px 6px;font-size:11px;">' +
          '<label style="font-weight:600;min-width:68px;cursor:pointer;" onclick="selectZoneOrStation(\'' + stId + '\')">' + st.stepNum + '. ' + st.name + '</label>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            '<div style="display:flex;align-items:center;gap:2px;" title="Duration until input is consumed (minutes)">' +
              '<span style="font-size:9.5px;color:var(--text-muted);font-weight:600;">In:</span>' +
              '<input type="number" data-stid="' + stId + '" data-field="inputMin" value="' + timing.inputMin + '" min="1" max="180" step="1" style="width:40px;padding:1px 3px;text-align:right;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-card);font-size:11px;" />' +
              '<span style="font-size:9.5px;color:var(--text-muted);">m</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:2px;" title="Duration until output is produced (minutes)">' +
              '<span style="font-size:9.5px;color:var(--text-muted);font-weight:600;">Out:</span>' +
              '<input type="number" data-stid="' + stId + '" data-field="outputMin" value="' + timing.outputMin + '" min="1" max="240" step="1" style="width:40px;padding:1px 3px;text-align:right;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-card);font-size:11px;" />' +
              '<span style="font-size:9.5px;color:var(--text-muted);">m</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      grid.querySelectorAll('input[data-stid]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          const id = inp.getAttribute('data-stid');
          const field = inp.getAttribute('data-field');
          const val = Math.max(1, Number(inp.value) || 1);
          if (!appState.stationTiming[id]) {
            appState.stationTiming[id] = Object.assign({}, DEFAULT_TIMING_MAP[id] || { inputMin: 15, outputMin: 18 });
          }
          appState.stationTiming[id][field] = val;
          if (field === 'inputMin' && appState.stationTiming[id].outputMin < val) {
            appState.stationTiming[id].outputMin = val;
            const outInp = grid.querySelector('input[data-stid="' + id + '"][data-field="outputMin"]');
            if (outInp) outInp.value = String(val);
          }
          renderInspectorPanel(appState.plan);
        });
      });
    }

    /* Show Factory Overview & Event Log (#detailPanel) ONLY when in Detailed Mode,
       and keep Visual Flow Mode card (#minimalAssumptionsBox) hidden */
    function setInputMode(mode) {
      appState.inputMode = mode;
      const isMinimal = (mode === 'MINIMAL');
      const minBtn = document.getElementById('modeMinimalBtn');
      const detBtn = document.getElementById('modeDetailedBtn');

      minBtn.classList.toggle('active', isMinimal);
      minBtn.setAttribute('aria-selected', String(isMinimal));
      detBtn.classList.toggle('active', !isMinimal);
      detBtn.setAttribute('aria-selected', String(!isMinimal));

      document.getElementById('minimalAssumptionsBox').classList.add('hidden');
      document.getElementById('detailedFieldsContainer').classList.toggle('hidden', isMinimal);
      document.getElementById('detailedSummarySection').classList.toggle('hidden', isMinimal);
      document.getElementById('detailPanel').classList.toggle('hidden', isMinimal);
      recalculateAndRenderUI();
      updateTopHeaderOffsetVar();
    }

    function syncFollowAndLoopButtonsUI() {
      const followLabel = document.getElementById('panelFollowLabel');
      const loopLabel = document.getElementById('panelLoopLabel');
      const followBtn = document.getElementById('panelFollowBtn');
      const loopBtn = document.getElementById('panelLoopBtn');

      if (followLabel) followLabel.textContent = 'Follow: ' + (appState.followFlow ? 'ON' : 'OFF');
      if (loopLabel) loopLabel.textContent = 'Loop: ' + (appState.loopRun ? 'ON' : 'OFF');
      if (followBtn) followBtn.classList.toggle('active', appState.followFlow);
      if (loopBtn) loopBtn.classList.toggle('active', appState.loopRun);
      updateFocusProcessBanner();
    }

    function syncDynamicMachineRollColors() {
      const refs = sceneObjects.dynamicRollRefs;
      if (!refs) return;

      // 1. Printing Unwinder: Substrate film roll is ALWAYS pure white before printing
      const baseFilmHex = 0xffffff;
      const baseStripeHex = 0xf1f5f9;
      if (refs.printUnwindRoll) {
        refs.printUnwindRoll.bodyMat.color.setHex(baseFilmHex);
        refs.printUnwindRoll.stripeMat.color.setHex(baseStripeHex);
      }
      if (refs.printUnwindWebs) {
        refs.printUnwindWebs.forEach(function (w) {
          w.material.color.setHex(baseFilmHex);
        });
      }

      // 2. Bag Unwinder: Uses slit Hygiene roll
      if (refs.bagUnwindRolls) {
        refs.bagUnwindRolls.forEach(function (r) {
          if (Array.isArray(r.bodyMat)) {
            // Textured with Hygiene pattern - preserve texture
          } else if (r.bodyMat && r.bodyMat.color) {
            const bagFromLaminate = (appState.productType !== 'FG_ROLL' && appState.skipSlit);
            const bagUnwindHex = bagFromLaminate ? 0xbe185d : 0xbe185d;
            r.bodyMat.color.setHex(bagUnwindHex);
          }
          if (r.stripeMat && r.stripeMat.color) {
            r.stripeMat.color.setHex(0xfacc15);
          }
        });
      }
    }

    function recalculateAndRenderUI() {
      const plan = computeOrderPlan();
      appState.plan = plan;
      const isMinimal = (appState.inputMode === 'MINIMAL');
      syncDynamicMachineRollColors();

      if (appState.simStatus === 'RUNNING' && appState.isConcurrent) {
        initConcurrentPipeline(plan);
      }

      const isPieces = (appState.unit === 'pieces');
      document.getElementById('piecesPerBoxGroup').classList.toggle('hidden', !isPieces);
      document.getElementById('skipSlitRow').classList.toggle('hidden', appState.productType === 'FG_ROLL');
      document.getElementById('purchasedFilmNote').classList.toggle('hidden', appState.filmSource !== 'PURCHASED');

      document.getElementById('routePreviewText').textContent = plan.routeIds.length + ' active processes';
      document.getElementById('convertedHintText').textContent = plan.orderSummaryLabel;
      document.getElementById('boxCountCalcText').textContent =
        plan.finalBoxes + ' boxes (' + appState.piecesPerBox + ' pcs/box)';

      if (!isMinimal) {
        const tbody = document.getElementById('summaryTableBody');
        tbody.innerHTML = plan.steps.map(function (s) {
          return '<tr>' +
            '<td>' + s.name + ' <span style="color:var(--text-muted);font-weight:400;">(' + s.wastePct + '%)</span></td>' +
            '<td>' + formatNum(s.inputKg, 1) + ' kg</td>' +
            '<td style="color:var(--danger);">' + formatNum(s.wasteKg, 1) + ' kg</td>' +
            '<td style="color:var(--success);font-weight:600;">' + formatNum(s.outputKg, 1) + ' kg</td>' +
            '</tr>';
        }).join('');

        const rm = plan.rmConsumed;
        const primaryFilmItem = (appState.filmSource === 'INHOUSE')
          ? { label: 'Resin bags', val: formatNum(rm.resinKg, 1) + ' kg' }
          : { label: 'Purchased Film', val: formatNum(rm.purchasedFilmKg, 1) + ' kg' };

        const rmStats = [
          primaryFilmItem,
          { label: 'Laminate Film', val: formatNum(rm.laminateFilmKg, 1) + ' kg' },
          { label: 'RM Ink', val: formatNum(rm.rmInkKg, 1) + ' kg' },
          { label: 'Solvent', val: formatNum(rm.solventL, 1) + ' L' },
          { label: 'Adhesive', val: formatNum(rm.adhesiveKg, 1) + ' kg' },
          { label: 'Papercore', val: formatNum(rm.paperCores, 0) + ' pcs' },
          { label: 'Corrugated Box', val: formatNum(rm.boxes, 0) + ' boxes' },
          { label: 'Spout Caps', val: formatNum(rm.spouts, 0) + ' pcs' }
        ];

        document.getElementById('rmConsumedGrid').innerHTML = rmStats.map(function (it) {
          return '<div class="rm-stat-pill"><span>' + it.label + '</span><strong>' + it.val + '</strong></div>';
        }).join('');
      }

      renderStationTimingGrid();
      updateDashboardUI();
      refreshAll3DTextLabels();
    }

    function updateDashboardUI() {
      const plan = appState.plan || computeOrderPlan();
      const isMinimal = (appState.inputMode === 'MINIMAL');

      document.getElementById('kpiWipVal').textContent = (appState.simStatus === 'RUNNING' || appState.simStatus === 'PAUSED') ? '1' : '0';
      document.getElementById('kpiWipSub').textContent = appState.simStatus + ' (' + appState.productType.replace('FG_', 'FG ') + ')';
      document.getElementById('kpiFgStockVal').textContent = isMinimal
        ? (appState.fgStockPallets > 0 ? 'In FG Racks' : '0 pallets')
        : (appState.fgStockPallets + ' pallets');
      document.getElementById('kpiFgStockSub').textContent = appState.fgProducedDisplay;

      // Hide Process Mode / Visual Flow KPI card in Minimal Mode; show Cumulative Waste % only in Detailed Mode
      const processModeCard = document.getElementById('kpiProcessModeCard');
      if (processModeCard) {
        processModeCard.classList.toggle('hidden', isMinimal);
      }
      document.getElementById('kpiWasteVal').textContent = plan.overallWastePct.toFixed(1) + '%';
      document.getElementById('kpiWasteSub').textContent = 'Cumulative route waste';

      document.getElementById('kpiProgressVal').textContent = appState.orderProgressPct + '%';
      document.getElementById('kpiProgressSub').textContent = appState.activeStepId
        ? ('Active: ' + appState.activeStepId.replace('ST_', '').replace('STEP_', ''))
        : 'Ready';

      const badge = document.getElementById('simStateBadge');
      badge.textContent = appState.simStatus;
      badge.className = 'status-badge ' + (appState.simStatus === 'RUNNING' ? 'status-running' : 'status-idle');

      const startBtn = document.getElementById('startSimBtn');
      const startIcon = document.getElementById('startSimBtnIcon');
      const startLabel = document.getElementById('startSimBtnLabel');
      if (startBtn && startIcon && startLabel) {
        if (appState.simStatus === 'RUNNING') {
          startIcon.textContent = 'pause';
          startLabel.textContent = 'Pause';
          startBtn.className = 'btn btn-pause-mode';
          startBtn.title = 'Pause simulation (Spacebar)';
        } else if (appState.simStatus === 'PAUSED') {
          startIcon.textContent = 'play_arrow';
          startLabel.textContent = 'Resume';
          startBtn.className = 'btn btn-primary';
          startBtn.title = 'Resume simulation (Spacebar)';
        } else {
          startIcon.textContent = 'play_arrow';
          startLabel.textContent = 'Start';
          startBtn.className = 'btn btn-primary';
          startBtn.title = 'Start simulation (Spacebar)';
        }
      }

      const stepperEl = document.getElementById('bottomStepperBar');
      const routeIds = plan.routeIds;
      const zoneButtons = [
        { target: 'ALL', label: 'All Factory' },
        { target: 'ZONE_RM', label: 'RM WH' },
        { target: 'ZONE_PRD', label: 'PRD Line' },
        { target: 'ZONE_PRD_WH', label: 'PRD WH' },
        { target: 'ZONE_FG', label: 'Warehouse FG & Dock' }
      ];

      const zoneChipsHtml = '<div class="bottom-bar-group">' +
        zoneButtons.map(function (zb) {
          const isSelected = (appState.selectedTarget === zb.target);
          return '<button type="button" class="zone-chip' + (isSelected ? ' active' : '') +
            '" data-zoneclick="' + zb.target + '" title="Focus view on ' + zb.label + '">' + zb.label + '</button>';
        }).join('') +
        '</div>';

      const stepsHtml = '<div class="bottom-bar-group">' +
        ALL_STEPPER_STEPS.map(function (st, idx) {
          const isProcessStep = st.id.indexOf('ST_') === 0;
          const isSkipped = isProcessStep && routeIds.indexOf(st.id) === -1;
          const isDone = Boolean(appState.completedSteps[st.id]);
          const isActive = (appState.activeStepId === st.id) || (appState.isConcurrent && routeIds.indexOf(st.id) !== -1);
          const isCamSelected = (appState.selectedTarget === st.id);

          let cls = 'step-node';
          if (isSkipped) cls += ' skipped';
          else if (isActive) cls += ' active';
          else if (isDone) cls += ' done';
          if (isCamSelected) cls += ' focused-cam';

          const arrow = (idx < ALL_STEPPER_STEPS.length - 1) ? '<span class="step-arrow">→</span>' : '';
          return '<div class="' + cls + '" data-stepclick="' + st.id + '" role="button" tabindex="0" title="Focus view on ' + st.label + '">' +
            '<span class="step-dot"></span><span>' + st.label + '</span></div>' + arrow;
        }).join('') +
        '</div>';

      stepperEl.innerHTML = zoneChipsHtml + '<div class="bottom-bar-divider"></div>' + stepsHtml;

      stepperEl.querySelectorAll('[data-zoneclick]').forEach(function (btn) {
        btn.onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          selectZoneOrStation(btn.getAttribute('data-zoneclick'));
        };
      });

      stepperEl.querySelectorAll('[data-stepclick]').forEach(function (node) {
        node.onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          selectZoneOrStation(node.getAttribute('data-stepclick'));
        };
      });

      renderInspectorPanel(plan);
      renderRmStockList();
    }

    function renderRmStockList() {
      const container = document.getElementById('rmStockListContainer');
      const isMinimal = (appState.inputMode === 'MINIMAL');
      document.getElementById('rmListModeHint').textContent = isMinimal ? 'Sub-Warehouse Catalog' : 'Live Quantities';

      container.innerHTML = RM_SUB_WAREHOUSES.map(function (wh) {
        const rows = wh.keys.map(function (k) {
          const cat = MATERIAL_CATALOG[k];
          if (!cat) return '';
          const val = Math.max(0, appState.rmStock[k] || 0);
          return '<div class="stock-row" style="padding-left:6px;">' +
            '<span><span class="mat-dot" style="background:' + cat.color + ';"></span>' + cat.name + '</span>' +
            '<strong>' + (isMinimal ? 'Available' : (formatNum(val, 0) + ' ' + cat.unit)) + '</strong></div>';
        }).join('');

        return '<div style="margin-top:6px;margin-bottom:3px;padding-bottom:2px;border-bottom:1px dashed var(--border-color);display:flex;align-items:center;justify-content:space-between;">' +
          '<span style="font-weight:700;font-size:11px;color:' + wh.color + ';">' + wh.name + '</span>' +
          '<span style="font-size:9.5px;color:var(--text-muted);">' + wh.desc + '</span>' +
          '</div>' + rows;
      }).join('');
    }

    function getStationLiveTimingStatusHtml(stId) {
      const stObj = (sceneObjects && sceneObjects.stationObjs) ? sceneObjects.stationObjs[stId] : null;
      if (!stObj) return '';
      const rt = (appState && appState.stationRuntime) ? appState.stationRuntime[stId] : null;
      const timing = (appState.stationTiming && appState.stationTiming[stId]) || DEFAULT_TIMING_MAP[stId] || { inputMin: 15, outputMin: 18 };
      const hasInfeed = bayHasCargo(stObj.infeedBay);
      const hasOutfeed = bayHasCargo(stObj.outfeedBay);

      if (rt && rt.status === 'RUNNING') {
        const curTask = (!appState.isConcurrent && appState.tasks) ? appState.tasks[appState.currentTaskIndex] : null;
        let elapsedMin = 0;
        if (curTask && curTask.stationId === stId) {
          elapsedMin = Math.round((curTask.elapsed / 0.1) * 10) / 10;
        } else if (appState.isConcurrent && appState.concurrentData && appState.concurrentData.stationCycles && appState.concurrentData.stationCycles[stId]) {
          elapsedMin = Math.round((appState.concurrentData.stationCycles[stId].elapsed / 0.1) * 10) / 10;
        }
        const inConsumed = (elapsedMin >= timing.inputMin) || !hasInfeed;
        const inStatus = inConsumed ? '✓ Infeed cargo consumed' : ('Infeed consuming (' + Math.max(0, Math.round((timing.inputMin - elapsedMin) * 10) / 10) + 'm left)');
        const outStatus = (elapsedMin >= timing.outputMin) ? '✓ Output ready in Green Bay' : ('Output ready in ' + Math.max(0, Math.round((timing.outputMin - elapsedMin) * 10) / 10) + 'm');
        return '<span style="color:#10b981;font-weight:600;">⚡ RUNNING (' + elapsedMin + 'm elapsed)</span><br>' +
          '• ' + inStatus + '<br>' +
          '• ' + outStatus;
      } else if (hasOutfeed) {
        return '<span style="color:#10b981;font-weight:600;">🟢 Output Ready in Green Bay</span> (Awaiting downstream transfer)';
      } else if (hasInfeed) {
        return '<span style="color:#f59e0b;font-weight:600;">🟡 Input Received in Yellow Bay</span> (Ready to operate)';
      } else {
        return '<span style="color:var(--text-muted);">⚠️ Awaiting Input in Yellow Bay (Machine in Idle)</span>';
      }
    }

    function renderInspectorPanel(plan) {
      const target = appState.selectedTarget;
      const titleEl = document.getElementById('inspectorTitle');
      const badgeEl = document.getElementById('inspectorBadge');
      const contentEl = document.getElementById('inspectorContent');
      const isMinimal = (appState.inputMode === 'MINIMAL');

      if (STATION_MAP[target]) {
        const st = STATION_MAP[target];
        const rt = appState.stationRuntime[target];
        const calcStep = plan.stepMap[target];
        const isSkipped = !calcStep;

        titleEl.textContent = st.stepNum + '. ' + st.name + ' Station';
        badgeEl.textContent = isSkipped ? 'SKIPPED' : (rt ? rt.status : 'IDLE');
        badgeEl.className = 'status-badge ' + (isSkipped ? 'status-skipped' : (rt && rt.status === 'RUNNING' ? 'status-running' : 'status-idle'));

        const numericRows = isMinimal ? '' : (
          '<div class="stock-row"><span>Station Waste %</span><strong>' + (calcStep ? calcStep.wastePct + '%' : 'Skipped') + '</strong></div>' +
          '<div class="stock-row"><span>Order Required Input</span><strong>' + (calcStep ? formatNum(calcStep.inputKg, 1) + ' kg' : '—') + '</strong></div>' +
          '<div class="stock-row"><span>Order Good Output</span><strong>' + (calcStep ? formatNum(calcStep.outputKg, 1) + ' kg' : '—') + '</strong></div>'
        );

        const timing = (appState.stationTiming && appState.stationTiming[target]) || DEFAULT_TIMING_MAP[target] || { inputMin: 15, outputMin: 18 };
        const timingCard =
          '<div style="background:var(--bg-muted);padding:8px;border-radius:6px;margin:8px 0;border:1px solid var(--border-color);">' +
            '<div style="font-weight:600;font-size:11px;color:var(--text-primary);display:flex;justify-content:space-between;margin-bottom:6px;">' +
              '<span>⏱️ Machine Operating Timing</span>' +
              '<span style="font-size:10px;color:var(--text-muted);">Adjustable</span>' +
            '</div>' +
            '<div style="display:flex;gap:6px;align-items:center;">' +
              '<div style="flex:1;display:flex;align-items:center;justify-content:space-between;background:var(--bg-card);padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;">' +
                '<span style="font-size:10.5px;color:var(--text-secondary);">Input Consumed:</span>' +
                '<div style="display:flex;align-items:center;gap:2px;">' +
                  '<input type="number" id="inspInputMin" value="' + timing.inputMin + '" min="1" max="180" style="width:40px;text-align:right;font-size:11px;padding:1px 3px;border:1px solid var(--border-color);border-radius:3px;background:var(--bg-card);" />' +
                  '<span style="font-size:10px;color:var(--text-muted);">min</span>' +
                '</div>' +
              '</div>' +
              '<div style="flex:1;display:flex;align-items:center;justify-content:space-between;background:var(--bg-card);padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;">' +
                '<span style="font-size:10.5px;color:var(--text-secondary);">Output Ready:</span>' +
                '<div style="display:flex;align-items:center;gap:2px;">' +
                  '<input type="number" id="inspOutputMin" value="' + timing.outputMin + '" min="1" max="240" style="width:40px;text-align:right;font-size:11px;padding:1px 3px;border:1px solid var(--border-color);border-radius:3px;background:var(--bg-card);" />' +
                  '<span style="font-size:10px;color:var(--text-muted);">min</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div id="inspTimingLiveStatus" style="margin-top:6px;font-size:10.5px;line-height:1.4;">' +
              getStationLiveTimingStatusHtml(target) +
            '</div>' +
          '</div>';

        contentEl.innerHTML =
          '<p style="color:var(--text-secondary);">' + st.desc + '</p>' +
          '<div class="io-highlight-card">' +
            '<div><span class="focus-io-label in-lbl">Input (Materials Supplied)</span><div style="font-weight:700;margin-top:2px;">' + (rt ? rt.activeInputs : st.inputSummary) + '</div></div>' +
            '<div style="border-top:1px dashed var(--border-color);padding-top:5px;"><span class="focus-io-label out-lbl">Output (Produced)</span><div style="font-weight:700;margin-top:2px;">' + (rt ? rt.activeOutput : st.outputSummary) + '</div></div>' +
          '</div>' +
          timingCard +
          numericRows;

        const inInp = document.getElementById('inspInputMin');
        if (inInp) {
          inInp.addEventListener('input', function () {
            const val = Math.max(1, Number(inInp.value) || 1);
            if (!appState.stationTiming[target]) appState.stationTiming[target] = Object.assign({}, DEFAULT_TIMING_MAP[target]);
            appState.stationTiming[target].inputMin = val;
            if (appState.stationTiming[target].outputMin < val) {
              appState.stationTiming[target].outputMin = val;
              const outInpEl = document.getElementById('inspOutputMin');
              if (outInpEl) outInpEl.value = String(val);
            }
            renderStationTimingGrid();
          });
        }
        const outInp = document.getElementById('inspOutputMin');
        if (outInp) {
          outInp.addEventListener('input', function () {
            const val = Math.max(1, Number(outInp.value) || 1);
            if (!appState.stationTiming[target]) appState.stationTiming[target] = Object.assign({}, DEFAULT_TIMING_MAP[target]);
            appState.stationTiming[target].outputMin = val;
            renderStationTimingGrid();
          });
        }
      } else if (target === 'STEP_FG') {
        titleEl.textContent = '8. Warehouse FG Racks';
        badgeEl.textContent = 'Storage & QA';
        badgeEl.className = 'status-badge status-idle';
        contentEl.innerHTML =
          '<p style="color:var(--text-secondary);">Multi-tier selective storage racks for finished packaging goods (Hygiene pouches and barrier rolls) awaiting inspection signoff and delivery dispatch.</p>' +
          '<div class="stock-row"><span>Stored Pallets</span><strong>' + (isMinimal ? (appState.fgStockPallets > 0 ? 'In FG Racks' : '0 pallets') : (appState.fgStockPallets + ' pallets')) + '</strong></div>' +
          '<div class="stock-row"><span>Material Handling</span><strong>FG Forklift retrieves palletized packaging from conversion and stacks into rack tiers.</strong></div>';
      } else if (target === 'STEP_DELIVERED') {
        titleEl.textContent = '9. Logistics Delivery Yard';
        badgeEl.textContent = 'Dispatch & Logistics';
        badgeEl.className = 'status-badge status-idle';
        contentEl.innerHTML =
          '<p style="color:var(--text-secondary);">Open-level concrete loading yard where the Delivery Forklift loads finished pallets directly into the wide side-opening doors of the Container Truck.</p>' +
          '<div class="stock-row"><span>Transport Vehicle</span><strong>Side-Door Container Truck (Open Side Loading)</strong></div>' +
          '<div class="stock-row"><span>Logistics Handling</span><strong>Delivery Forklift drives pallets directly through side doors into the cargo bay.</strong></div>';
      } else if (ZONES_CONFIG[target]) {
        const z = ZONES_CONFIG[target];
        titleEl.textContent = z.name;
        badgeEl.textContent = 'Area View';
        badgeEl.className = 'status-badge status-idle';

        let subWhHtml = '';
        if (target === 'ZONE_RM') {
          subWhHtml = '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);">' +
            '<strong>RM WH Sub-Warehouses:</strong><br>' +
            '• <strong>Cylinder WH:</strong> Gravure printing cylinders on cantilever racks<br>' +
            '• <strong>Chemical WH:</strong> Base-color ink drums, solvents, and adhesives<br>' +
            '• <strong>Supplies Used WH:</strong> Paper cores, corrugated cartons, spout fitments<br>' +
            '• <strong>Resin & Film Storage:</strong> Resin bags and substrate rolls' +
            '</div>';
        } else if (target === 'ZONE_PRD_WH') {
          subWhHtml = '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);">' +
            '<strong>Central Production Staging & Buffer:</strong><br>' +
            'Functions as the central production buffer holding printed rolls, curing laminated rolls, and staging slit rolls before bag/spout conversion.' +
            '</div>';
        }

        contentEl.innerHTML =
          '<p style="color:var(--text-secondary);">' + z.role + '</p>' +
          '<div class="stock-row"><span>Material Handling</span><strong>' + z.handling + '</strong></div>' +
          subWhHtml;
      } else {
        titleEl.textContent = 'Starflex Factory Overview';
        badgeEl.textContent = 'All Factory';
        badgeEl.className = 'status-badge status-idle';
        contentEl.innerHTML =
          '<div class="stock-row"><span>Selected Product</span><strong>' + appState.productType.replace('FG_', 'FG ') + '</strong></div>' +
          '<div class="stock-row"><span>Film Source</span><strong>' + (appState.filmSource === 'INHOUSE' ? 'In-house Blown Film' : 'Purchased Film (Skip Blown)') + '</strong></div>' +
          '<div class="stock-row"><span>Order Target</span><strong>' + plan.orderSummaryLabel + '</strong></div>';
      }
    }

    function selectZoneOrStation(targetKey) {
      appState.selectedTarget = targetKey;
      appState.followFlow = false;
      syncFollowAndLoopButtonsUI();
      focusCameraOnTarget(targetKey);
      updateDashboardUI();
      refreshAll3DTextLabels();
    }

    function resetFleetAndPositionsOnly() {
      resetInventoryState();
      clearFgRackVisuals();
      resetAllStationBays();

      appState.isConcurrent = false;
      appState.concurrentData = null;

      STATIONS_CONFIG.forEach(function (st) {
        if (appState.stationRuntime[st.id]) {
          appState.stationRuntime[st.id].status = 'IDLE';
        }
        const stObj = sceneObjects.stationObjs[st.id];
        if (stObj && stObj.beaconMat) {
          stObj.beaconMat.color.setHex(0x94a3b8);
        }
      });

      sceneObjects.rmForklift.position.set(-45, 0.15, -1.8);
      sceneObjects.rmForklift.rotation.y = Math.PI;
      mountCargoOnVehicle(sceneObjects.rmForklift, null, []);

      sceneObjects.fgForklift.position.set(45, 0.15, 1.8);
      sceneObjects.fgForklift.rotation.y = 0;
      mountCargoOnVehicle(sceneObjects.fgForklift, null, []);

      sceneObjects.deliveryForklift.position.set(63, 0.15, -4);
      sceneObjects.deliveryForklift.rotation.y = 0;
      mountCargoOnVehicle(sceneObjects.deliveryForklift, null, []);

      sceneObjects.handPalletTruck.position.set(-10, 0.15, 1.8);
      sceneObjects.handPalletTruck.rotation.y = 0;
      mountCargoOnVehicle(sceneObjects.handPalletTruck, null, []);

      sceneObjects.containerTruck.position.set(81, 0.0, -4);
      if (sceneObjects.containerTruck.userData.setDoorOpenRatio) {
        sceneObjects.containerTruck.userData.setDoorOpenRatio(1.0);
      }
    }

    function resetSimulation() {
      appState.simStatus = 'IDLE';
      appState.tasks = [];
      appState.currentTaskIndex = -1;
      appState.isConcurrent = false;
      appState.concurrentData = null;
      appState.loopCycleCount = 0;
      resetFleetAndPositionsOnly();
      recalculateAndRenderUI();
      appendEventLog('Simulation reset. All RM WH stocks and fleet restored.');
    }

    function startSimulationOrder() {
      if (appState.inputMode === 'DETAILED') {
        const qty = Number(document.getElementById('orderQtyInput').value);
        const alertEl = document.getElementById('validationAlert');
        if (!qty || qty <= 0) {
          alertEl.style.display = 'block';
          return;
        }
        alertEl.style.display = 'none';
      } else {
        document.getElementById('validationAlert').style.display = 'none';
      }

      resetFleetAndPositionsOnly();
      const plan = computeOrderPlan();
      appState.plan = plan;

      if (appState.inputMode === 'MINIMAL') {
        // Mode: Flow Only (Concurrent Digital Twin Pipeline)
        appState.isConcurrent = true;
        appState.simStatus = 'RUNNING';
        initConcurrentPipeline(plan);
        appendEventLog('Started Mode: Flow Only – Concurrent Digital Twin active across all stations & fleet.');
        updateDashboardUI();
        refreshAll3DTextLabels();
        return;
      }

      // Mode: Flow Details (Linear Step-by-Step ERP Ledger)
      appState.isConcurrent = false;
      appState.tasks = buildSimulationTasks(plan);
      appState.currentTaskIndex = -1;
      appState.simStatus = 'RUNNING';
      appendEventLog(
        'Started Mode: Flow Details: ' + appState.productType.replace('FG_', 'FG ') + ' – ' +
        plan.orderSummaryLabel + ' [Film: ' + appState.filmSource + ']'
      );
      startNextTask();
    }

    function togglePlayPauseSimulation() {
      if (appState.simStatus === 'RUNNING') {
        appState.simStatus = 'PAUSED';
        appendEventLog('Simulation paused.');
        updateDashboardUI();
      } else if (appState.simStatus === 'PAUSED') {
        appState.simStatus = 'RUNNING';
        appendEventLog('Simulation resumed.');
        updateDashboardUI();
      } else {
        startSimulationOrder();
      }
    }

    function toggleFollowFlow() {
      appState.followFlow = !appState.followFlow;
      syncFollowAndLoopButtonsUI();
      if (!appState.followFlow && appState.selectedTarget === 'ALL') {
        focusCameraOnTarget('ALL');
      }
    }

    function toggleLoopRun() {
      appState.loopRun = !appState.loopRun;
      syncFollowAndLoopButtonsUI();
      updateDashboardUI();
    }

    function bindAllUIEvents() {
      document.getElementById('modeMinimalBtn').addEventListener('click', function () { setInputMode('MINIMAL'); });
      document.getElementById('modeDetailedBtn').addEventListener('click', function () { setInputMode('DETAILED'); });
      const jumpBtn = document.getElementById('jumpDetailedBtn');
      if (jumpBtn) jumpBtn.addEventListener('click', function () { setInputMode('DETAILED'); });

      document.getElementById('panelFollowBtn').addEventListener('click', toggleFollowFlow);
      document.getElementById('panelLoopBtn').addEventListener('click', toggleLoopRun);

      document.getElementById('closeFocusBannerBtn').addEventListener('click', function () {
        appState.followFlow = false;
        syncFollowAndLoopButtonsUI();
        selectZoneOrStation('ALL');
      });

      document.getElementById('resetDefaultsBtn').addEventListener('click', function () {
        appState.piecesPerBox = 300;
        appState.metersPerRoll = 1000;
        appState.kgPerRoll = 25;
        appState.skipSlit = false;
        appState.wasteByStep = Object.assign({}, DEFAULT_WASTE_MAP);
        appState.stationTiming = JSON.parse(JSON.stringify(DEFAULT_TIMING_MAP));
        document.getElementById('piecesPerBoxInput').value = '300';
        document.getElementById('metersPerRollInput').value = '1000';
        document.getElementById('kgPerRollInput').value = '25';
        document.getElementById('skipSlitCheckbox').checked = false;
        renderWasteInputsGrid();
        renderStationTimingGrid();
        recalculateAndRenderUI();
      });

      document.querySelectorAll('#productTypeGroup .seg-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('#productTypeGroup .seg-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          appState.productType = btn.getAttribute('data-product');
          syncUnitOptionsAndPresets();
          renderWasteInputsGrid();
          recalculateAndRenderUI();
        });
      });

      document.getElementById('orderQtyInput').addEventListener('input', function (ev) {
        appState.quantity = Number(ev.target.value) || 0;
        if (appState.quantity > 0) {
          document.getElementById('validationAlert').style.display = 'none';
        }
        recalculateAndRenderUI();
      });

      document.getElementById('orderUnitSelect').addEventListener('change', function (ev) {
        appState.unit = ev.target.value;
        syncUnitOptionsAndPresets();
        recalculateAndRenderUI();
      });

      document.querySelectorAll('#filmSourceGroup .seg-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          document.querySelectorAll('#filmSourceGroup .seg-btn').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          appState.filmSource = btn.getAttribute('data-source');
          resetInventoryState();
          renderWasteInputsGrid();
          recalculateAndRenderUI();
        });
      });

      document.getElementById('piecesPerBoxInput').addEventListener('input', function (ev) {
        appState.piecesPerBox = Math.max(1, Number(ev.target.value) || 300);
        recalculateAndRenderUI();
      });

      document.getElementById('metersPerRollInput').addEventListener('input', function (ev) {
        appState.metersPerRoll = Math.max(10, Number(ev.target.value) || 1000);
        recalculateAndRenderUI();
      });

      document.getElementById('kgPerRollInput').addEventListener('input', function (ev) {
        appState.kgPerRoll = Math.max(1, Number(ev.target.value) || 25);
        recalculateAndRenderUI();
      });

      document.getElementById('skipSlitCheckbox').addEventListener('change', function (ev) {
        appState.skipSlit = ev.target.checked;
        renderWasteInputsGrid();
        recalculateAndRenderUI();
      });

      document.getElementById('applyAllWasteBtn').addEventListener('click', function () {
        const val = Math.max(0, Math.min(45, Number(document.getElementById('bulkWasteInput').value) || 0));
        Object.keys(appState.wasteByStep).forEach(function (k) { appState.wasteByStep[k] = val; });
        renderWasteInputsGrid();
        recalculateAndRenderUI();
      });

      const resetTimingBtn = document.getElementById('resetDefaultTimingBtn');
      if (resetTimingBtn) {
        resetTimingBtn.addEventListener('click', function () {
          appState.stationTiming = JSON.parse(JSON.stringify(DEFAULT_TIMING_MAP));
          renderStationTimingGrid();
          recalculateAndRenderUI();
        });
      }

      document.getElementById('showLabelsToggle').addEventListener('change', function (ev) {
        appState.showMaterialLabels = ev.target.checked;
      });

      document.getElementById('simSpeedSelect').addEventListener('change', function (ev) {
        appState.simSpeed = Number(ev.target.value) || 1;
      });

      document.getElementById('startSimBtn').addEventListener('click', togglePlayPauseSimulation);
      document.getElementById('resetSimBtn').addEventListener('click', resetSimulation);

      /* Keyboard Shortcut: Spacebar toggles Start / Pause */
      window.addEventListener('keydown', function (ev) {
        if (ev.code === 'Space' || ev.key === ' ') {
          const activeEl = document.activeElement;
          const isInput = activeEl && (
            activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'SELECT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.isContentEditable
          );
          if (!isInput) {
            ev.preventDefault();
            togglePlayPauseSimulation();
          }
        }
      });

      document.getElementById('clearLogBtn').addEventListener('click', function () {
        appState.logs = [];
        renderEventLogDOM();
      });

      document.getElementById('resetCameraBtn').addEventListener('click', function () {
        appState.followFlow = false;
        syncFollowAndLoopButtonsUI();
        selectZoneOrStation('ALL');
      });

      /* Delegated click handler on #bottomStepperBar for reliable zone/station focus */
      const stepperEl = document.getElementById('bottomStepperBar');
      if (stepperEl) {
        stepperEl.addEventListener('click', function (ev) {
          const zoneBtn = ev.target.closest('[data-zoneclick]');
          if (zoneBtn) {
            ev.preventDefault();
            ev.stopPropagation();
            selectZoneOrStation(zoneBtn.getAttribute('data-zoneclick'));
            return;
          }
          const stepBtn = ev.target.closest('[data-stepclick]');
          if (stepBtn) {
            ev.preventDefault();
            ev.stopPropagation();
            selectZoneOrStation(stepBtn.getAttribute('data-stepclick'));
            return;
          }
        });
      }

      /* Panel Collapse / Expand & KPI Bar Visibility Toggles */
      const toggleKpiBarBtn = document.getElementById('toggleKpiBarBtn');
      const topKpiGrid = document.getElementById('topKpiGrid');
      if (toggleKpiBarBtn && topKpiGrid) {
        toggleKpiBarBtn.addEventListener('click', function () {
          const isHidden = topKpiGrid.classList.toggle('hidden');
          toggleKpiBarBtn.classList.toggle('active', !isHidden);
          updateTopHeaderOffsetVar();
        });
      }

      const toggleOrderPanelBtn = document.getElementById('toggleOrderPanelBtn');
      const orderPanelEl = document.getElementById('orderPanel');
      if (toggleOrderPanelBtn && orderPanelEl) {
        toggleOrderPanelBtn.addEventListener('click', function () {
          const isCollapsed = orderPanelEl.classList.toggle('collapsed');
          toggleOrderPanelBtn.setAttribute('aria-expanded', String(!isCollapsed));
          const iconEl = document.getElementById('toggleOrderPanelIcon');
          const lblEl = document.getElementById('toggleOrderPanelLabel');
          if (iconEl) iconEl.textContent = isCollapsed ? 'expand_more' : 'expand_less';
          if (lblEl) lblEl.textContent = isCollapsed ? 'Show' : 'Hide';
        });
      }

      const toggleDetailPanelBtn = document.getElementById('toggleDetailPanelBtn');
      const detailPanelEl = document.getElementById('detailPanel');
      if (toggleDetailPanelBtn && detailPanelEl) {
        toggleDetailPanelBtn.addEventListener('click', function () {
          const isCollapsed = detailPanelEl.classList.toggle('collapsed');
          toggleDetailPanelBtn.setAttribute('aria-expanded', String(!isCollapsed));
          const iconEl = document.getElementById('toggleDetailPanelIcon');
          const lblEl = document.getElementById('toggleDetailPanelLabel');
          if (iconEl) iconEl.textContent = isCollapsed ? 'expand_more' : 'expand_less';
          if (lblEl) lblEl.textContent = isCollapsed ? 'Show' : 'Hide';
        });
      }

      /* Theme Dropdown with Google Material Symbols Icons: Light / Dark / System */
      const themeDropdownBtn = document.getElementById('themeDropdownBtn');
      const themeDropdownMenu = document.getElementById('themeDropdownMenu');
      const themeDropdownWrap = document.getElementById('themeDropdownWrap');

      if (themeDropdownBtn && themeDropdownMenu) {
        themeDropdownBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const isHidden = themeDropdownMenu.classList.toggle('hidden');
          themeDropdownBtn.setAttribute('aria-expanded', String(!isHidden));
        });

        document.querySelectorAll('#themeDropdownMenu .theme-dropdown-item').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const mode = btn.getAttribute('data-theme-mode');
            applyThemeMode(mode);
            themeDropdownMenu.classList.add('hidden');
            themeDropdownBtn.setAttribute('aria-expanded', 'false');
          });
        });

        document.addEventListener('click', function (ev) {
          if (themeDropdownWrap && !themeDropdownWrap.contains(ev.target)) {
            themeDropdownMenu.classList.add('hidden');
            themeDropdownBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      /* Dynamically track #topHeader height so #orderPanel / #detailPanel never overlap KPI cards */
      window.addEventListener('resize', updateTopHeaderOffsetVar);
      if (window.ResizeObserver) {
        const headerEl = document.getElementById('topHeader');
        if (headerEl) {
          const ro = new ResizeObserver(function () {
            updateTopHeaderOffsetVar();
          });
          ro.observe(headerEl);
        }
      }

      if (window.matchMedia) {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const onSystemChange = function () {
          if (appState.themeMode === 'system') {
            refresh3DSceneThemeColors();
          }
        };
        if (darkQuery.addEventListener) {
          darkQuery.addEventListener('change', onSystemChange);
        } else if (darkQuery.addListener) {
          darkQuery.addListener(onSystemChange);
        }
      }
    }
