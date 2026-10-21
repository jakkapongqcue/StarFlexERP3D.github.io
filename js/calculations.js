/* =========================================================================
       3. ROUTE & BACKWARD YIELD / WASTE CALCULATION ENGINE
       ========================================================================= */
    function getActiveRouteIds() {
      const route = [];
      if (appState.filmSource === 'INHOUSE') {
        route.push('ST_BLOWN');
      }
      route.push('ST_INK');
      route.push('ST_PRINT');
      route.push('ST_LAM');

      if (appState.productType === 'FG_ROLL') {
        route.push('ST_SLIT');
      } else if (appState.productType === 'FG_BAG') {
        if (!appState.skipSlit) route.push('ST_SLIT');
        route.push('ST_BAG');
      } else if (appState.productType === 'FG_SPOUT') {
        if (!appState.skipSlit) route.push('ST_SLIT');
        route.push('ST_BAG');
        route.push('ST_SPOUT');
      }
      return route;
    }

    function formatNum(n, decimals) {
      const d = (decimals === undefined) ? 1 : decimals;
      return Number(n || 0).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: d
      });
    }

    function fmtQtyOrFlow(numVal, unitStr) {
      if (appState.inputMode === 'MINIMAL') {
        return '';
      }
      return formatNum(numVal, unitStr === 'pcs' || unitStr === 'boxes' ? 0 : 1) + ' ' + unitStr;
    }

    function computeOrderPlan() {
      const isMinimal = (appState.inputMode === 'MINIMAL');
      const qty = isMinimal ? 20 : Math.max(0, Number(appState.quantity) || 0);
      const mPerRoll = Math.max(1, Number(appState.metersPerRoll) || 1000);
      const kgPerRoll = Math.max(0.1, Number(appState.kgPerRoll) || 25);
      const pcsPerBox = Math.max(1, Math.round(Number(appState.piecesPerBox) || 300));

      let finalOutputKg = 0;
      let finalRolls = 0;
      let finalMeters = 0;
      let finalPieces = 0;
      let finalBoxes = 0;
      let orderSummaryLabel = '';

      if (appState.productType === 'FG_ROLL') {
        if (appState.unit === 'roll' || isMinimal) {
          finalRolls = qty;
          finalOutputKg = qty * kgPerRoll;
          finalMeters = qty * mPerRoll;
        } else if (appState.unit === 'meter') {
          finalMeters = qty;
          finalRolls = qty / mPerRoll;
          finalOutputKg = finalRolls * kgPerRoll;
        } else {
          finalOutputKg = qty;
          finalRolls = qty / kgPerRoll;
          finalMeters = finalRolls * mPerRoll;
        }
        finalBoxes = Math.max(1, Math.ceil(finalRolls));
        orderSummaryLabel = isMinimal
          ? 'FG Roll'
          : (formatNum(finalRolls, 1) + ' rolls (' + formatNum(finalOutputKg, 1) + ' kg / ' + formatNum(finalMeters, 0) + ' m)');
      } else {
        finalPieces = isMinimal ? 3000 : Math.round(qty);
        finalBoxes = Math.max(1, Math.ceil(finalPieces / pcsPerBox));
        const kgPerPiece = (kgPerRoll / mPerRoll) * 0.32;
        finalOutputKg = Math.max(1, finalPieces * kgPerPiece);
        finalRolls = finalOutputKg / kgPerRoll;
        finalMeters = finalRolls * mPerRoll;
        const pName = (appState.productType === 'FG_BAG') ? 'FG Bag' : 'FG Spout';
        orderSummaryLabel = isMinimal
          ? pName
          : (formatNum(finalPieces, 0) + ' pcs (' + finalBoxes + ' boxes · ' + formatNum(finalOutputKg, 1) + ' kg)');
      }

      const routeIds = getActiveRouteIds();
      const mainChain = routeIds.filter(function (id) {
        return id !== 'ST_BLOWN' && id !== 'ST_INK';
      });

      const stepMap = {};
      let requiredDownstreamKg = finalOutputKg;

      for (let i = mainChain.length - 1; i >= 0; i--) {
        const stId = mainChain[i];
        const wPct = isMinimal ? 0 : Math.min(80, Math.max(0, Number(appState.wasteByStep[stId]) || 0));
        const outKg = requiredDownstreamKg;
        const inKg = outKg / (1 - wPct / 100);
        const wasteKg = inKg - outKg;
        stepMap[stId] = {
          id: stId,
          name: STATION_MAP[stId].name,
          wastePct: wPct,
          inputKg: inKg,
          wasteKg: wasteKg,
          outputKg: outKg
        };
        requiredDownstreamKg = inKg;
      }

      const printInKg = stepMap.ST_PRINT ? stepMap.ST_PRINT.inputKg : finalOutputKg;
      const baseFilmNeededAtPrintKg = printInKg * 0.65;
      const laminateFilmNeededKg = (stepMap.ST_LAM ? stepMap.ST_LAM.inputKg : printInKg) * 0.35;

      let resinNeededKg = 0;
      let blownFilmProducedKg = 0;
      let purchasedFilmNeededKg = 0;

      if (appState.filmSource === 'INHOUSE') {
        const wBlown = isMinimal ? 0 : Math.min(80, Math.max(0, Number(appState.wasteByStep.ST_BLOWN) || 0));
        blownFilmProducedKg = baseFilmNeededAtPrintKg;
        resinNeededKg = blownFilmProducedKg / (1 - wBlown / 100);
        stepMap.ST_BLOWN = {
          id: 'ST_BLOWN',
          name: 'Blown Film',
          wastePct: wBlown,
          inputKg: resinNeededKg,
          wasteKg: resinNeededKg - blownFilmProducedKg,
          outputKg: blownFilmProducedKg
        };
      } else {
        purchasedFilmNeededKg = baseFilmNeededAtPrintKg;
      }

      const mixedInkNeededKg = Math.max(2, printInKg * 0.06);
      const wInk = isMinimal ? 0 : Math.min(80, Math.max(0, Number(appState.wasteByStep.ST_INK) || 0));
      const rmInkInputKg = mixedInkNeededKg / (1 - wInk / 100);
      stepMap.ST_INK = {
        id: 'ST_INK',
        name: 'Ink Mix',
        wastePct: wInk,
        inputKg: rmInkInputKg,
        wasteKg: rmInkInputKg - mixedInkNeededKg,
        outputKg: mixedInkNeededKg
      };

      const solventL = Math.max(1, mixedInkNeededKg * 0.45);
      const adhesiveKg = Math.max(1, laminateFilmNeededKg * 0.08);
      const cylindersUsed = 4;
      const paperCoresUsed = routeIds.indexOf('ST_SLIT') !== -1 ? Math.max(2, Math.ceil(finalRolls)) : 0;
      const boxesUsed = finalBoxes;
      const spoutsUsed = appState.productType === 'FG_SPOUT'
        ? Math.ceil(finalPieces / (1 - (isMinimal ? 0 : (Number(appState.wasteByStep.ST_SPOUT) || 0)) / 100))
        : 0;

      const orderedStepResults = routeIds.map(function (id) { return stepMap[id]; });
      let totalWasteKg = 0;
      let totalInputStartKg = (appState.filmSource === 'INHOUSE' ? resinNeededKg : purchasedFilmNeededKg) + laminateFilmNeededKg + rmInkInputKg;
      orderedStepResults.forEach(function (s) { totalWasteKg += s.wasteKg; });
      const overallWastePct = totalInputStartKg > 0 ? (totalWasteKg / totalInputStartKg) * 100 : 0;

      const fgPalletsCount = isMinimal ? 3 : Math.min(6, Math.max(1, Math.ceil(finalBoxes / 8)));

      return {
        routeIds: routeIds,
        steps: orderedStepResults,
        stepMap: stepMap,
        finalOutputKg: finalOutputKg,
        finalRolls: finalRolls,
        finalMeters: finalMeters,
        finalPieces: finalPieces,
        finalBoxes: finalBoxes,
        fgPalletsCount: fgPalletsCount,
        orderSummaryLabel: orderSummaryLabel,
        overallWastePct: overallWastePct,
        rmConsumed: {
          resinKg: resinNeededKg,
          blownFilmKg: blownFilmProducedKg,
          purchasedFilmKg: purchasedFilmNeededKg,
          laminateFilmKg: laminateFilmNeededKg,
          rmInkKg: rmInkInputKg,
          mixedInkKg: mixedInkNeededKg,
          solventL: solventL,
          adhesiveKg: adhesiveKg,
          cylinders: cylindersUsed,
          paperCores: paperCoresUsed,
          boxes: boxesUsed,
          spouts: spoutsUsed
        }
      };
    }
