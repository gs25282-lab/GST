export type GSTState = 'amorphous' | 'crystalline';

export type AtomType = 'Ge' | 'Sb' | 'Te';

export interface AtomData {
  id: number;
  type: AtomType;
  // Position in crystalline state (percentage 0-100 or canvas units)
  crystX: number;
  crystY: number;
  // Position in amorphous state
  amorphX: number;
  amorphY: number;
  // Coordination number hint or localized description
  coordCryst: number;
  coordAmorph: number;
}

export interface BondData {
  fromId: number;
  toId: number;
  inCryst: boolean;
  inAmorph: boolean;
}

export interface ElectronParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scatterCount: number;
}
