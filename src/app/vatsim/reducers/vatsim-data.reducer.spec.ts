import { reducer, initialState } from './vatsim-data.reducer';
import { VatsimDataRefreshed } from '../vatsim.actions';
import { VatsimData } from '../models';

describe('VatsimData Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('VatsimDataRefreshed', () => {
    let vatsimData: VatsimData;

    beforeEach(() => {
      vatsimData = {
        general: {
          version: 1,
          reload: 2,
          update: new Date(),
          atisAllowMin: 3,
          connectedClients: 4,
        },
        clients: [],
        activeAirports: [],
        firs: [],
        uirs: [],
      };
    });

    it('should store new VATSIM data', () => {
      const action = new VatsimDataRefreshed(vatsimData);
      const result = reducer(initialState, action);
      expect(result).toEqual(vatsimData);
    });
  });
});
