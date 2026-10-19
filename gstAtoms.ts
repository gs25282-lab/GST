import { AtomData, AtomType } from '../types/gst';

// Ge:Sb:Te = 2:2:5 ratio in 36 atoms (8 Ge, 8 Sb, 20 Te)
const atomSpecies: AtomType[] = [
  'Te', 'Ge', 'Te', 'Sb', 'Te', 'Ge',
  'Sb', 'Te', 'Ge', 'Te', 'Sb', 'Te',
  'Te', 'Sb', 'Te', 'Ge', 'Te', 'Sb',
  'Ge', 'Te', 'Sb', 'Te', 'Ge', 'Te',
  'Te', 'Ge', 'Te', 'Sb', 'Te', 'Ge',
  'Sb', 'Te', 'Ge', 'Te', 'Sb', 'Te',
];

// Pre-defined deterministic amorphous displacements to represent the disordered network
// with varying interatomic distances, small clusters, and voids typical of melt-quenched amorphous GST.
const amorphousOffsets: [number, number][] = [
  [-18, 12], [22, -15], [-12, -24], [15, 18], [-26, 8], [14, -20],
  [20, 16], [-14, -18], [24, -10], [-18, 22], [16, -14], [-22, 10],
  [-10, -22], [18, 14], [-20, 20], [12, -26], [-16, 12], [24, -18],
  [14, 24], [-24, -12], [18, -20], [-12, 16], [22, 14], [-16, -22],
  [-22, 14], [16, -16], [-14, 22], [20, -12], [-18, -18], [14, 20],
  [12, -18], [-20, 16], [18, 22], [-16, -14], [22, -16], [-14, 18],
];

export const GST_ATOMS: AtomData[] = Array.from({ length: 36 }, (_, i) => {
  const row = Math.floor(i / 6);
  const col = i % 6;

  // Regular 6x6 lattice in 500x500 box
  const startX = 75;
  const startY = 75;
  const spacing = 70;

  const crystX = startX + col * spacing;
  const crystY = startY + row * spacing;

  const [offX, offY] = amorphousOffsets[i];
  // Amorphous coords: perturbed within canvas boundaries with some clustering
  const amorphX = Math.max(45, Math.min(455, crystX + offX * 1.3));
  const amorphY = Math.max(45, Math.min(455, crystY + offY * 1.3));

  return {
    id: i,
    type: atomSpecies[i],
    crystX,
    crystY,
    amorphX,
    amorphY,
    coordCryst: 6, // Octahedral coordination tendency in rocksalt-like metastable GST
    coordAmorph: atomSpecies[i] === 'Ge' ? 4 : 3, // Tetrahedral Ge / pyramidal Sb in amorphous phase
  };
});

export const ATOM_COLORS: Record<AtomType, {
  name: string;
  symbol: string;
  atomicNumber: number;
  color: string;
  stroke: string;
  fillClass: string;
  glowColor: string;
  description: string;
}> = {
  Ge: {
    name: '게르마늄 (Germanium)',
    symbol: 'Ge',
    atomicNumber: 32,
    color: '#06b6d4', // cyan-500
    stroke: '#0891b2',
    fillClass: 'fill-cyan-500',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description: '상변환 시 8면체(결정질)에서 4면체(비정질)로 배위수 변화가 가장 두드러지게 일어남',
  },
  Sb: {
    name: '안티모니 (Antimony)',
    symbol: 'Sb',
    atomicNumber: 51,
    color: '#8b5cf6', // violet-500
    stroke: '#7c3aed',
    fillClass: 'fill-violet-500',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    description: '결정질 핵형성 속도 및 상변환 속도를 향상시키는 골격 형성 원소',
  },
  Te: {
    name: '텔루륨 (Tellurium)',
    symbol: 'Te',
    atomicNumber: 52,
    color: '#f59e0b', // amber-500
    stroke: '#d97706',
    fillClass: 'fill-amber-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: '칼코겐 원소로서 p-오비탈 기반의 결합에 참여하며 전하 전달 통로 형성',
  },
};
