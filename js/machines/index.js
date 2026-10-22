/* =========================================================================
   StarFlexERP 3D - Station Machine Factory Registry & Dispatcher
   ========================================================================= */

function buildRealisticStationMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut) {
  switch (st.id) {
    case 'ST_BLOWN':
      return buildBlownFilmMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_INK':
      return buildInkMixMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_PRINT':
      return buildPrintingMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_LAM':
      return buildLaminateMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_SLIT':
      return buildSlitMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_BAG':
      return buildBagMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    case 'ST_SPOUT':
      return buildSpoutMachine(st, rollersOut, reciprocatorsOut, extraWorkersOut);
    default:
      return new THREE.Group();
  }
}
