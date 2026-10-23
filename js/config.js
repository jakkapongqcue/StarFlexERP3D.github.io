/* =========================================================================
       1. CONSTANTS & LINEAR FACTORY LAYOUT (Declared first to avoid TDZ)
       ========================================================================= */
    const MATERIAL_CATALOG = {
      CYLINDER:       { key: 'CYLINDER',       name: 'Cylinder',              unit: 'pcs',    initStock: 24,   color: '#94a3b8', rmPos: [-72, 0, -11.5], rmDock: [-63, 0, -11.5] },
      RM_INK:         { key: 'RM_INK',         name: 'Base-color ink drums',  unit: 'kg',     initStock: 1200, color: '#ec4899', rmPos: [-57, 0, -14.5], rmDock: [-63, 0, -14.5] },
      SOLVENT:        { key: 'SOLVENT',        name: 'Solvent drums',         unit: 'L',      initStock: 900,  color: '#06b6d4', rmPos: [-51, 0, -14.5], rmDock: [-63, 0, -14.5] },
      ADHESIVE:       { key: 'ADHESIVE',       name: 'Adhesive drums',        unit: 'kg',     initStock: 850,  color: '#f59e0b', rmPos: [-54, 0, -8.2],  rmDock: [-54, 0, -2.0]  },
      RESIN:          { key: 'RESIN',          name: 'Resin bags',            unit: 'kg',     initStock: 8000, color: '#f8fafc', rmPos: [-57.6, 0, 14.5],rmDock: [-63, 0, 14.5]  },
      PURCHASED_FILM: { key: 'PURCHASED_FILM', name: 'Purchased Film',        unit: 'kg',     initStock: 5000, color: '#f8fafc', rmPos: [-53.8, 0, 13.8],rmDock: [-53.8, 0, 2.0]  },
      BLOWN_FILM:     { key: 'BLOWN_FILM',     name: 'Blown Film',            unit: 'kg',     initStock: 750,  color: '#f8fafc', rmPos: [-51.0, 0, 13.8],rmDock: [-51.0, 0, 2.0]  },
      LAMINATE_FILM:  { key: 'LAMINATE_FILM',  name: 'Laminate Film',         unit: 'kg',     initStock: 4200, color: '#8b5cf6', rmPos: [-48.2, 0, 13.8],rmDock: [-48.2, 0, 2.0]  },
      MIXED_INK:      { key: 'MIXED_INK',      name: 'Ready-to-use Ink',      unit: 'kg',     initStock: 180,  color: '#db2777', rmPos: [-51.2, 0, -8.2], rmDock: [-51.2, 0, -2.0] },
      PAPERCORE:      { key: 'PAPERCORE',      name: 'Papercore',             unit: 'pcs',    initStock: 1500, color: '#d97706', rmPos: [-75.2, 0, 11.5], rmDock: [-63, 0, 11.5] },
      BOX:            { key: 'BOX',            name: 'Corrugated boxes',      unit: 'boxes',  initStock: 2000, color: '#d4a373', rmPos: [-71.6, 0, 11.5], rmDock: [-63, 0, 11.5] },
      SPOUT:          { key: 'SPOUT',          name: 'Spout caps',            unit: 'pcs',    initStock: 50000,color: '#10b981', rmPos: [-68.8, 0, 11.5], rmDock: [-63, 0, 11.5] },
      /* WIP / FG transport items */
      PRINTING_ROLL:  { key: 'PRINTING_ROLL',  name: 'Printed Roll (Hygiene)', unit: 'kg',     initStock: 0,    color: '#be185d' },
      LAMINATE_ROLL:  { key: 'LAMINATE_ROLL',  name: 'Laminate Roll (Hygiene)', unit: 'kg',     initStock: 0,    color: '#be185d' },
      SLIT_ROLL:      { key: 'SLIT_ROLL',      name: 'Slit Roll (Hygiene)',     unit: 'rolls',  initStock: 0,    color: '#be185d' },
      FG_BAG_BOX:     { key: 'FG_BAG_BOX',     name: 'Hygiene Refill Pouch (Boxed)', unit: 'boxes', initStock: 0, color: '#be185d' },
      FG_SPOUT_BOX:   { key: 'FG_SPOUT_BOX',   name: 'Hygiene Spout Pouch (Boxed)', unit: 'boxes', initStock: 0, color: '#be185d' }
    };

    const RM_DISPLAY_ORDER = [
      'RESIN', 'PURCHASED_FILM', 'BLOWN_FILM', 'LAMINATE_FILM',
      'RM_INK', 'MIXED_INK', 'SOLVENT', 'ADHESIVE',
      'CYLINDER', 'PAPERCORE', 'BOX', 'SPOUT'
    ];

    const RM_SUB_WAREHOUSES = [
      {
        id: 'CYLINDER_WH',
        name: 'Cylinder WH',
        desc: 'Gravure Cylinders',
        color: '#94a3b8',
        keys: ['CYLINDER']
      },
      {
        id: 'CHEMICAL_WH',
        name: 'Chemical WH',
        desc: 'Inks, Solvents & Adhesives',
        color: '#ec4899',
        keys: ['RM_INK', 'MIXED_INK', 'SOLVENT', 'ADHESIVE']
      },
      {
        id: 'SUPPLIES_WH',
        name: 'Supplies Used WH',
        desc: 'Cores, Cartons & Spout Caps',
        color: '#f59e0b',
        keys: ['PAPERCORE', 'BOX', 'SPOUT']
      },
      {
        id: 'RESIN_FILM_WH',
        name: 'Resin & Film Storage',
        desc: 'Resin Bags & Substrate Films',
        color: '#3b82f6',
        keys: ['RESIN', 'PURCHASED_FILM', 'BLOWN_FILM', 'LAMINATE_FILM']
      }
    ];

    const ZONES_CONFIG = {
      ZONE_RM: {
        id: 'ZONE_RM',
        name: 'RM WH',
        role: 'Specialized raw material sub-warehouses: Cylinder WH, Chemical WH, Supplies Used WH, and Resin & Film Storage.',
        handling: 'RM Forklift retrieves pallets from racks and delivers along the central aisle.',
        center: [-63, 0, 0],
        size: [36, 44]
      },
      ZONE_PRD: {
        id: 'ZONE_PRD',
        name: 'PRD Line',
        role: 'Two-row flexible packaging manufacturing: Row 1 (Blown Film, Printing, Bag, Spout) & Row 2 (Ink Mix, PRD WH, Laminate, Slit).',
        handling: 'Central transit highway (z = 0) connects all stations with designated Infeed & Outfeed bays.',
        center: [0, 0, 0],
        size: [80, 44]
      },
      ZONE_PRD_WH: {
        id: 'ZONE_PRD_WH',
        name: 'PRD WH',
        role: 'Central intermediate warehouse in the production area for holding, resting, and staging materials & WIP. Functions as the central buffer for rolls undergoing curing/adhesive development and WIP rolls/boxes waiting for subsequent processing.',
        handling: 'Buffers WIP rolls and materials, staging curing rolls before lamination, slitting, and bag conversion.',
        center: [-10, 0, 12],
        size: [18, 16]
      },
      ZONE_FG: {
        id: 'ZONE_FG',
        name: 'FG WH & Yard',
        role: 'Multi-tier FG pallet storage racks and open Truck Loading Yard for direct forklift loading.',
        handling: 'FG Forklift collects finished pallets into FG racks; Delivery Forklift loads pallets directly onto the Container Truck in the yard.',
        center: [64, 0, 0],
        size: [38, 44]
      }
    };

    /* Two-Row Flexible Packaging Factory Layout (User Request):
       - Row 1 (North / z = -12.0): Blown Film (Col 1), Printing (Col 2), Bag (Col 3), Spout (Col 4)
       - Row 2 (South / z = +12.0): Ink Mix (Col 1), PRD WH (Col 2), Laminate (Col 3), Slit (Col 4)
       - Central transit highway at z = 0.0 with dedicated Infeed & Outfeed bays beside each machine */
    const STATIONS_CONFIG = [
      // Row 1 (North row / z = -12.0)
      {
        id: 'ST_BLOWN',
        stepNum: 1,
        name: 'Blown Film',
        row: 1,
        pos: [-30, 0, -12.0],
        flDock: [-32.4, 0, -5.2],
        hptDock: [-27.6, 0, -5.2],
        infeedMat: ['RESIN'],
        outfeedMat: ['BLOWN_FILM'],
        padColor: 0x334155,
        defaultWaste: 3.0,
        inputSummary: 'Resin bags (RM WH)',
        outputSummary: 'Blown Film Roll → Printing / PRD WH',
        desc: 'Extruder melts resin pellets and blows vertical tubular film bubble through air ring and calibration basket.'
      },
      {
        id: 'ST_PRINT',
        stepNum: 3,
        name: 'Printing',
        row: 1,
        pos: [-10, 0, -12.0],
        flDock: [-12.4, 0, -5.2],
        hptDock: [-7.6, 0, -5.2],
        infeedMat: ['BLOWN_FILM', 'MIXED_INK', 'CYLINDER'],
        outfeedMat: ['PRINTING_ROLL'],
        padColor: 0x334155,
        defaultWaste: 4.0,
        inputSummary: 'Base Film + Cylinder + Ink + Solvent',
        outputSummary: 'Printed Roll (Hygiene) → PRD WH / Laminate',
        desc: 'Multi-unit rotogravure printing press producing vibrant Hygiene packaging film with active Rewinder roll on the right.'
      },
      {
        id: 'ST_BAG',
        stepNum: 6,
        name: 'Bag',
        row: 1,
        pos: [10, 0, -12.0],
        flDock: [7.6, 0, -5.2],
        hptDock: [12.4, 0, -5.2],
        infeedMat: ['SLIT_ROLL', 'BOX'],
        outfeedMat: ['FG_BAG_BOX'],
        padColor: 0x7f3b42,
        defaultWaste: 3.0,
        inputSummary: 'Slit/Laminate Roll + Corrugated Box',
        outputSummary: 'Hygiene Stand-up Pouch (Boxed) → FG / Spout',
        desc: 'Dual-lane bag making machine converting slit Hygiene film into premium stand-up refill pouches.'
      },
      {
        id: 'ST_SPOUT',
        stepNum: 7,
        name: 'Spout',
        row: 1,
        pos: [30, 0, -12.0],
        flDock: [27.6, 0, -5.2],
        hptDock: [32.4, 0, -5.2],
        infeedMat: ['FG_BAG_BOX', 'SPOUT'],
        outfeedMat: ['FG_SPOUT_BOX'],
        padColor: 0x334155,
        defaultWaste: 2.0,
        inputSummary: 'Bag + Spout Caps + Corrugated Box',
        outputSummary: 'Hygiene Spout Pouch (Boxed) → FG Warehouse',
        desc: 'Vibratory bowl feeder and ultrasonic rotary welder attaching plastic spouts onto Hygiene pouches.'
      },

      // Row 2 (South row / z = +12.0)
      {
        id: 'ST_INK',
        stepNum: 2,
        name: 'Ink Mix',
        row: 2,
        pos: [-30, 0, 12.0],
        flDock: [-32.4, 0, 5.2],
        hptDock: [-27.6, 0, 5.2],
        infeedMat: ['RM_INK', 'SOLVENT'],
        outfeedMat: ['MIXED_INK'],
        padColor: 0x334155,
        defaultWaste: 2.0,
        inputSummary: 'Base-color ink drums (RM WH / Chemical WH)',
        outputSummary: 'Ready-to-use Ink → Printing',
        desc: 'High-shear stainless agitation tanks blend base gravure inks to job color target.'
      },
      {
        id: 'ST_LAM',
        stepNum: 4,
        name: 'Laminate',
        row: 2,
        pos: [10, 0, 12.0],
        flDock: [7.6, 0, 5.2],
        hptDock: [12.4, 0, 5.2],
        infeedMat: ['PRINTING_ROLL', 'LAMINATE_FILM', 'ADHESIVE'],
        outfeedMat: ['LAMINATE_ROLL'],
        padColor: 0x334155,
        defaultWaste: 3.0,
        inputSummary: 'Printed Roll (Hygiene) + Barrier Film + Adhesive',
        outputSummary: 'Laminate Roll (Hygiene) → PRD WH / Slit',
        desc: 'Dry lamination machine with primary Hygiene printed roll unwinder, secondary barrier film unwinder, overhead drying oven bridge, and Rewinder roll.'
      },
      {
        id: 'ST_SLIT',
        stepNum: 5,
        name: 'Slit',
        row: 2,
        pos: [30, 0, 12.0],
        flDock: [27.6, 0, 5.2],
        hptDock: [32.4, 0, 5.2],
        infeedMat: ['LAMINATE_ROLL', 'PAPERCORE'],
        outfeedMat: ['SLIT_ROLL'],
        padColor: 0x1f6f78,
        defaultWaste: 2.0,
        inputSummary: 'Laminate Roll (Hygiene) + Papercore (+ Box)',
        outputSummary: 'Slit Roll (Hygiene) → Bag / FG',
        desc: 'Slitter rewinder precision cutting laminated Hygiene film web into multiple narrow rolls.'
      }
    ];

    const STATION_MAP = {};
    STATIONS_CONFIG.forEach(function (st) { STATION_MAP[st.id] = st; });

    const ALL_STEPPER_STEPS = [
      { id: 'ST_BLOWN', label: '1. Blown Film' },
      { id: 'ST_INK',   label: '2. Ink Mix' },
      { id: 'ST_PRINT', label: '3. Printing' },
      { id: 'ST_LAM',   label: '4. Laminate' },
      { id: 'ST_SLIT',  label: '5. Slit' },
      { id: 'ST_BAG',   label: '6. Bag' },
      { id: 'ST_SPOUT', label: '7. Spout' },
      { id: 'STEP_FG',  label: '8. FG WH & Yard' },
      { id: 'STEP_DELIVERED', label: '9. Delivered' }
    ];

    const DEFAULT_WASTE_MAP = {
      ST_BLOWN: 3.0,
      ST_INK: 2.0,
      ST_PRINT: 4.0,
      ST_LAM: 3.0,
      ST_SLIT: 2.0,
      ST_BAG: 3.0,
      ST_SPOUT: 2.0
    };

    const DEFAULT_TIMING_MAP = {
      ST_BLOWN: { inputMin: 15, outputMin: 18 },
      ST_INK:   { inputMin: 10, outputMin: 12 },
      ST_PRINT: { inputMin: 20, outputMin: 25 },
      ST_LAM:   { inputMin: 18, outputMin: 22 },
      ST_SLIT:  { inputMin: 12, outputMin: 15 },
      ST_BAG:   { inputMin: 15, outputMin: 20 },
      ST_SPOUT: { inputMin: 12, outputMin: 16 }
    };

    /* =========================================================================
       2. APPLICATION STATE
       ========================================================================= */
    const appState = {
      themeMode: (function () {
        try {
          return localStorage.getItem('sf_theme_mode') || 'light';
        } catch (e) {
          return 'light';
        }
      })(),                      // 'light' | 'dark' | 'system'
      inputMode: 'MINIMAL',      // 'MINIMAL' | 'DETAILED'
      productType: 'FG_ROLL',    // 'FG_ROLL' | 'FG_BAG' | 'FG_SPOUT'
      quantity: 20,
      unit: 'roll',              // 'roll' | 'meter' | 'kilogram' | 'pieces'
      filmSource: 'INHOUSE',     // 'INHOUSE' | 'PURCHASED'
      piecesPerBox: 300,
      metersPerRoll: 1000,
      kgPerRoll: 25,
      skipSlit: false,
      wasteByStep: Object.assign({}, DEFAULT_WASTE_MAP),
      stationTiming: JSON.parse(JSON.stringify(DEFAULT_TIMING_MAP)),
      showMaterialLabels: false,
      followFlow: false,
      loopRun: false,
      loopCycleCount: 0,
      simSpeed: 1,
      simStatus: 'IDLE',         // 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED'
      selectedTarget: 'ALL',
      activeStepId: null,
      completedSteps: {},
      stationRuntime: {},
      rmStock: {},
      fgStockPallets: 0,
      fgProducedDisplay: 'Ready',
      orderProgressPct: 0,
      plan: null,
      tasks: [],
      currentTaskIndex: -1,
      logs: []
    };

    function resetInventoryState() {
      Object.keys(MATERIAL_CATALOG).forEach(function (k) {
        appState.rmStock[k] = MATERIAL_CATALOG[k].initStock;
      });
      const baseFilmLabel = (appState.filmSource === 'INHOUSE') ? 'Blown Film' : 'Purchased Film';
      STATIONS_CONFIG.forEach(function (st) {
        let inSum = st.inputSummary;
        if (st.id === 'ST_PRINT') {
          inSum = baseFilmLabel + ' + Cylinder + Ink + Solvent';
        }
        appState.stationRuntime[st.id] = {
          status: 'IDLE',
          activeInputs: inSum,
          activeOutput: st.outputSummary
        };
      });
      appState.fgStockPallets = 0;
      appState.fgProducedDisplay = '0 units';
      appState.orderProgressPct = 0;
      appState.activeStepId = null;
      appState.completedSteps = {};
    }
    resetInventoryState();
