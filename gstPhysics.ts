import { GST_ATOMS } from '../data/gstAtoms';
import { BondData, GSTState } from '../types/gst';

export interface BondLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'crystalline' | 'amorphous';
}

// Generate bonds for crystalline state (regular 6x6 grid neighbors)
export function getCrystallineBonds(): BondData[] {
  const bonds: BondData[] = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const idx = r * 6 + c;
      // Right neighbor
      if (c < 5) {
        bonds.push({ fromId: idx, toId: idx + 1, inCryst: true, inAmorph: false });
      }
      // Bottom neighbor
      if (r < 5) {
        bonds.push({ fromId: idx, toId: idx + 6, inCryst: true, inAmorph: false });
      }
    }
  }
  return bonds;
}

// Generate bonds for amorphous state based on distance cut-off
export function getAmorphousBonds(): BondData[] {
  const bonds: BondData[] = [];
  const maxDistance = 78; // bonding distance threshold

  for (let i = 0; i < GST_ATOMS.length; i++) {
    for (let j = i + 1; j < GST_ATOMS.length; j++) {
      const a = GST_ATOMS[i];
      const b = GST_ATOMS[j];
      const dx = a.amorphX - b.amorphX;
      const dy = a.amorphY - b.amorphY;
      const dist = Math.hypot(dx, dy);

      if (dist <= maxDistance) {
        bonds.push({ fromId: i, toId: j, inCryst: false, inAmorph: true });
      }
    }
  }
  return bonds;
}
