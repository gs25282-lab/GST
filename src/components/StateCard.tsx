import React from 'react';
import { GSTState } from '../types/gst';
import { Binary, Gauge, GitBranch, Layers, Sparkles } from 'lucide-react';

interface Props {
  currentState: GSTState;
  onSelectState: (state: GSTState) => void;
}

export const StateCard: React.FC<Props> = ({ currentState, onSelectState }) => {
  const isAmorphous = currentState === 'amorphous';

  return (
    <div className="space-y-4">
      {/* State Switcher Buttons (Prompt Section 2: "두 상태를 선택할 수 있는 버튼: 비정질 상태와 결정질 상태") */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/80 rounded-xl border border-slate-300/80">
        <button
          type="button"
          onClick={() => onSelectState('amorphous')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${
            isAmorphous
              ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-500/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAmorphous ? 'bg-indigo-600' : 'bg-slate-400'
              }`}
            />
            <span className="text-base font-bold whitespace-nowrap">비정질 상태</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
            Amorphous Phase · RESET
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectState('crystalline')}
          className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${
            !isAmorphous
              ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-500/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                !isAmorphous ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
            />
            <span className="text-base font-bold whitespace-nowrap">결정질 상태</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
            Crystalline Phase · SET
          </span>
        </button>
      </div>

      {/* Selected State Characteristics Display (Prompt Section 3: 원자 배열, 전기 저항, 메모리 상태) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              선택된 상태의 특성 요약
            </span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>{isAmorphous ? '비정질 상태 (Amorphous)' : '결정질 상태 (Crystalline)'}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  isAmorphous
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isAmorphous ? 'RESET 상태' : 'SET 상태'}
              </span>
            </h3>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-black ${
              isAmorphous
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}
          >
            {isAmorphous ? '0' : '1'}
          </div>
        </div>

        {/* 3 Core Comparison Metrics (Directly matching prompt specs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
          {/* 1. 원자 배열 */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>원자 배열</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {isAmorphous ? '불규칙함' : '규칙적임'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {isAmorphous
                ? '장거리 주기성 상실, 4면체/피라미드형 불규칙 망목 구조'
                : '3차원 주기적 격자 배열, 왜곡된 암염형(Rock-salt) 구조'}
            </p>
          </div>

          {/* 2. 전기 저항 (Qualitative strictly: 높음 / 낮음) */}
          <div
            className={`p-3.5 rounded-lg border ${
              isAmorphous
                ? 'bg-amber-50/60 border-amber-200/70'
                : 'bg-emerald-50/60 border-emerald-200/70'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>전기 저항</span>
            </div>
            <div
              className={`text-lg font-extrabold flex items-center gap-2 ${
                isAmorphous ? 'text-amber-800' : 'text-emerald-800'
              }`}
            >
              <span>{isAmorphous ? '높음' : '낮음'}</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200">
                {isAmorphous ? '고저항' : '저저항'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              {isAmorphous
                ? '국재화된 공유 결합과 전하 트랩으로 인해 전도 방해'
                : '비편재화된 p-오비탈 공명 결합으로 전자 이동 원활'}
            </p>
          </div>

          {/* 3. 메모리 상태 */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
              <Binary className="w-3.5 h-3.5 text-slate-400" />
              <span>메모리 상태</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>일반적으로</span>
              <span
                className={`font-mono px-2 py-0.5 rounded text-base ${
                  isAmorphous ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {isAmorphous ? "'0'" : "'1'"}
              </span>
              <span>으로 표현</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {isAmorphous
                ? '리셋(RESET) 데이터 상태 · 전류가 거의 흐르지 않음'
                : '셋(SET) 데이터 상태 · 전류가 쉽게 흐름'}
            </p>
          </div>
        </div>

        {/* Comparison Details Table */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 mb-2">상태별 비교 일람표</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                  <th className="py-2 px-3">구분 항목</th>
                  <th className="py-2 px-3 text-indigo-700">비정질 상태 (Amorphous)</th>
                  <th className="py-2 px-3 text-emerald-700">결정질 상태 (Crystalline)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className={isAmorphous ? 'bg-indigo-50/40' : ''}>
                  <td className="py-2 px-3 font-semibold text-slate-900">원자 배열</td>
                  <td className="py-2 px-3 font-bold text-indigo-900">불규칙함 (Disordered)</td>
                  <td className="py-2 px-3 text-slate-600">규칙적임 (Ordered lattice)</td>
                </tr>
                <tr className={!isAmorphous ? 'bg-emerald-50/40' : ''}>
                  <td className="py-2 px-3 font-semibold text-slate-900">전기 저항</td>
                  <td className="py-2 px-3 text-slate-600">높음 (High Resistance)</td>
                  <td className="py-2 px-3 font-bold text-emerald-900">낮음 (Low Resistance)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">메모리 상태</td>
                  <td className="py-2 px-3">일반적으로 '0' (RESET)</td>
                  <td className="py-2 px-3">일반적으로 '1' (SET)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">원자 결합 특성</td>
                  <td className="py-2 px-3">국재화된 공유 결합 (Localized covalent)</td>
                  <td className="py-2 px-3">공명 결합 (Resonant bonding)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">상변환 열처리</td>
                  <td className="py-2 px-3">녹는점 이상 가열 후 급격한 냉각 (급랭)</td>
                  <td className="py-2 px-3">결정화 온도 이상 유지 후 서서히 냉각 (어닐링)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
