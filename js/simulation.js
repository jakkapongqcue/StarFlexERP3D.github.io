/* =========================================================================
   StarFlexERP 3D - Simulation Sequencer & Concurrent Pipeline Engine
   - Sequential Task Sequencer (Move, Produce, Stock, Deliver)
   - Concurrent Multi-Station Digital Twin Pipeline
   - Vehicle cargo mounting & rack visual population
   - Real-time step kinematics & animation frame updates
   ========================================================================= */

    function mountCargoOnVehicle(vehicleMesh, primaryMatKey, itemsList) {
      const holder = vehicleMesh.userData.cargoHolder;
      while (holder.children.length > 0) {
        holder.remove(holder.children[0]);
      }
      if (!primaryMatKey) {
        vehicleMesh.userData.palletTag.visible = false;
        return;
      }
      const cargo = createCargoVisualByKey(primaryMatKey);
      holder.add(cargo);
      applyShadowFlags(cargo);
      const tag = vehicleMesh.userData.palletTag;
      tag.el.innerHTML = formatPalletTagHtml(itemsList);
      tag.visible = true;
    }

    function buildSimulationTasks(plan) {
      const tasks = [];
      const rm = plan.rmConsumed;
      const isMinimal = (appState.inputMode === 'MINIMAL');

      function qTxt(val, unit) {
        return isMinimal ? '' : (' ' + formatNum(val, unit === 'pcs' || unit === 'boxes' ? 0 : 1) + ' ' + unit);
      }

      function getTiming(stId) {
        return (appState.stationTiming && appState.stationTiming[stId]) || DEFAULT_TIMING_MAP[stId] || { inputMin: 15, outputMin: 18 };
      }

      // 1. Upstream: Blown Film (only when Film Source = INHOUSE)
      if (appState.filmSource === 'INHOUSE') {
        const tBlown = getTiming('ST_BLOWN');
        const inSecBlown = tBlown.inputMin * 0.1;
        const outSecBlown = Math.max(inSecBlown, tBlown.outputMin * 0.1);

        tasks.push({
          type: 'MOVE',
          stepId: 'ST_BLOWN',
          vehicleKey: 'rmForklift',
          waypoints: buildRmToStationPath('RESIN', 'ST_BLOWN', false),
          speed: 28,
          cargoKey: 'RESIN',
          cargoItems: [{ key: 'RESIN', qtyText: fmtQtyOrFlow(rm.resinKg, 'kg') }],
          onStart: function () {
            if (!isMinimal) appState.rmStock.RESIN = Math.max(0, appState.rmStock.RESIN - rm.resinKg);
            appendEventLog('Forklift #1: Resin bags' + qTxt(rm.resinKg, 'kg') + ' → 1. Blown Film');
          },
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_BLOWN;
            if (stObj) setBayCargo(stObj.infeedBay, 'RESIN');
          }
        });

        tasks.push({
          type: 'PROCESS',
          stepId: 'ST_BLOWN',
          stationId: 'ST_BLOWN',
          inputMin: tBlown.inputMin,
          outputMin: tBlown.outputMin,
          inputDuration: inSecBlown,
          duration: outSecBlown,
          inBayCargoKey: 'RESIN',
          outBayCargoKey: 'BLOWN_FILM',
          inLabel: 'Resin bags' + qTxt(rm.resinKg, 'kg'),
          outLabel: 'Blown Film' + qTxt(rm.blownFilmKg, 'kg'),
          logMsg: 'Station 1 (Blown Film): Extruding tubular film bubble → Blown Film Roll' + qTxt(rm.blownFilmKg, 'kg'),
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_BLOWN;
            if (stObj) {
              clearBayCargo(stObj.infeedBay);
              setBayCargo(stObj.outfeedBay, 'BLOWN_FILM');
            }
          }
        });

        tasks.push({
          type: 'MOVE',
          stepId: 'ST_BLOWN',
          sourceStationId: 'ST_BLOWN',
          vehicleKey: 'rmForklift',
          waypoints: buildRmToStationPath('BLOWN_FILM', 'ST_BLOWN', true),
          speed: 28,
          cargoKey: 'BLOWN_FILM',
          cargoItems: [{ key: 'BLOWN_FILM', qtyText: fmtQtyOrFlow(rm.blownFilmKg, 'kg') }],
          onStart: function () {
            const stObj = sceneObjects.stationObjs.ST_BLOWN;
            if (stObj) clearBayCargo(stObj.outfeedBay);
            appendEventLog('Forklift #1: Blown Film' + qTxt(rm.blownFilmKg, 'kg') + ' → RM WH');
          },
          onComplete: function () {
            if (!isMinimal) appState.rmStock.BLOWN_FILM += rm.blownFilmKg;
            appState.completedSteps.ST_BLOWN = true;
          }
        });
      }

      // 2. Upstream: Ink Mix
      const tInk = getTiming('ST_INK');
      const inSecInk = tInk.inputMin * 0.1;
      const outSecInk = Math.max(inSecInk, tInk.outputMin * 0.1);

      tasks.push({
        type: 'MOVE',
        stepId: 'ST_INK',
        vehicleKey: 'rmForklift',
        waypoints: buildRmToStationPath('RM_INK', 'ST_INK', false),
        speed: 28,
        cargoKey: 'RM_INK',
        cargoItems: [{ key: 'RM_INK', qtyText: fmtQtyOrFlow(rm.rmInkKg, 'kg') }],
        onStart: function () {
          if (!isMinimal) appState.rmStock.RM_INK = Math.max(0, appState.rmStock.RM_INK - rm.rmInkKg);
          appendEventLog('Forklift #1: Base-color ink drums' + qTxt(rm.rmInkKg, 'kg') + ' → 2. Ink Mix');
        },
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_INK;
          if (stObj) setBayCargo(stObj.infeedBay, 'RM_INK');
        }
      });

      tasks.push({
        type: 'PROCESS',
        stepId: 'ST_INK',
        stationId: 'ST_INK',
        inputMin: tInk.inputMin,
        outputMin: tInk.outputMin,
        inputDuration: inSecInk,
        duration: outSecInk,
        inBayCargoKey: 'RM_INK',
        outBayCargoKey: 'MIXED_INK',
        inLabel: 'Base-color ink' + qTxt(rm.rmInkKg, 'kg'),
        outLabel: 'Ready-to-use Ink' + qTxt(rm.mixedInkKg, 'kg'),
        logMsg: 'Station 2 (Ink Mix): Mixing color spec → Ready-to-use Ink' + qTxt(rm.mixedInkKg, 'kg'),
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_INK;
          if (stObj) {
            clearBayCargo(stObj.infeedBay);
            setBayCargo(stObj.outfeedBay, 'MIXED_INK');
          }
        }
      });

      tasks.push({
        type: 'MOVE',
        stepId: 'ST_INK',
        sourceStationId: 'ST_INK',
        vehicleKey: 'rmForklift',
        waypoints: buildRmToStationPath('MIXED_INK', 'ST_INK', true),
        speed: 28,
        cargoKey: 'MIXED_INK',
        cargoItems: [{ key: 'MIXED_INK', qtyText: fmtQtyOrFlow(rm.mixedInkKg, 'kg') }],
        onStart: function () {
          const stObj = sceneObjects.stationObjs.ST_INK;
          if (stObj) clearBayCargo(stObj.outfeedBay);
          appendEventLog('Forklift #1: Ready-to-use Ink' + qTxt(rm.mixedInkKg, 'kg') + ' → RM WH (Chemical WH)');
        },
        onComplete: function () {
          if (!isMinimal) appState.rmStock.MIXED_INK += rm.mixedInkKg;
          appState.completedSteps.ST_INK = true;
        }
      });

      // 3. Printing
      const baseFilmKey = (appState.filmSource === 'INHOUSE') ? 'BLOWN_FILM' : 'PURCHASED_FILM';
      const baseFilmQty = (appState.filmSource === 'INHOUSE') ? rm.blownFilmKg : rm.purchasedFilmKg;
      const tPrint = getTiming('ST_PRINT');
      const inSecPrint = tPrint.inputMin * 0.1;
      const outSecPrint = Math.max(inSecPrint, tPrint.outputMin * 0.1);

      tasks.push({
        type: 'MOVE',
        stepId: 'ST_PRINT',
        vehicleKey: 'rmForklift',
        waypoints: buildRmToStationPath(baseFilmKey, 'ST_PRINT', false),
        speed: 28,
        cargoKey: baseFilmKey,
        cargoItems: [
          { key: baseFilmKey, qtyText: fmtQtyOrFlow(baseFilmQty, 'kg') },
          { key: 'CYLINDER', qtyText: fmtQtyOrFlow(rm.cylinders, 'pcs') },
          { key: 'MIXED_INK', qtyText: fmtQtyOrFlow(rm.mixedInkKg, 'kg') },
          { key: 'SOLVENT', qtyText: fmtQtyOrFlow(rm.solventL, 'L') }
        ],
        onStart: function () {
          if (!isMinimal) {
            appState.rmStock[baseFilmKey] = Math.max(0, appState.rmStock[baseFilmKey] - baseFilmQty);
            appState.rmStock.CYLINDER = Math.max(0, appState.rmStock.CYLINDER - rm.cylinders);
            appState.rmStock.MIXED_INK = Math.max(0, appState.rmStock.MIXED_INK - rm.mixedInkKg);
            appState.rmStock.SOLVENT = Math.max(0, appState.rmStock.SOLVENT - rm.solventL);
          }
          appendEventLog(
            'Forklift #1: ' + MATERIAL_CATALOG[baseFilmKey].name + qTxt(baseFilmQty, 'kg') +
            ' + Cylinder + Ink + Solvent → 3. Printing'
          );
        },
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_PRINT;
          if (stObj) setBayCargo(stObj.infeedBay, baseFilmKey);
        }
      });

      tasks.push({
        type: 'PROCESS',
        stepId: 'ST_PRINT',
        stationId: 'ST_PRINT',
        inputMin: tPrint.inputMin,
        outputMin: tPrint.outputMin,
        inputDuration: inSecPrint,
        duration: outSecPrint,
        inBayCargoKey: baseFilmKey,
        outBayCargoKey: 'PRINTING_ROLL',
        inLabel: MATERIAL_CATALOG[baseFilmKey].name + ' + Cylinder + Ink + Solvent',
        outLabel: 'Printing Roll' + qTxt(plan.stepMap.ST_PRINT.outputKg, 'kg'),
        logMsg: 'Station 3 (Printing): Unwinder feeding web through rotogravure units → Rewinder Printing Roll' + qTxt(plan.stepMap.ST_PRINT.outputKg, 'kg'),
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_PRINT;
          if (stObj) {
            clearBayCargo(stObj.infeedBay);
            setBayCargo(stObj.outfeedBay, 'PRINTING_ROLL');
          }
          appState.completedSteps.ST_PRINT = true;
        }
      });

      // 4. Laminate
      const tLam = getTiming('ST_LAM');
      const inSecLam = tLam.inputMin * 0.1;
      const outSecLam = Math.max(inSecLam, tLam.outputMin * 0.1);

      tasks.push({
        type: 'MOVE',
        stepId: 'ST_LAM',
        vehicleKey: 'rmForklift',
        waypoints: buildRmToStationPath('LAMINATE_FILM', 'ST_LAM', false),
        speed: 28,
        cargoKey: 'LAMINATE_FILM',
        cargoItems: [
          { key: 'LAMINATE_FILM', qtyText: fmtQtyOrFlow(rm.laminateFilmKg, 'kg') },
          { key: 'ADHESIVE', qtyText: fmtQtyOrFlow(rm.adhesiveKg, 'kg') }
        ],
        onStart: function () {
          if (!isMinimal) {
            appState.rmStock.LAMINATE_FILM = Math.max(0, appState.rmStock.LAMINATE_FILM - rm.laminateFilmKg);
            appState.rmStock.ADHESIVE = Math.max(0, appState.rmStock.ADHESIVE - rm.adhesiveKg);
          }
          appendEventLog('Forklift #1: Laminate Film' + qTxt(rm.laminateFilmKg, 'kg') + ' + Adhesive → 4. Laminate');
        },
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_LAM;
          if (stObj) setBayCargo(stObj.infeedBay, 'LAMINATE_FILM');
        }
      });

      tasks.push({
        type: 'MOVE',
        stepId: 'ST_LAM',
        sourceStationId: 'ST_PRINT',
        vehicleKey: 'handPalletTruck',
        waypoints: buildWipHptPath('ST_PRINT', 'ST_LAM'),
        speed: 14,
        cargoKey: 'PRINTING_ROLL',
        cargoItems: [{ key: 'PRINTING_ROLL', qtyText: fmtQtyOrFlow(plan.stepMap.ST_PRINT.outputKg, 'kg') }],
        onStart: function () {
          const printObj = sceneObjects.stationObjs.ST_PRINT;
          if (printObj) clearBayCargo(printObj.outfeedBay);
          appendEventLog('Hand Pallet Truck: Printing Roll' + qTxt(plan.stepMap.ST_PRINT.outputKg, 'kg') + ' → 4. Laminate');
        },
        onComplete: function () {
          const lamObj = sceneObjects.stationObjs.ST_LAM;
          if (lamObj) setBayCargo(lamObj.infeedBay, 'PRINTING_ROLL');
        }
      });

      tasks.push({
        type: 'PROCESS',
        stepId: 'ST_LAM',
        stationId: 'ST_LAM',
        inputMin: tLam.inputMin,
        outputMin: tLam.outputMin,
        inputDuration: inSecLam,
        duration: outSecLam,
        inBayCargoKey: 'PRINTING_ROLL',
        outBayCargoKey: 'LAMINATE_ROLL',
        inLabel: 'Printing Roll + Laminate Film + Adhesive',
        outLabel: 'Laminate Roll' + qTxt(plan.stepMap.ST_LAM.outputKg, 'kg'),
        logMsg: 'Station 4 (Laminate): Unwinders bonding Printed Roll & Laminate Film → Rewinder Laminate Roll' + qTxt(plan.stepMap.ST_LAM.outputKg, 'kg'),
        onComplete: function () {
          const stObj = sceneObjects.stationObjs.ST_LAM;
          if (stObj) {
            clearBayCargo(stObj.infeedBay);
            setBayCargo(stObj.outfeedBay, 'LAMINATE_ROLL');
          }
          appState.completedSteps.ST_LAM = true;
        }
      });

      let lastStationId = 'ST_LAM';
      let lastWipCargoKey = 'LAMINATE_ROLL';
      let lastWipQtyStr = fmtQtyOrFlow(plan.stepMap.ST_LAM.outputKg, 'kg');

      // 5. Slit
      if (plan.routeIds.indexOf('ST_SLIT') !== -1) {
        const tSlit = getTiming('ST_SLIT');
        const inSecSlit = tSlit.inputMin * 0.1;
        const outSecSlit = Math.max(inSecSlit, tSlit.outputMin * 0.1);

        const slitRmCargo = [{ key: 'PAPERCORE', qtyText: fmtQtyOrFlow(rm.paperCores, 'pcs') }];
        if (appState.productType === 'FG_ROLL') {
          slitRmCargo.push({ key: 'BOX', qtyText: fmtQtyOrFlow(rm.boxes, 'boxes') });
        }

        tasks.push({
          type: 'MOVE',
          stepId: 'ST_SLIT',
          vehicleKey: 'rmForklift',
          waypoints: buildRmToStationPath('PAPERCORE', 'ST_SLIT', false),
          speed: 28,
          cargoKey: 'PAPERCORE',
          cargoItems: slitRmCargo,
          onStart: function () {
            if (!isMinimal) {
              appState.rmStock.PAPERCORE = Math.max(0, appState.rmStock.PAPERCORE - rm.paperCores);
              if (appState.productType === 'FG_ROLL') {
                appState.rmStock.BOX = Math.max(0, appState.rmStock.BOX - rm.boxes);
              }
            }
            appendEventLog('Forklift #1: Papercore' + qTxt(rm.paperCores, 'pcs') + (appState.productType === 'FG_ROLL' ? ' + Corrugated boxes' : '') + ' → 5. Slit');
          },
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_SLIT;
            if (stObj) setBayCargo(stObj.infeedBay, 'PAPERCORE');
          }
        });

        const slitSourceSt = lastStationId;
        const slitCargoIn = lastWipCargoKey;
        tasks.push({
          type: 'MOVE',
          stepId: 'ST_SLIT',
          sourceStationId: slitSourceSt,
          vehicleKey: 'handPalletTruck',
          waypoints: buildWipHptPath(slitSourceSt, 'ST_SLIT'),
          speed: 14,
          cargoKey: slitCargoIn,
          cargoItems: [{ key: slitCargoIn, qtyText: lastWipQtyStr }],
          onStart: function () {
            const prevStObj = sceneObjects.stationObjs[slitSourceSt];
            if (prevStObj) clearBayCargo(prevStObj.outfeedBay);
            appendEventLog('Hand Pallet Truck: Laminate Roll → 5. Slit');
          },
          onComplete: function () {
            const slitObj = sceneObjects.stationObjs.ST_SLIT;
            if (slitObj) setBayCargo(slitObj.infeedBay, slitCargoIn);
          }
        });

        tasks.push({
          type: 'PROCESS',
          stepId: 'ST_SLIT',
          stationId: 'ST_SLIT',
          inputMin: tSlit.inputMin,
          outputMin: tSlit.outputMin,
          inputDuration: inSecSlit,
          duration: outSecSlit,
          inBayCargoKey: slitCargoIn,
          outBayCargoKey: 'SLIT_ROLL',
          inLabel: 'Laminate Roll + Papercore',
          outLabel: 'Slit Roll' + qTxt(plan.finalRolls, 'rolls'),
          logMsg: 'Station 5 (Slit): Slitting master web into narrow mint-green customer rolls',
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_SLIT;
            if (stObj) {
              clearBayCargo(stObj.infeedBay);
              setBayCargo(stObj.outfeedBay, 'SLIT_ROLL');
            }
            appState.completedSteps.ST_SLIT = true;
          }
        });

        lastStationId = 'ST_SLIT';
        lastWipCargoKey = 'SLIT_ROLL';
        lastWipQtyStr = fmtQtyOrFlow(plan.finalRolls, 'rolls');
      }

      // 6. Bag
      if (plan.routeIds.indexOf('ST_BAG') !== -1) {
        const tBag = getTiming('ST_BAG');
        const inSecBag = tBag.inputMin * 0.1;
        const outSecBag = Math.max(inSecBag, tBag.outputMin * 0.1);

        const boxDeliverAtBag = (appState.productType === 'FG_BAG');
        if (boxDeliverAtBag) {
          tasks.push({
            type: 'MOVE',
            stepId: 'ST_BAG',
            vehicleKey: 'rmForklift',
            waypoints: buildRmToStationPath('BOX', 'ST_BAG', false),
            speed: 28,
            cargoKey: 'BOX',
            cargoItems: [{ key: 'BOX', qtyText: fmtQtyOrFlow(rm.boxes, 'boxes') }],
            onStart: function () {
              if (!isMinimal) appState.rmStock.BOX = Math.max(0, appState.rmStock.BOX - rm.boxes);
              appendEventLog('Forklift #1: Corrugated boxes' + qTxt(rm.boxes, 'boxes') + ' → 6. Bag');
            },
            onComplete: function () {
              const stObj = sceneObjects.stationObjs.ST_BAG;
              if (stObj) setBayCargo(stObj.infeedBay, 'BOX');
            }
          });
        }

        const bagSourceSt = lastStationId;
        const bagCargoIn = lastWipCargoKey;
        tasks.push({
          type: 'MOVE',
          stepId: 'ST_BAG',
          sourceStationId: bagSourceSt,
          vehicleKey: 'handPalletTruck',
          waypoints: buildWipHptPath(bagSourceSt, 'ST_BAG'),
          speed: 14,
          cargoKey: bagCargoIn,
          cargoItems: [{ key: bagCargoIn, qtyText: lastWipQtyStr }],
          onStart: function () {
            const prevStObj = sceneObjects.stationObjs[bagSourceSt];
            if (prevStObj) clearBayCargo(prevStObj.outfeedBay);
            appendEventLog('Hand Pallet Truck: ' + MATERIAL_CATALOG[bagCargoIn].name + ' → 6. Bag');
          },
          onComplete: function () {
            const bagObj = sceneObjects.stationObjs.ST_BAG;
            if (bagObj) setBayCargo(bagObj.infeedBay, bagCargoIn);
          }
        });

        tasks.push({
          type: 'PROCESS',
          stepId: 'ST_BAG',
          stationId: 'ST_BAG',
          inputMin: tBag.inputMin,
          outputMin: tBag.outputMin,
          inputDuration: inSecBag,
          duration: outSecBag,
          inBayCargoKey: bagCargoIn,
          outBayCargoKey: 'FG_BAG_BOX',
          inLabel: MATERIAL_CATALOG[bagCargoIn].name + (boxDeliverAtBag ? ' + Corrugated Box' : ''),
          outLabel: 'Bag (Stand-up Pouch)' + qTxt(plan.finalPieces, 'pcs'),
          logMsg: 'Station 6 (Bag): Dual-lane heat-sealing pouches' + qTxt(plan.finalPieces, 'pcs'),
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_BAG;
            if (stObj) {
              clearBayCargo(stObj.infeedBay);
              setBayCargo(stObj.outfeedBay, 'FG_BAG_BOX');
            }
            appState.completedSteps.ST_BAG = true;
          }
        });

        lastStationId = 'ST_BAG';
        lastWipCargoKey = 'FG_BAG_BOX';
        lastWipQtyStr = fmtQtyOrFlow(plan.finalBoxes, 'boxes');
      }

      // 7. Spout
      if (plan.routeIds.indexOf('ST_SPOUT') !== -1) {
        const tSpout = getTiming('ST_SPOUT');
        const inSecSpout = tSpout.inputMin * 0.1;
        const outSecSpout = Math.max(inSecSpout, tSpout.outputMin * 0.1);

        tasks.push({
          type: 'MOVE',
          stepId: 'ST_SPOUT',
          vehicleKey: 'rmForklift',
          waypoints: buildRmToStationPath('SPOUT', 'ST_SPOUT', false),
          speed: 28,
          cargoKey: 'SPOUT',
          cargoItems: [
            { key: 'SPOUT', qtyText: fmtQtyOrFlow(rm.spouts, 'pcs') },
            { key: 'BOX', qtyText: fmtQtyOrFlow(rm.boxes, 'boxes') }
          ],
          onStart: function () {
            if (!isMinimal) {
              appState.rmStock.SPOUT = Math.max(0, appState.rmStock.SPOUT - rm.spouts);
              appState.rmStock.BOX = Math.max(0, appState.rmStock.BOX - rm.boxes);
            }
            appendEventLog('Forklift #1: Spout caps' + qTxt(rm.spouts, 'pcs') + ' + Corrugated boxes → 7. Spout');
          },
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_SPOUT;
            if (stObj) setBayCargo(stObj.infeedBay, 'SPOUT');
          }
        });

        const spoutSourceSt = lastStationId;
        const spoutCargoIn = 'FG_BAG_BOX';
        tasks.push({
          type: 'MOVE',
          stepId: 'ST_SPOUT',
          sourceStationId: spoutSourceSt,
          vehicleKey: 'handPalletTruck',
          waypoints: buildWipHptPath(spoutSourceSt, 'ST_SPOUT'),
          speed: 14,
          cargoKey: spoutCargoIn,
          cargoItems: [{ key: spoutCargoIn, qtyText: fmtQtyOrFlow(plan.finalPieces, 'pcs') }],
          onStart: function () {
            const prevStObj = sceneObjects.stationObjs[spoutSourceSt];
            if (prevStObj) clearBayCargo(prevStObj.outfeedBay);
            appendEventLog('Hand Pallet Truck: Pouches → 7. Spout');
          },
          onComplete: function () {
            const spoutObj = sceneObjects.stationObjs.ST_SPOUT;
            if (spoutObj) setBayCargo(spoutObj.infeedBay, spoutCargoIn);
          }
        });

        tasks.push({
          type: 'PROCESS',
          stepId: 'ST_SPOUT',
          stationId: 'ST_SPOUT',
          inputMin: tSpout.inputMin,
          outputMin: tSpout.outputMin,
          inputDuration: inSecSpout,
          duration: outSecSpout,
          inBayCargoKey: 'FG_BAG_BOX',
          outBayCargoKey: 'FG_SPOUT_BOX',
          inLabel: 'Pouches + Spout Caps + Corrugated Box',
          outLabel: 'Bag with Spout' + qTxt(plan.finalBoxes, 'boxes'),
          logMsg: 'Station 7 (Spout): Ultrasonic welding spout fitments onto pouches',
          onComplete: function () {
            const stObj = sceneObjects.stationObjs.ST_SPOUT;
            if (stObj) {
              clearBayCargo(stObj.infeedBay);
              setBayCargo(stObj.outfeedBay, 'FG_SPOUT_BOX');
            }
            appState.completedSteps.ST_SPOUT = true;
          }
        });

        lastStationId = 'ST_SPOUT';
        lastWipCargoKey = 'FG_SPOUT_BOX';
        lastWipQtyStr = fmtQtyOrFlow(plan.finalBoxes, 'boxes');
      }

      // 8. FG Forklift collects Finished Goods from final PRD station and stores in Warehouse FG racks
      const fgRackTarget = sceneObjects.fgRackSlots[0];
      const finalStationForFg = lastStationId;
      const finalWipKeyForFg = lastWipCargoKey;
      tasks.push({
        type: 'MOVE',
        stepId: 'STEP_FG',
        sourceStationId: finalStationForFg,
        vehicleKey: 'fgForklift',
        waypoints: buildStationToFgRackPath(finalStationForFg, fgRackTarget),
        speed: 26,
        cargoKey: finalWipKeyForFg,
        cargoItems: [{ key: finalWipKeyForFg, qtyText: lastWipQtyStr }],
        onStart: function () {
          const prevStObj = sceneObjects.stationObjs[finalStationForFg];
          if (prevStObj) clearBayCargo(prevStObj.outfeedBay);
          appendEventLog('FG Forklift #2: Collecting Finished Goods from PRD → Warehouse FG racks');
        },
        onComplete: function () {
          appState.fgStockPallets = plan.fgPalletsCount;
          appState.fgProducedDisplay = plan.orderSummaryLabel;
          populateFgRackVisuals(finalWipKeyForFg, plan.fgPalletsCount);
          appState.completedSteps.STEP_FG = true;
        }
      });

      // 9. Delivery Forklift loads FG pallets onto Container Truck at Loading Yard
      tasks.push({
        type: 'MOVE',
        stepId: 'STEP_DELIVERED',
        vehicleKey: 'deliveryForklift',
        waypoints: [
          new THREE.Vector3(fgRackTarget.x, 0.0, fgRackTarget.z + 2.6),
          new THREE.Vector3(63, 0.0, fgRackTarget.z + 2.6),
          new THREE.Vector3(63, 0.0, -4),
          new THREE.Vector3(75, 0.0, -4)
        ],
        speed: 22,
        cargoKey: finalWipKeyForFg,
        cargoItems: [{ key: finalWipKeyForFg, qtyText: lastWipQtyStr }],
        onStart: function () {
          clearFgRackVisuals();
          appState.fgStockPallets = 0;
          appendEventLog('Delivery Forklift #3: Loading FG pallets onto Container Truck in Loading Yard');
        },
        onComplete: function () {
          const loadedCargo = createCargoVisualByKey(finalWipKeyForFg);
          sceneObjects.containerTruck.userData.loadedPalletsGroup.add(loadedCargo);
          mountCargoOnVehicle(sceneObjects.deliveryForklift, null, []);
        }
      });

      // 10. Container Truck departs from Loading Yard
      tasks.push({
        type: 'TRUCK_DEPART',
        stepId: 'STEP_DELIVERED',
        duration: 2.5,
        onStart: function () {
          appendEventLog('Container Truck: Departing Loading Yard (' + plan.orderSummaryLabel + ')');
        },
        onComplete: function () {
          appState.completedSteps.STEP_DELIVERED = true;
          appendEventLog('Order Completed: ' + plan.orderSummaryLabel + ' delivered.');
        }
      });

      return tasks;
    }

    function clearFgRackVisuals() {
      sceneObjects.fgStoredMeshes.forEach(function (m) {
        scene.remove(m);
      });
      sceneObjects.fgStoredMeshes = [];
      const truckLoaded = sceneObjects.containerTruck.userData.loadedPalletsGroup;
      while (truckLoaded.children.length > 0) {
        truckLoaded.remove(truckLoaded.children[0]);
      }
    }

    function populateFgRackVisuals(cargoKey, count) {
      clearFgRackVisuals();
      const cap = Math.min(sceneObjects.fgRackSlots.length, Math.max(1, count));
      for (let i = 0; i < cap; i++) {
        const slot = sceneObjects.fgRackSlots[i];
        const m = createCargoVisualByKey(cargoKey);
        m.position.copy(slot);
        applyShadowFlags(m);
        scene.add(m);
        sceneObjects.fgStoredMeshes.push(m);
      }
    }

    function startNextTask() {
      appState.currentTaskIndex++;
      if (appState.currentTaskIndex >= appState.tasks.length) {
        if (appState.loopRun) {
          appState.loopCycleCount++;
          appendEventLog('Loop Mode: Starting cycle #' + (appState.loopCycleCount + 1) + ' automatically...');
          resetFleetAndPositionsOnly();
          appState.currentTaskIndex = -1;
          startNextTask();
          return;
        }
        appState.simStatus = 'COMPLETED';
        appState.orderProgressPct = 100;
        appState.activeStepId = 'STEP_DELIVERED';
        updateDashboardUI();
        refreshAll3DTextLabels();
        return;
      }

      const task = appState.tasks[appState.currentTaskIndex];
      task.elapsed = 0;
      appState.activeStepId = task.stepId;
      appState.orderProgressPct = Math.round((appState.currentTaskIndex / appState.tasks.length) * 100);

      if (task.onStart) task.onStart();

      if (task.type === 'MOVE') {
        const veh = sceneObjects[task.vehicleKey];
        task.totalDist = computePathLength(task.waypoints);
        task.duration = Math.max(0.8, task.totalDist / (task.speed || 22));
        mountCargoOnVehicle(veh, task.cargoKey, task.cargoItems);
      } else if (task.type === 'PROCESS') {
        const stObj = sceneObjects.stationObjs[task.stationId];
        const hasInput = stObj ? bayHasCargo(stObj.infeedBay) : false;
        task.inputConsumed = false;
        task.outputProduced = false;
        const rt = appState.stationRuntime[task.stationId];
        if (rt) {
          rt.status = hasInput ? 'RUNNING' : 'WAITING_INPUT';
          rt.activeInputs = task.inLabel;
          rt.activeOutput = task.outLabel;
        }
        if (task.logMsg) appendEventLog(task.logMsg);
      }

      renderStationTimingGrid();
      updateDashboardUI();
      refreshAll3DTextLabels();
    }

    function initConcurrentPipeline(plan) {
      // Activate all stations in route
      plan.routeIds.forEach(function (stId) {
        if (appState.stationRuntime[stId]) {
          appState.stationRuntime[stId].status = 'RUNNING';
          appState.stationRuntime[stId].activeInputs = STATION_MAP[stId].inputSummary;
          appState.stationRuntime[stId].activeOutput = STATION_MAP[stId].outputSummary;
        }
        const stObj = sceneObjects.stationObjs[stId];
        if (stObj && stObj.beaconMat) stObj.beaconMat.color.setHex(0x22c55e);
      });

      // RM Missions along Westbound Lane (z = -1.2)
      const rmMissions = [
        { fromKey: 'RESIN', toStation: 'ST_BLOWN', cargoKey: 'RESIN', items: [{ key: 'RESIN', qtyText: 'Resin Sacks' }] },
        { fromKey: 'RM_INK', toStation: 'ST_INK', cargoKey: 'RM_INK', items: [{ key: 'RM_INK', qtyText: 'Ink Drums' }] },
        { fromKey: (appState.filmSource === 'INHOUSE' ? 'BLOWN_FILM' : 'PURCHASED_FILM'), toStation: 'ST_PRINT', cargoKey: 'PURCHASED_FILM', items: [{ key: 'PURCHASED_FILM', qtyText: 'Substrate Film' }, { key: 'CYLINDER', qtyText: 'Cylinders' }] },
        { fromKey: 'ADHESIVE', toStation: 'ST_LAM', cargoKey: 'ADHESIVE', items: [{ key: 'ADHESIVE', qtyText: 'Adhesive' }, { key: 'LAMINATE_FILM', qtyText: 'Barrier Film' }] },
        { fromKey: 'PAPERCORE', toStation: 'ST_SLIT', cargoKey: 'PAPERCORE', items: [{ key: 'PAPERCORE', qtyText: 'Papercores' }] },
        { fromKey: 'BOX', toStation: 'ST_BAG', cargoKey: 'BOX', items: [{ key: 'BOX', qtyText: 'Carton Boxes' }] },
        { fromKey: 'SPOUT', toStation: 'ST_SPOUT', cargoKey: 'SPOUT', items: [{ key: 'SPOUT', qtyText: 'Spout Caps' }] }
      ].filter(function (m) {
        return plan.routeIds.indexOf(m.toStation) !== -1;
      });

      // Hand Pallet Truck Missions along Eastbound Lane (z = +1.2)
      const hptMissions = [
        { fromStation: 'ST_PRINT', toZone: 'ZONE_PRD_WH', cargoKey: 'PRINTING_ROLL', items: [{ key: 'PRINTING_ROLL', qtyText: 'Printed Roll → PRD WH' }] },
        { fromZone: 'ZONE_PRD_WH', toStation: 'ST_LAM', cargoKey: 'PRINTING_ROLL', items: [{ key: 'PRINTING_ROLL', qtyText: 'PRD WH → Laminate' }] },
        { fromStation: 'ST_LAM', toZone: 'ZONE_PRD_WH', cargoKey: 'LAMINATE_ROLL', items: [{ key: 'LAMINATE_ROLL', qtyText: 'Laminate Roll → Curing' }] },
        { fromZone: 'ZONE_PRD_WH', toStation: 'ST_SLIT', cargoKey: 'LAMINATE_ROLL', items: [{ key: 'LAMINATE_ROLL', qtyText: 'Cured Roll → Slit' }] },
        { fromStation: 'ST_SLIT', toStation: 'ST_BAG', cargoKey: 'SLIT_ROLL', items: [{ key: 'SLIT_ROLL', qtyText: 'Slit Rolls → Bag' }] },
        { fromStation: 'ST_BAG', toStation: 'ST_SPOUT', cargoKey: 'FG_BAG_BOX', items: [{ key: 'FG_BAG_BOX', qtyText: 'Pouches → Spout' }] }
      ].filter(function (m) {
        const fromOk = !m.fromStation || plan.routeIds.indexOf(m.fromStation) !== -1;
        const toOk = !m.toStation || plan.routeIds.indexOf(m.toStation) !== -1;
        return fromOk && toOk;
      });

      const initialRM = rmMissions[0] || { fromKey: 'RESIN', toStation: 'ST_BLOWN', cargoKey: 'RESIN', items: [{ key: 'RESIN', qtyText: 'Resin Sacks' }] };
      const initialHPT = hptMissions[0] || { fromStation: 'ST_PRINT', toZone: 'ZONE_PRD_WH', cargoKey: 'PRINTING_ROLL', items: [{ key: 'PRINTING_ROLL', qtyText: 'Printed Roll' }] };

      resetAllStationBays();

      appState.concurrentData = {
        stationCycles: {},
        missionsRM: rmMissions,
        indexRM: 0,
        timerRM: 0,
        durRM: 4.5,
        wpRM: buildConcurrentRmWaypoints(initialRM),
        rmDropped: false,

        missionsHPT: hptMissions,
        indexHPT: 0,
        timerHPT: 0,
        durHPT: 4.8,
        wpHPT: buildConcurrentHptWaypoints(initialHPT),
        hptDropped: false,
        hptPickedUp: false,

        timerFG: 0,
        durFG: 4.2,
        wpFG: buildConcurrentFgWaypoints(),
        fgDropped: false,
        fgPickedUp: false,

        timerDeliv: 0,
        durDeliv: 3.8,
        wpDeliv: buildConcurrentDeliveryWaypoints(),
        delivDropped: false,
        truckCycleTimer: 0,
        truckDeparted: false,

        progressTimer: 0
      };

      mountCargoOnVehicle(sceneObjects.rmForklift, initialRM.cargoKey, initialRM.items);
      mountCargoOnVehicle(sceneObjects.handPalletTruck, null, []);
      mountCargoOnVehicle(sceneObjects.fgForklift, null, []);
      mountCargoOnVehicle(sceneObjects.deliveryForklift, 'FG_BAG_BOX', [{ key: 'FG_BAG_BOX', qtyText: 'Pallet for Dispatch' }]);
    }

    function stepConcurrentFrame(dt, nowSec, scaledDt) {
      const cd = appState.concurrentData;
      if (!cd) return;

      const plan = appState.plan;

      // 0. Update each active station cycle according to input presence and configured timing
      if (!cd.stationCycles) cd.stationCycles = {};
      getActiveRouteIds().forEach(function (stId) {
        const stObj = sceneObjects.stationObjs[stId];
        if (!stObj) return;
        if (!cd.stationCycles[stId]) {
          cd.stationCycles[stId] = {
            status: 'WAITING_INPUT',
            elapsed: 0,
            inputConsumed: false,
            outputProduced: false
          };
        }
        const sc = cd.stationCycles[stId];
        const timing = (appState.stationTiming && appState.stationTiming[stId]) || DEFAULT_TIMING_MAP[stId] || { inputMin: 15, outputMin: 18 };
        const tInputSec = timing.inputMin * 0.1;
        const tOutputSec = Math.max(tInputSec, timing.outputMin * 0.1);

        const hasInfeed = bayHasCargo(stObj.infeedBay);
        const hasOutfeed = bayHasCargo(stObj.outfeedBay);

        if (sc.status === 'WAITING_INPUT') {
          if (hasInfeed) {
            // Requirement 1: Input arrived in yellow infeed bay! Machine can now start operating!
            sc.status = 'RUNNING';
            sc.elapsed = 0;
            sc.inputConsumed = false;
            sc.outputProduced = false;
            if (appState.stationRuntime[stId]) appState.stationRuntime[stId].status = 'RUNNING';
            appendEventLog('Station ' + (STATION_MAP[stId] ? STATION_MAP[stId].name : stId) + ': Input received in Yellow Bay, running fast (' + timing.inputMin + 'm in / ' + timing.outputMin + 'm out)');
          }
        } else if (sc.status === 'RUNNING') {
          sc.elapsed += scaledDt;
          // Requirement 3: Input consumption after inputMin
          if (sc.elapsed >= tInputSec && !sc.inputConsumed) {
            sc.inputConsumed = true;
            clearBayCargo(stObj.infeedBay);
            appendEventLog('Station ' + (STATION_MAP[stId] ? STATION_MAP[stId].name : stId) + ': Input material consumed at ' + timing.inputMin + ' min');
          }
          // Requirement 3: Output production after outputMin
          if (sc.elapsed >= tOutputSec && !sc.outputProduced) {
            sc.outputProduced = true;
            sc.status = 'OUTPUT_READY';
            const outMat = (STATION_MAP[stId].outfeedMat && STATION_MAP[stId].outfeedMat[0]) || 'PRINTING_ROLL';
            setBayCargo(stObj.outfeedBay, outMat);
            if (appState.stationRuntime[stId]) appState.stationRuntime[stId].status = 'DONE';
            appendEventLog('Station ' + (STATION_MAP[stId] ? STATION_MAP[stId].name : stId) + ': Output ready in Green Bay at ' + timing.outputMin + ' min');
          }
        } else if (sc.status === 'OUTPUT_READY') {
          if (!hasOutfeed) {
            sc.status = 'WAITING_INPUT';
            sc.elapsed = 0;
            sc.inputConsumed = false;
            sc.outputProduced = false;
            if (appState.stationRuntime[stId]) appState.stationRuntime[stId].status = 'IDLE';
          }
        }
      });

      // 1. RM Forklift Movement (Westbound Lane z = -1.8)
      cd.timerRM += scaledDt;
      const tRM = Math.min(1, cd.timerRM / cd.durRM);
      const poseRM = sampleWaypoints(cd.wpRM, tRM);
      sceneObjects.rmForklift.position.copy(poseRM.pos);
      sceneObjects.rmForklift.rotation.y = poseRM.yaw;
      if (tRM >= 0.48 && !cd.rmDropped) {
        cd.rmDropped = true;
        const curM = (cd.missionsRM && cd.missionsRM.length > 0) ? cd.missionsRM[cd.indexRM] : null;
        if (curM && sceneObjects.stationObjs[curM.toStation]) {
          setBayCargo(sceneObjects.stationObjs[curM.toStation].infeedBay, curM.cargoKey);
        }
        mountCargoOnVehicle(sceneObjects.rmForklift, null, []);
      }
      if (tRM >= 1) {
        cd.timerRM = 0;
        cd.rmDropped = false;
        if (cd.missionsRM && cd.missionsRM.length > 0) {
          cd.indexRM = (cd.indexRM + 1) % cd.missionsRM.length;
          const nextM = cd.missionsRM[cd.indexRM];
          cd.wpRM = buildConcurrentRmWaypoints(nextM);
          mountCargoOnVehicle(sceneObjects.rmForklift, nextM.cargoKey, nextM.items);
        }
      }

      // 2. Hand Pallet Truck Movement (Eastbound Lane z = +1.8)
      const curH = (cd.missionsHPT && cd.missionsHPT.length > 0) ? cd.missionsHPT[cd.indexHPT] : null;
      let hptWaitOutput = false;
      if (curH && curH.fromStation && sceneObjects.stationObjs[curH.fromStation] && !cd.hptPickedUp) {
        const srcBay = sceneObjects.stationObjs[curH.fromStation].outfeedBay;
        // Requirement 2: Downstream waits if outfeed bay has NO output!
        if (!bayHasCargo(srcBay)) {
          hptWaitOutput = true;
        } else {
          cd.hptPickedUp = true;
          clearBayCargo(srcBay);
          mountCargoOnVehicle(sceneObjects.handPalletTruck, curH.cargoKey, curH.items);
        }
      } else if (curH && curH.fromZone === 'ZONE_PRD_WH' && sceneObjects.prdBayOut && !cd.hptPickedUp) {
        if (!bayHasCargo(sceneObjects.prdBayOut)) {
          cd.hptPickedUp = true;
          mountCargoOnVehicle(sceneObjects.handPalletTruck, curH.cargoKey, curH.items);
        } else {
          cd.hptPickedUp = true;
          clearBayCargo(sceneObjects.prdBayOut);
          mountCargoOnVehicle(sceneObjects.handPalletTruck, curH.cargoKey, curH.items);
        }
      }

      if (!hptWaitOutput) {
        cd.timerHPT += scaledDt;
        const tHPT = Math.min(1, cd.timerHPT / cd.durHPT);
        const poseHPT = sampleWaypoints(cd.wpHPT, tHPT);
        sceneObjects.handPalletTruck.position.copy(poseHPT.pos);
        sceneObjects.handPalletTruck.rotation.y = poseHPT.yaw;
        if (sceneObjects.handPalletTruck.userData.operator) {
          const op = sceneObjects.handPalletTruck.userData.operator;
          op.userData.leftArm.rotation.x = Math.sin(nowSec * 10) * 0.4;
          op.userData.rightArm.rotation.x = -Math.sin(nowSec * 10) * 0.4;
        }
        if (tHPT >= 0.48 && !cd.hptDropped) {
          cd.hptDropped = true;
          if (curH) {
            if (curH.toStation && sceneObjects.stationObjs[curH.toStation]) {
              setBayCargo(sceneObjects.stationObjs[curH.toStation].infeedBay, curH.cargoKey);
            } else if (curH.toZone === 'ZONE_PRD_WH' && sceneObjects.prdBayIn) {
              setBayCargo(sceneObjects.prdBayIn, curH.cargoKey);
            }
          }
          mountCargoOnVehicle(sceneObjects.handPalletTruck, null, []);
        }
        if (tHPT >= 1) {
          cd.timerHPT = 0;
          cd.hptDropped = false;
          cd.hptPickedUp = false;
          if (cd.missionsHPT && cd.missionsHPT.length > 0) {
            cd.indexHPT = (cd.indexHPT + 1) % cd.missionsHPT.length;
            const nextH = cd.missionsHPT[cd.indexHPT];
            cd.wpHPT = buildConcurrentHptWaypoints(nextH);
          }
        }
      }

      // 3. FG Forklift Movement
      const isSpout = (appState.productType === 'FG_SPOUT');
      const finalStKey = isSpout ? 'ST_SPOUT' : (appState.productType === 'FG_ROLL' ? 'ST_SLIT' : 'ST_BAG');
      const finalStObj = sceneObjects.stationObjs[finalStKey];
      let fgWaitOutput = false;
      if (finalStObj && !cd.fgPickedUp) {
        // Requirement 2: FG Forklift waits if final station has no output in green bay!
        if (!bayHasCargo(finalStObj.outfeedBay)) {
          fgWaitOutput = true;
        } else {
          cd.fgPickedUp = true;
          clearBayCargo(finalStObj.outfeedBay);
          mountCargoOnVehicle(sceneObjects.fgForklift, 'FG_BAG_BOX', [{ key: 'FG_BAG_BOX', qtyText: 'Finished Goods' }]);
        }
      }

      if (!fgWaitOutput) {
        cd.timerFG += scaledDt;
        const tFG = Math.min(1, cd.timerFG / cd.durFG);
        const poseFG = sampleWaypoints(cd.wpFG, tFG);
        sceneObjects.fgForklift.position.copy(poseFG.pos);
        sceneObjects.fgForklift.rotation.y = poseFG.yaw;
        if (tFG >= 0.48 && !cd.fgDropped) {
          cd.fgDropped = true;
          mountCargoOnVehicle(sceneObjects.fgForklift, null, []);
          populateFgRackVisuals('FG_BAG_BOX', 3);
        }
        if (tFG >= 1) {
          cd.timerFG = 0;
          cd.fgDropped = false;
          cd.fgPickedUp = false;
        }
      }

      // 5. Delivery Forklift & Container Truck Loop
      cd.timerDeliv += scaledDt;
      const tDeliv = Math.min(1, cd.timerDeliv / cd.durDeliv);
      const poseDeliv = sampleWaypoints(cd.wpDeliv, tDeliv);
      sceneObjects.deliveryForklift.position.copy(poseDeliv.pos);
      sceneObjects.deliveryForklift.rotation.y = poseDeliv.yaw;

      // When reaching the truck (waypoint 2 at tDeliv >= 0.48), unload pallet into truck and clear forklift forks!
      if (tDeliv >= 0.48 && !cd.delivDropped) {
        cd.delivDropped = true;
        mountCargoOnVehicle(sceneObjects.deliveryForklift, null, []);
        if (sceneObjects.containerTruck && sceneObjects.containerTruck.userData.loadedPalletsGroup) {
          const tg = sceneObjects.containerTruck.userData.loadedPalletsGroup;
          if (tg.children.length === 0) {
            const loadedCargo = createCargoVisualByKey('FG_BAG_BOX');
            tg.add(loadedCargo);
          }
        }
      }

      // When completing return trip back to staging area (tDeliv >= 1), reset and pick up next pallet
      if (tDeliv >= 1) {
        cd.timerDeliv = 0;
        cd.delivDropped = false;
        mountCargoOnVehicle(sceneObjects.deliveryForklift, 'FG_BAG_BOX', [{ key: 'FG_BAG_BOX', qtyText: 'Pallet for Dispatch' }]);
      }

      // Container Truck Departure cycle at Loading Yard
      cd.truckCycleTimer += scaledDt;
      if (cd.truckCycleTimer > 12 && !cd.truckDeparted) {
        cd.truckDeparted = true;
      }
      if (cd.truckDeparted) {
        const departProgress = Math.min(1, (cd.truckCycleTimer - 12) / 3.0);
        // Doors swing closed as truck drives out onto highway
        if (sceneObjects.containerTruck.userData.setDoorOpenRatio) {
          sceneObjects.containerTruck.userData.setDoorOpenRatio(Math.max(0, 1.0 - departProgress * 2.5));
        }
        sceneObjects.containerTruck.position.z = -4.0 + departProgress * 26.0;
        if (!prefersReducedMotion) {
          sceneObjects.containerTruck.userData.wheels.forEach(function (wh) { wh.rotation.x += scaledDt * 6.0; });
        }
        if (cd.truckCycleTimer > 17.5) {
          cd.truckCycleTimer = 0;
          cd.truckDeparted = false;
          sceneObjects.containerTruck.position.set(81, 0.0, -4);
          if (sceneObjects.containerTruck.userData.loadedPalletsGroup) {
            const tg = sceneObjects.containerTruck.userData.loadedPalletsGroup;
            while (tg.children.length > 0) tg.remove(tg.children[0]);
          }
          if (sceneObjects.containerTruck.userData.setDoorOpenRatio) {
            sceneObjects.containerTruck.userData.setDoorOpenRatio(1.0);
          }
        }
      } else {
        // While parked at loading yard, side doors remain wide open for forklift loading
        if (sceneObjects.containerTruck.userData.setDoorOpenRatio) {
          sceneObjects.containerTruck.userData.setDoorOpenRatio(1.0);
        }
      }

      // Smooth order progress increment (update KPI element directly without rebuilding DOM every frame)
      cd.progressTimer += scaledDt;
      const newPct = Math.min(100, Math.floor((cd.progressTimer * 4.5) % 100));
      if (newPct !== appState.orderProgressPct) {
        appState.orderProgressPct = newPct;
        const progressEl = document.getElementById('kpiProgressVal');
        if (progressEl) progressEl.textContent = newPct + '%';
      }
    }

    function stepSimulationFrame(dt) {
      const nowSec = performance.now() * 0.001;
      const scaledDt = dt * appState.simSpeed;

      // Machinery Operations & Dynamic Speed:
      // - Fast speed (scaledDt * 7.2) when station input is ready (infeed bay has cargo) OR station is actively RUNNING
      // - Gentle idle (dt * 1.0) when station has NO input ("หมุนเบา หรือเดินเครื่องเบา")
      if (!prefersReducedMotion) {
        STATIONS_CONFIG.forEach(function (st) {
          const stObj = sceneObjects.stationObjs[st.id];
          if (!stObj) return;
          const inputReady = (appState.simStatus === 'RUNNING') && isStationInputReady(st.id);
          if (inputReady) {
            const fastSpin = scaledDt * 7.2;
            stObj.rollers.forEach(function (r) { r.rotation.y -= fastSpin; });
            stObj.reciprocators.forEach(function (rec) {
              rec.mesh.position.y = rec.baseY + Math.sin(nowSec * 14) * 0.16;
            });
            if (stObj.worker && stObj.worker.userData && stObj.worker.userData.leftArm) {
              stObj.worker.userData.leftArm.rotation.x = Math.sin(nowSec * 9) * 0.55;
              stObj.worker.userData.rightArm.rotation.x = -Math.sin(nowSec * 9) * 0.55;
            }
            if (stObj.extraWorkers) {
              stObj.extraWorkers.forEach(function (ew) {
                if (ew.userData && ew.userData.leftArm) {
                  ew.userData.leftArm.rotation.x = -Math.sin(nowSec * 9) * 0.5;
                  ew.userData.rightArm.rotation.x = Math.sin(nowSec * 9) * 0.5;
                }
              });
            }
            if (stObj.beaconMat) stObj.beaconMat.color.setHex(0x22c55e);
          } else {
            const gentleSpin = (appState.simStatus === 'RUNNING') ? (dt * 1.2) : (dt * 0.85);
            stObj.rollers.forEach(function (r) { r.rotation.y -= gentleSpin; });
            stObj.reciprocators.forEach(function (rec) {
              rec.mesh.position.y = rec.baseY;
            });
            if (stObj.worker && stObj.worker.userData && stObj.worker.userData.leftArm) {
              stObj.worker.userData.leftArm.rotation.x = 0;
              stObj.worker.userData.rightArm.rotation.x = 0;
            }
            if (stObj.extraWorkers) {
              stObj.extraWorkers.forEach(function (ew) {
                if (ew.userData && ew.userData.leftArm) {
                  ew.userData.leftArm.rotation.x = 0;
                  ew.userData.rightArm.rotation.x = 0;
                }
              });
            }
            if (stObj.beaconMat && (!appState.stationRuntime[st.id] || appState.stationRuntime[st.id].status !== 'RUNNING')) {
              stObj.beaconMat.color.setHex(0x94a3b8);
            }
          }
        });
      }

      const liveStatusEl = document.getElementById('inspTimingLiveStatus');
      if (liveStatusEl && appState.selectedTarget && STATION_MAP[appState.selectedTarget]) {
        liveStatusEl.innerHTML = getStationLiveTimingStatusHtml(appState.selectedTarget);
      }

      if (appState.simStatus !== 'RUNNING') return;

      // DUAL ENGINE BRANCH:
      // If Mode: Flow Only is active, execute Concurrent Digital Twin Pipeline
      if (appState.isConcurrent) {
        stepConcurrentFrame(dt, nowSec, scaledDt);
        return;
      }

      // Mode: Flow Details (Linear Step-by-Step Order Task Queue)
      const task = appState.tasks[appState.currentTaskIndex];
      if (!task) return;

      if (task.type === 'PROCESS') {
        const stObj = sceneObjects.stationObjs[task.stationId];
        // REQUIREMENT 1: Must have WIP/RM input before machine can operate!
        if (!task.inputConsumed && stObj && !bayHasCargo(stObj.infeedBay)) {
          const rt = appState.stationRuntime[task.stationId];
          if (rt) rt.status = 'WAITING_INPUT';
          return;
        }
        const rt = appState.stationRuntime[task.stationId];
        if (rt && rt.status !== 'RUNNING') rt.status = 'RUNNING';

        task.elapsed += scaledDt;
        const tInputSec = task.inputDuration || ((task.inputMin || 15) * 0.1);
        const tOutputSec = task.duration || Math.max(tInputSec, (task.outputMin || 18) * 0.1);

        // REQUIREMENT 3: Input consumption after inputMin
        if (task.elapsed >= tInputSec && !task.inputConsumed) {
          task.inputConsumed = true;
          if (stObj) clearBayCargo(stObj.infeedBay);
          appendEventLog('Station ' + (STATION_MAP[task.stationId] ? STATION_MAP[task.stationId].name : task.stationId) + ': Input material fully consumed (' + (task.inputMin || 15) + ' min)');
        }

        // REQUIREMENT 3: Output production after outputMin
        if (task.elapsed >= tOutputSec && !task.outputProduced) {
          task.outputProduced = true;
          if (stObj) setBayCargo(stObj.outfeedBay, task.outBayCargoKey);
          appendEventLog('Station ' + (STATION_MAP[task.stationId] ? STATION_MAP[task.stationId].name : task.stationId) + ': Output ready in Green Bay (' + (task.outputMin || 18) + ' min)');
        }

        const t01 = prefersReducedMotion ? 1 : Math.min(1, task.elapsed / tOutputSec);

        if (appState.followFlow && !camControl.isDragging && STATION_MAP[task.stationId]) {
          const sp = STATION_MAP[task.stationId].pos;
          camControl.desiredTarget.set(sp[0], 1.8, sp[2]);
          camControl.desiredSpherical.radius = 34;
        }

        if (t01 >= 1) {
          if (rt) rt.status = 'DONE';
          if (task.onComplete) task.onComplete();
          startNextTask();
        }
      } else if (task.type === 'MOVE') {
        // REQUIREMENT 2: Downstream vehicle checks if output exists in source outfeed bay!
        if (task.sourceStationId) {
          const srcStObj = sceneObjects.stationObjs[task.sourceStationId];
          if (srcStObj && !bayHasCargo(srcStObj.outfeedBay) && task.elapsed === 0) {
            // Downstream vehicle cannot move until output arrives in Green Bay!
            return;
          }
        }

        task.elapsed += scaledDt;
        const t01 = prefersReducedMotion ? 1 : Math.min(1, task.elapsed / (task.duration || 1.5));
        const veh = sceneObjects[task.vehicleKey];
        const pose = sampleWaypoints(task.waypoints, t01);
        veh.position.copy(pose.pos);
        veh.rotation.y = pose.yaw;

        if (task.vehicleKey === 'handPalletTruck' && veh.userData.operator) {
          const op = veh.userData.operator;
          op.userData.leftArm.rotation.x = Math.sin(nowSec * 10) * 0.4;
          op.userData.rightArm.rotation.x = -Math.sin(nowSec * 10) * 0.4;
        }

        if (appState.followFlow && !camControl.isDragging) {
          camControl.desiredTarget.set(veh.position.x, 1.2, veh.position.z);
          camControl.desiredSpherical.radius = 44;
        }

        if (t01 >= 1) {
          mountCargoOnVehicle(veh, null, []);
          if (task.onComplete) task.onComplete();
          startNextTask();
        }
      } else if (task.type === 'TRUCK_DEPART') {
        task.elapsed += scaledDt;
        const t01 = prefersReducedMotion ? 1 : Math.min(1, task.elapsed / (task.duration || 1.5));
        const trk = sceneObjects.containerTruck;
        if (trk.userData.setDoorOpenRatio) {
          trk.userData.setDoorOpenRatio(Math.max(0, 1.0 - t01 * 2.5));
        }
        trk.position.z = -2 + t01 * 24;
        if (!prefersReducedMotion) {
          trk.userData.wheels.forEach(function (wh) { wh.rotation.x += scaledDt * 5.0; });
        }
        if (appState.followFlow && !camControl.isDragging) {
          camControl.desiredTarget.set(trk.position.x, 2.0, trk.position.z);
          camControl.desiredSpherical.radius = 50;
        }
        if (t01 >= 1) {
          if (task.onComplete) task.onComplete();
          startNextTask();
        }
      }
    }
