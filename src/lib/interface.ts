export type Vehicle =
    'privateCar'
  | 'LGV'
  | 'HGV'
  | 'CV'
  | 'coach'
  | 'motorCycle';

export interface Extent {
  readonly topLat: number;
  readonly botLat: number;
  readonly leftLong: number;
  readonly rightLong: number;
}

export interface Location {
  readonly latitude: number;
  readonly longitude: number;
}
