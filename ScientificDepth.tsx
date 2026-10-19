import React, { useState } from 'react';
import { AlertCircle, BookOpen, ChevronDown, ChevronUp, ShieldAlert, Atom, Zap } from 'lucide-react';

export const ScientificDepth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'model' | 'bonding' | 'generalization'>('model');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            과학적 모델링 탐구 노트 (정확성과 원리 심화)
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'model'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            개념 모델 명시
          </button>
          <button
            onClick={() => setActiveTab('bonding')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'bonding'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            결합과 전자 상태
          </button>
          <button
            onClick={() => setActiveTab('generalization')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'generalization'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            일반화 주의 (오개념 방지)
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-5 text-slate-700 text-sm leading-relaxed">
        {activeTab === 'model' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-950">
                  개념 모델(Conceptual Model)로서의 성격
                </strong>
                <p className="text-xs text-amber-800/90 mt-1">
                  본 시뮬레이션은 실제 GST(Ge₂Sb₂Te₅)의 원자 배열과 전자 이동을 밀도범함수론(DFT)이나
                  분자동역학(MD) 등으로 정밀 계산한 물리적 수치 시뮬레이션이 아닙니다. 고등학교 과학
                  탐구 발표에서 **상변환에 따른 원자 배열의 규칙성 차이와 전기 저항의 상관관계**라는
                  핵심 물리·화학적 개념을 직관적으로 설명하기 위해 단순화된 2차원 개념 모델입니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  정성적 비교 원칙 (Qualitative Comparison)
                </span>
                <p className="text-slate-600">
                  임의의 전기 저항 수치(Ω)나 미검증된 실험 데이터를 가공하여 제시하지 않고,
                  과학적 사실에 기반하여 비정질 상태는 **'높음(고저항)'**, 결정질 상태는
                  **'낮음(저저항)'**으로 정성적 비교를 수행합니다. 실제 PRAM 소자에서는 두 상태 간
                  저항 차이가 수백~수천 배(orders of magnitude) 이상 발생하여 뚜렷한 판별(Margin)을 가집니다.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  애니메이션 전이의 본질
                </span>
                <p className="text-slate-600">
                  상태 변환 버튼을 누를 때 일어나는 원자의 이동 애니메이션은 두 구조적 상태 사이의
                  시각적 연결을 돕기 위한 표현이며, 실제 펨토초(fs) 단위의 피코초 상변환 경로를
                  실시간으로 재현한 것이 아님을 유의해야 합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bonding' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950">
              <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm mb-1">
                <Atom className="w-4 h-4 text-indigo-600" />
                <span>원자 배열뿐 아니라 '결합 방식'과 '전자 상태'가 핵심입니다</span>
              </div>
              <p className="text-indigo-900/90 leading-normal">
                단순히 원자가 반듯하게 줄 서 있는 것만으로 저항이 낮아지는 것이 아닙니다.
                GST 결정질 상에서는 원자 사이의 결합 방식과 전자 밴드 구조가 근본적으로 변합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800">결정질 GST의 공명 결합 (Resonant Bonding)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    낮은 저항 원인
                  </span>
                </div>
                <p className="text-slate-600">
                  결정질 GST(왜곡된 암염형 구조)에서는 Ge, Sb, Te의 **p-오비탈 전자가 인접 원자들과
                  비편재화(delocalization)된 공명 결합(Resonant bonding)**을 형성합니다.
                  이로 인해 높은 광학적 유전율과 높은 전하 이동도를 갖게 되어 전자가 훨씬 수월하게 이동하며
                  전기 저항이 크게 낮아집니다.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-800">비정질 GST의 국재화 결합 (Localized Bonds)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">
                    높은 저항 원인
                  </span>
                </div>
                <p className="text-slate-600">
                  비정질 상태에서는 Ge 원자가 4면체 배위로 전환되면서 전자들이 원자 간
                  **단단히 묶인 공유 결합(Localized covalent bonds)**을 형성합니다.
                  또한 장거리 주기성이 파괴되어 에너지 밴드갭 내에 수많은 결함 준위(트랩)가 발생하고,
                  자유 전하의 이동이 극심하게 방해받아 전기 저항이 크게 높아집니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generalization' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>과학적 오류 경계: "규칙적 배열 = 무조건 낮은 저항"이 아닙니다</span>
              </div>
              <p className="text-rose-950/90 leading-normal">
                과학적 모델링 탐구에서 가장 경계해야 할 것은 하나의 소재 현상을 일반 물리 법칙처럼
                성급하게 일반화하는 오류입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  반례 1: 다이아몬드 (Diamond)
                </span>
                <p className="text-slate-600 leading-normal">
                  다이아몬드는 탄소(C) 원자가 완벽하게 규칙적인 사면체 결정 격자를 이루고 있지만,
                  밴드갭이 약 5.5 eV로 매우 넓어 전자가 전도대로 여기되지 못하므로
                  전기가 거의 통하지 않는 **최고 수준의 부도체(절연체)**입니다.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  반례 2: 비정질 금속 합금 (Metallic Glasses)
                </span>
                <p className="text-slate-600 leading-normal">
                  액체 상태에서 급랭하여 만든 금속 유리는 원자 배열이 완전히 비정질(불규칙)이지만,
                  금속 결합 특유의 자유전자 바다를 그대로 유지하므로
                  **전기가 아주 잘 통하는 전도체**입니다.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg text-slate-700 leading-relaxed">
              <strong className="text-slate-900">탐구 결론: </strong>
              GST에서 나타나는 결정질의 저저항과 비정질의 고저항은 단순히 "배열이 반듯해서"가 아니라,
              **칼코게나이드계 화합물 특유의 p-오비탈 공명 결합 형성 여부와 밴드 구조 변화**라는
              복합적인 양자화학적 요인 때문임을 발표 시 명확히 짚어주어야 합니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
