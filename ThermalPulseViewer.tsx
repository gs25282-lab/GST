import React, { useState } from 'react';
import { GSTState } from '../types/gst';
import { Flame, Snowflake, Clock, Activity } from 'lucide-react';

interface Props {
  currentState: GSTState;
  onApplyPulse: (targetState: GSTState) => void;
}

export const ThermalPulseViewer: React.FC<Props> = ({ currentState, onApplyPulse }) => {
  const [pulseAnim, setPulseAnim] = useState<GSTState | null>(null);

  const handleTrigger = (targetState: GSTState) => {
    setPulseAnim(targetState);
    onApplyPulse(targetState);
    setTimeout(() => {
      setPulseAnim(null);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400">상변환 구동 원리</span>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>줄 가열(Joule Heating)과 온도-시간 열 펄스 프로파일</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTrigger('amorphous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              currentState === 'amorphous'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            RESET 펄스 인가 (급랭)
          </button>
          <button
            onClick={() => handleTrigger('crystalline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              currentState === 'crystalline'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            SET 펄스 인가 (어닐링)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-center">
        {/* SVG Pulse Diagram */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
            <span>온도 (Temperature, T)</span>
            <span>시간 (Time, t)</span>
          </div>

          <svg viewBox="0 0 420 200" className="w-full h-auto">
            {/* Horizontal Reference Lines */}
            {/* Melting Point Tm line */}
            <line x1="45" y1="40" x2="400" y2="40" stroke="#ef4444" strokeDasharray="4,4" strokeWidth="1" />
            <text x="40" y="44" fill="#f87171" fontSize="10" textAnchor="end" fontFamily="sans-serif">
              Tm (녹는점)
            </text>

            {/* Crystallization Temp Tx line */}
            <line x1="45" y1="110" x2="400" y2="110" stroke="#10b981" strokeDasharray="4,4" strokeWidth="1" />
            <text x="40" y="114" fill="#34d399" fontSize="10" textAnchor="end" fontFamily="sans-serif">
              Tx (결정화온도)
            </text>

            {/* Room Temp line */}
            <line x1="45" y1="170" x2="400" y2="170" stroke="#64748b" strokeWidth="1" />
            <text x="40" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">
              T0 (상온)
            </text>

            {/* Axes */}
            <line x1="45" y1="180" x2="45" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="45" y1="170" x2="410" y2="170" stroke="#94a3b8" strokeWidth="1.5" />

            {/* RESET Pulse Curve: High sharp spike above Tm, then steep quench (cooling) */}
            <g opacity={currentState === 'amorphous' || pulseAnim === 'amorphous' ? 1 : 0.4}>
              <path
                d="M 60 170 L 95 30 L 115 30 L 130 170"
                fill="rgba(99, 102, 241, 0.15)"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="105" cy="30" r="4" fill="#818cf8" />
              <text x="110" y="24" fill="#c7d2fe" fontSize="10" fontWeight="bold">
                RESET (짧고 강한 펄스 → 급랭)
              </text>
            </g>

            {/* SET Pulse Curve: Moderate height between Tx and Tm, longer plateau */}
            <g opacity={currentState === 'crystalline' || pulseAnim === 'crystalline' ? 1 : 0.4}>
              <path
                d="M 170 170 L 210 90 L 320 90 L 360 170"
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="265" cy="90" r="4" fill="#34d399" />
              <text x="270" y="82" fill="#a7f3d0" fontSize="10" fontWeight="bold">
                SET (비교적 긴 펄스 → 결정화 어닐링)
              </text>
            </g>

            {/* Quench highlight indicator */}
            <path
              d="M 120 45 L 128 150"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              markerEnd="url(#arrow)"
            />
            <text x="135" y="110" fill="#93c5fd" fontSize="9">
              급랭 (Quenching)
            </text>
          </svg>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              RESET: 녹는점 이상 가열 후 수 ns 내 급속 냉각
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              SET: 결정화 온도 이상 유지 후 재배열 유도
            </span>
          </div>
        </div>

        {/* Conceptual Explanations on Thermal Pulse */}
        <div className="lg:col-span-5 space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
              <Snowflake className="w-4 h-4 text-indigo-600" />
              <span>RESET 과정 (비정질화 메커니즘)</span>
            </div>
            <p className="text-slate-600 leading-normal">
              강한 전류 펄스로 국소 부위를 녹는점(약 600°C) 이상으로 순간 가열하여 원자 결합을 모두 푼 뒤,
              펄스를 급격히 차단합니다. 열이 주변으로 빠져나가며 원자들이 원래의 규칙적인 격자로 돌아갈
              시간적 여유를 얻지 못하고 그 자리에서 얼어붙어 <strong>불규칙한 비정질 상태(고저항, 0)</strong>가 됩니다.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>SET 과정 (결정화 메커니즘)</span>
            </div>
            <p className="text-slate-600 leading-normal">
              중간 세기의 전류를 상대적으로 긴 시간 동안 가하여 GST를 결정화 온도(약 150~200°C) 이상으로
              유지합니다. 원자들에게 충분한 열에너지와 이동 시간을 제공하여 에너지가 가장 안정한
              <strong>규칙적인 결정 격자(저저항, 1)</strong>로 재배열되도록 만듭니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
