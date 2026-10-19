import React, { useState, useEffect, useRef } from 'react';
import { GSTState, AtomType } from '../types/gst';
import { GST_ATOMS, ATOM_COLORS } from '../data/gstAtoms';
import { getCrystallineBonds, getAmorphousBonds } from '../utils/gstPhysics';
import { Zap, Eye, RefreshCw, Info } from 'lucide-react';

interface Props {
  state: GSTState;
  showElectrons: boolean;
  onToggleElectrons: () => void;
  selectedFilter: AtomType | 'all';
  onSelectFilter: (filter: AtomType | 'all') => void;
  isTransitioning?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scattered: boolean;
}

export const AtomicArrangement: React.FC<Props> = ({
  state,
  showElectrons,
  onToggleElectrons,
  selectedFilter,
  onSelectFilter,
}) => {
  const [activeAtom, setActiveAtom] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<number | null>(null);

  const crystBonds = useRef(getCrystallineBonds()).current;
  const amorphBonds = useRef(getAmorphousBonds()).current;

  // Initialize electron simulation particles
  useEffect(() => {
    if (!showElectrons) {
      setParticles([]);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    // Spawn 18 electron particles
    const initParticles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 35 + Math.random() * 20,
      y: 70 + (i % 6) * 70 + (Math.random() - 0.5) * 20,
      vx: state === 'crystalline' ? 2.8 + Math.random() * 0.8 : 1.0 + Math.random() * 0.6,
      vy: (Math.random() - 0.5) * (state === 'crystalline' ? 0.3 : 1.8),
      opacity: 0.9,
      scattered: false,
    }));
    setParticles(initParticles);

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.6, 2.5);
      lastTime = time;

      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.vx * dt;
          let newY = p.y + p.vy * dt;
          let newVx = p.vx;
          let newVy = p.vy;
          let scattered = p.scattered;

          // Boundary checks
          if (newY < 55) {
            newY = 55;
            newVy = Math.abs(newVy);
          } else if (newY > 445) {
            newY = 445;
            newVy = -Math.abs(newVy);
          }

          // Crystalline vs Amorphous scattering behavior
          if (state === 'amorphous') {
            // High scattering: check collision with amorphous atoms
            GST_ATOMS.forEach((atom) => {
              const dx = newX - atom.amorphX;
              const dy = newY - atom.amorphY;
              const dist = Math.hypot(dx, dy);
              if (dist < 22) {
                // Scatter deflection & slow down
                const angle = Math.atan2(dy, dx);
                newVx = Math.cos(angle) * 0.9 + 0.3; // impeded drift velocity
                newVy = Math.sin(angle) * 1.5;
                scattered = true;
              }
            });
          } else {
            // Crystalline: smooth channel conduction (low scattering)
            newVy *= 0.96; // dampens vertical drift, staying in periodic conduction channels
            newVx = Math.max(2.6, newVx);
          }

          // Wrap around when reaching right electrode
          if (newX > 465) {
            newX = 35 + Math.random() * 15;
            newY = 65 + Math.random() * 370;
            newVx = state === 'crystalline' ? 2.8 + Math.random() * 0.8 : 1.0 + Math.random() * 0.6;
            newVy = (Math.random() - 0.5) * (state === 'crystalline' ? 0.3 : 1.8);
            scattered = false;
          }

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            scattered,
          };
        })
      );

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [showElectrons, state]);

  // Current active bonds
  const currentBonds = state === 'crystalline' ? crystBonds : amorphBonds;

  return (
    <div className="flex flex-col h-full">
      {/* Top Controls inside visualization */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
        {/* Atomic species filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium whitespace-nowrap">원소 필터:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onSelectFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 보기
            </button>
            {(['Ge', 'Sb', 'Te'] as AtomType[]).map((type) => {
              const spec = ATOM_COLORS[type];
              const isSelected = selectedFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => onSelectFilter(type)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: spec.color }}
                  />
                  <span>{spec.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Electron Carrier Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleElectrons}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap border ${
              showElectrons
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${showElectrons ? 'fill-amber-400 text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>전하 흐름 시각화: {showElectrons ? '켜짐' : '꺼짐'}</span>
          </button>
        </div>
      </div>

      {/* Main SVG Visualization Canvas */}
      <div className="relative flex-1 min-h-[380px] md:min-h-[460px] bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Electrodes indicator (PRAM top/bottom or cathode/anode setup) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[11px] font-mono text-cyan-400/80 bg-slate-900/90 border border-cyan-800/50 px-2 py-3 rounded-lg backdrop-blur-xs">
          <span className="font-semibold text-cyan-300">음극 (-)</span>
          <span className="text-[10px] text-slate-400">전극</span>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[11px] font-mono text-amber-400/80 bg-slate-900/90 border border-amber-800/50 px-2 py-3 rounded-lg backdrop-blur-xs">
          <span className="font-semibold text-amber-300">양극 (+)</span>
          <span className="text-[10px] text-slate-400">전극</span>
        </div>

        {/* State Badge Watermark on Canvas */}
        <div className="absolute top-3 left-4 pointer-events-none">
          <div className="text-xs font-medium text-slate-400">
            현재 상태:{' '}
            <span
              className={`font-semibold ${
                state === 'crystalline' ? 'text-emerald-400' : 'text-indigo-400'
              }`}
            >
              {state === 'crystalline' ? '결정질 (Crystalline)' : '비정질 (Amorphous)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {state === 'crystalline'
              ? '규칙적인 8면체형 결합 격자망 · 공명 결합'
              : '무질서한 4면체/피라미드형 네트워크 · 국재화 결합'}
          </div>
        </div>

        {/* SVG Stage */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-w-[500px] max-h-[500px] transition-all duration-700 ease-in-out"
          style={{ filter: 'drop-shadow(0 0 20px rgba(15, 23, 42, 0.8))' }}
        >
          <defs>
            {/* Glow filters for bonds and atoms */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="crystBondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="amorphBondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* 1. Bonds Layer */}
          <g className="bonds-layer">
            {currentBonds.map((bond, idx) => {
              const a1 = GST_ATOMS[bond.fromId];
              const a2 = GST_ATOMS[bond.toId];
              const x1 = state === 'crystalline' ? a1.crystX : a1.amorphX;
              const y1 = state === 'crystalline' ? a1.crystY : a1.amorphY;
              const x2 = state === 'crystalline' ? a2.crystX : a2.amorphX;
              const y2 = state === 'crystalline' ? a2.crystY : a2.amorphY;

              const isMuted =
                selectedFilter !== 'all' &&
                a1.type !== selectedFilter &&
                a2.type !== selectedFilter;

              return (
                <line
                  key={`bond-${idx}-${bond.fromId}-${bond.toId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={state === 'crystalline' ? 'url(#crystBondGrad)' : 'url(#amorphBondGrad)'}
                  strokeWidth={state === 'crystalline' ? 2.5 : 1.5}
                  strokeDasharray={state === 'crystalline' ? 'none' : '4,3'}
                  opacity={isMuted ? 0.15 : 0.75}
                  className="transition-all duration-700 ease-in-out"
                />
              );
            })}
          </g>

          {/* 2. Electron Flow Simulation Layer */}
          {showElectrons && (
            <g className="electron-flow-layer">
              {particles.map((p) => (
                <g key={`particle-${p.id}`} transform={`translate(${p.x}, ${p.y})`}>
                  <circle
                    r={p.scattered ? 4.5 : 3.5}
                    fill={p.scattered ? '#f43f5e' : '#fbbf24'}
                    opacity={p.opacity}
                    filter="url(#glow)"
                  />
                  {/* Subtle particle trail */}
                  <line
                    x1={-p.vx * 3.5}
                    y1={-p.vy * 3.5}
                    x2={0}
                    y2={0}
                    stroke={p.scattered ? '#f43f5e' : '#fbbf24'}
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                </g>
              ))}
            </g>
          )}

          {/* 3. Atoms Layer */}
          <g className="atoms-layer">
            {GST_ATOMS.map((atom) => {
              const spec = ATOM_COLORS[atom.type];
              const x = state === 'crystalline' ? atom.crystX : atom.amorphX;
              const y = state === 'crystalline' ? atom.crystY : atom.amorphY;
              const isHighlighted = selectedFilter === 'all' || selectedFilter === atom.type;
              const isSelected = activeAtom === atom.id;

              return (
                <g
                  key={`atom-${atom.id}`}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setActiveAtom(activeAtom === atom.id ? null : atom.id)}
                  className="cursor-pointer transition-transform duration-700 ease-in-out"
                  style={{
                    opacity: isHighlighted ? 1 : 0.22,
                  }}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r={24}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      strokeDasharray="3,2"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Atom halo / ambient glow */}
                  <circle
                    r={18}
                    fill={spec.color}
                    opacity={state === 'crystalline' ? 0.25 : 0.15}
                  />

                  {/* Main Atom sphere */}
                  <circle
                    r={15}
                    fill={spec.color}
                    stroke={spec.stroke}
                    strokeWidth={2}
                    className="transition-colors duration-300"
                  />

                  {/* Radial shine highlight */}
                  <circle
                    cx={-4}
                    cy={-4}
                    r={5}
                    fill="#ffffff"
                    opacity={0.35}
                  />

                  {/* Element Symbol */}
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    pointerEvents="none"
                  >
                    {atom.type}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Atom Info Overlay Card */}
        {activeAtom !== null && (
          <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md text-slate-200 text-xs">
            {(() => {
              const atom = GST_ATOMS[activeAtom];
              const spec = ATOM_COLORS[atom.type];
              return (
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: spec.color }}
                      />
                      <span className="font-bold text-white text-sm">
                        {spec.name} ({spec.symbol})
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveAtom(null)}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 space-y-1 text-slate-300">
                    <div>
                      원자 번호: <span className="font-mono text-slate-100">{spec.atomicNumber}</span>
                    </div>
                    <div>
                      배위 환경 ({state === 'crystalline' ? '결정질' : '비정질'}):{' '}
                      <span className="font-semibold text-cyan-300">
                        {state === 'crystalline'
                          ? `약 6배위 (8면체 암염형 격자)`
                          : `${atom.coordAmorph}배위 (${atom.type === 'Ge' ? '4면체' : '피라미드형'})`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Atomic Legend Bar underneath diagram */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300">
        {(['Ge', 'Sb', 'Te'] as AtomType[]).map((type) => {
          const spec = ATOM_COLORS[type];
          return (
            <div key={type} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: spec.color }}
              />
              <div className="truncate">
                <span className="font-semibold text-white">{spec.symbol}</span>
                <span className="text-slate-400 text-[11px] ml-1 hidden sm:inline">
                  {spec.name.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
