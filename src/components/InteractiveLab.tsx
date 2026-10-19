import React, { useState } from 'react';
import { GSTState } from '../types/gst';
import { Gauge, Zap, Activity, Info, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  currentState: GSTState;
  onChangeState: (state: GSTState) => void;
}

export const InteractiveLab: React.FC<Props> = ({ currentState, onChangeState }) => {
  const [voltage, setVoltage] = useState<number>(0.5); // 0V to 2.0V

  // Realistic qualitative model for GST electrical response
  // Crystalline: Ohmic low-resistance path (R ≈ 500 Ω) -> I = V / 500
  // Amorphous: Sub-threshold high resistance (R ≈ 5 MΩ) until Vth ≈ 1.2V, then Ovonic threshold switching
  const isCryst = currentState === 'crystalline';

  // Calculate current in mA
  let current_mA = 0;
  let dynamicResistance_str = '';
  let modeDescription = '';

  if (isCryst) {
    // Linear Ohmic: e.g. at 1.0V, current is 2.0 mA (R = 500 Ω)
    current_mA = voltage * 2.0;
    dynamicResistance_str = '약 500 Ω (매우 낮음)';
    modeDescription = '공명 결합과 규칙적 격자로 인해 전자가 산란 없이 흘러 선형적인 옴(Ohmic)의 법칙을 따릅니다.';
  } else {
    // Amorphous with Ovonic Threshold Switching (Vth = 1.2V)
    if (voltage < 1.15) {
      // Sub-threshold Poole-Frenkel conduction: tiny leakage current
      current_mA = (Math.exp(voltage * 2.5) - 1) * 0.005;
      dynamicResistance_str = '약 1 ~ 10 MΩ (매우 높음)';
      modeDescription = '국재화된 공유 결합과 트랩 준위로 전자가 갇혀 있어 누설 전류만 극미량 흐르는 고저항 상태입니다.';
    } else {
      // Threshold switching region: dramatic surge in current
      const delta = voltage - 1.15;
      current_mA = 0.05 + delta * 2.8;
      dynamicResistance_str = '수백 Ω (임계 스위칭 발생)';
      modeDescription = '문턱 전압(Vth)을 넘어선 높은 전기장으로 인해 트랩 준위가 채워지며 급격히 전도성이 생기는 오보닉 임계 스위칭(OTS) 상태입니다!';
    }
  }

  // Generate SVG curve points
  const pointsCryst: string[] = [];
  const pointsAmorph: string[] = [];
  for (let v = 0; v <= 2.0; v += 0.05) {
    // X axis: 0V to 2.0V mapped to 40 to 360
    const x = 45 + (v / 2.0) * 315;
    // Cryst Y: 0 to 4.0 mA mapped to 160 to 20
    const iCryst = v * 2.0;
    const yCryst = 160 - (iCryst / 4.0) * 140;
    pointsCryst.push(`${x},${yCryst}`);

    // Amorph Y:
    let iAmorph = 0;
    if (v < 1.15) {
      iAmorph = (Math.exp(v * 2.5) - 1) * 0.005;
    } else {
      iAmorph = 0.05 + (v - 1.15) * 2.8;
    }
    const yAmorph = 160 - (Math.min(iAmorph, 4.0) / 4.0) * 140;
    pointsAmorph.push(`${x},${yAmorph}`);
  }

  // Current operating point
  const currentOpX = 45 + (voltage / 2.0) * 315;
  const currentOpY = 160 - (Math.min(current_mA, 4.0) / 4.0) * 140;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>청중 참여형 가상 탐구 실험대</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-normal">누구나 스마트폰/PC로 직접 전압 제어</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            GST 전압 인가에 따른 전류-전압(I-V) 및 저항 실시간 계측
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            슬라이더를 움직여 전압을 변경하면서, 비정질과 결정질 상태의 전하 흐름 및 문턱 스위칭(Vth)을 직접 비교해보세요.
          </p>
        </div>

        {/* State Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onChangeState('amorphous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isCryst
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            비정질 (Amorphous)
          </button>
          <button
            onClick={() => onChangeState('crystalline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isCryst
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            결정질 (Crystalline)
          </button>
        </div>
      </div>

      {/* Main Experiment Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Controls & Digital Multimeters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Voltage Slider Control */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>인가 전압 조절 (Voltage Input)</span>
              </span>
              <span className="text-sm font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-600/40">
                {voltage.toFixed(2)} V
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>0.0V (무전압)</span>
              <span>1.2V (임계 문턱 Vth)</span>
              <span>2.0V (고전압)</span>
            </div>

            {/* Quick preset buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => setVoltage(0.2)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-lg border transition-all text-center cursor-pointer ${
                  voltage === 0.2
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
                title="상변환을 일으키지 않고 상태만 읽어내는 미약한 읽기 전압"
              >
                읽기 전압 (0.2V)
              </button>
              <button
                onClick={() => setVoltage(1.0)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-lg border transition-all text-center cursor-pointer ${
                  voltage === 1.0
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                중간 전압 (1.0V)
              </button>
              <button
                onClick={() => setVoltage(1.6)}
                className={`px-2 py-1.5 text-[11px] font-medium rounded-lg border transition-all text-center cursor-pointer ${
                  voltage === 1.6
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
                title="문턱 전압을 넘어 급격한 전도가 일어나는 쓰기 영역"
              >
                스위칭 전압 (1.6V)
              </button>
            </div>
          </div>

          {/* Virtual Digital Meters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current Meter */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">측정 전류 (Current, I)</span>
              <div className="text-xl font-extrabold font-mono text-cyan-400">
                {current_mA < 0.001
                  ? '0.00 mA'
                  : current_mA < 0.1
                  ? `${(current_mA * 1000).toFixed(0)} µA`
                  : `${current_mA.toFixed(2)} mA`}
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isCryst ? '원활한 전하 통과' : current_mA > 0.1 ? '임계 스위칭 통전' : '전하 이동 차단'}
              </span>
            </div>

            {/* Resistance Meter */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">동적 저항 (Resistance, R)</span>
              <div
                className={`text-xl font-extrabold font-mono ${
                  isCryst ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isCryst ? '저저항 (Low R)' : voltage < 1.15 ? '고저항 (High R)' : '동적 급감'}
              </div>
              <span className="text-[10px] text-slate-500 block truncate" title={dynamicResistance_str}>
                {dynamicResistance_str}
              </span>
            </div>
          </div>

          {/* Physical Interpretation Box */}
          <div className="bg-slate-850/80 rounded-xl p-3.5 border border-slate-850 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>현재 작동 상태 해설</span>
            </div>
            <p className="text-slate-300">{modeDescription}</p>
          </div>
        </div>

        {/* Right: Real-time I-V Curve Graph (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>실시간 전류-전압(I-V) 특성 곡선</span>
            <div className="flex items-center gap-3 text-[11px] font-normal">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                결정질 (Ohmic)
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2.5 h-0.5 bg-indigo-400 inline-block"></span>
                비정질 (OTS 곡선)
              </span>
            </div>
          </div>

          {/* SVG I-V Graph */}
          <div className="relative w-full aspect-16/9 bg-slate-900 rounded-lg p-2 border border-slate-800/80">
            <svg viewBox="0 0 380 180" className="w-full h-full select-none">
              {/* Grid Lines */}
              <line x1="45" y1="160" x2="360" y2="160" stroke="#334155" strokeWidth="1" />
              <line x1="45" y1="125" x2="360" y2="125" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />
              <line x1="45" y1="90" x2="360" y2="90" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />
              <line x1="45" y1="55" x2="360" y2="55" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />
              <line x1="45" y1="20" x2="360" y2="20" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />

              <line x1="45" y1="20" x2="45" y2="160" stroke="#334155" strokeWidth="1" />
              <line x1="123" y1="20" x2="123" y2="160" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />
              <line x1="202" y1="20" x2="202" y2="160" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />
              <line x1="281" y1="20" x2="281" y2="160" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="1" />

              {/* Threshold Voltage Indicator Line (Vth = 1.2V) */}
              <line x1="234" y1="20" x2="234" y2="160" stroke="#f59e0b" strokeDasharray="3,3" strokeWidth="1.2" />
              <text x="238" y="32" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                Vth (문턱 전압 ≈ 1.2V)
              </text>

              {/* Axis Labels */}
              <text x="40" y="24" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">
                4.0mA
              </text>
              <text x="40" y="94" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">
                2.0mA
              </text>
              <text x="40" y="163" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">
                0
              </text>

              <text x="45" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                0V
              </text>
              <text x="123" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                0.5V
              </text>
              <text x="202" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                1.0V
              </text>
              <text x="281" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                1.5V
              </text>
              <text x="360" y="174" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                2.0V
              </text>

              {/* Crystalline Curve (Green straight line) */}
              <polyline
                points={pointsCryst.join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth={isCryst ? '3' : '1.5'}
                opacity={isCryst ? '1' : '0.4'}
              />

              {/* Amorphous Curve (Indigo S-curve with OTS) */}
              <polyline
                points={pointsAmorph.join(' ')}
                fill="none"
                stroke="#818cf8"
                strokeWidth={!isCryst ? '3' : '1.5'}
                opacity={!isCryst ? '1' : '0.4'}
              />

              {/* Current Operating Point marker */}
              <circle
                cx={currentOpX}
                cy={currentOpY}
                r="6"
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />
              <circle
                cx={currentOpX}
                cy={currentOpY}
                r="11"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Graph Explanation Note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0"></span>
            <span>
              <strong>붉은 점</strong>은 현재 인가된 전압에서의 실제 동작점입니다. 비정질 상태에서 문턱 전압(Vth)을 넘으면 소자가 손상되지 않고 급격히 전류가 흘러 줄 가열(Joule Heating)이 가능해지는 것이 PRAM 동작의 핵심 물리 원리입니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
