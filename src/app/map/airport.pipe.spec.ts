import { AirportPipe } from './airport.pipe';
import { Airport } from './models/airport';

describe('AirportPipe', () => {
  it('create an instance', () => {
    const pipe = new AirportPipe();
    expect(pipe).toBeTruthy();
  });

  it('transforms airport', () => {
    const pipe = new AirportPipe();
    const airport: Airport = { icao: 'EGLL', iata: 'LHR', name: 'London Heathrow Airport', city: 'London',
      position: [ 51.4775, -0.461389 ], alias: 'LHR', fir: 'EGTT', inboundFlights: [],
      outboundFlights: [], atcs: [] };
    expect(pipe.transform(airport)).toEqual('EGLL London');
  });

  it('doesn\'t transform string', () => {
    const pipe = new AirportPipe();
    expect(pipe.transform('EGLL')).toEqual('EGLL');
  });
});
