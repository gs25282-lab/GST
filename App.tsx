/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GSTState, AtomType } from './types/gst';
import { AtomicArrangement } from './components/AtomicArrangement';
import { StateCard } from './components/StateCard';
import { ThermalPulseViewer } from './components/ThermalPulseViewer';
import { InteractiveLab } from './components/InteractiveLab';
import { ScientificDepth } from './components/ScientificDepth';
import { PresentationQuiz } from './components/PresentationQuiz';
import { ShareModal } from './components/ShareModal';
import { downloadStandaloneHtml } from './utils/generateStandaloneHtml';
import { isDevDomain, copyToClipboard, getPublicShareUrl } from './utils/shareUtils';
import {
  Download,
  Maximize2,
  Minimize2,
  Share2,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  Activity,
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<GSTState>('amorphous');
  const [showElectrons, setShowElectrons] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<AtomType | 'all'>('all');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [quickCopied, setQuickCopied] = useState<boolean>(false);

  const onDev = isDevDomain();

  // Read URL params on initial mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlState = searchParams.get('state');
      if (urlState === 'crystalline' || urlState === 'amorphous') {
        setState(urlState);
      }
      const section = searchParams.get('section');
      if (section) {
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      }
    } catch {
      // ignore
    }
  }, []);

  const togglePresentation = () => {
    setIsPresentationMode(!isPresentationMode);
  };

  const handleQuickCopyPublicLink = async () => {
    const publicUrl = getPublicShareUrl({ state });
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2200);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 flex flex-col ${isPresentationMode ? 'p-2 sm:p-4 bg-slate-950' : ''}`}>
      {/* 403 Warning & Quick Link Banner (Visible if running on ais-dev) */}
      {onDev && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2.5 z-50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>403 에러 방지 안내:</strong> 현재 화면 주소(ais-dev)를 친구/선생님께 전달하면 403 접근 금지 오류가 뜹니다.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickCopyPublicLink}
              className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {quickCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{quickCopied ? '공개 링크 복사 완료!' : '403 방지 공개 링크 복사'}</span>
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR 코드 보기</span>
            </button>
          </div>
        </div>
      )}

      {/* 3-Zone Top Bar Contract */}
      {!isPresentationMode && (
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
            {/* Zone 1: Brand title, one line */}
            <a href="#" className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>GST 상변환 메모리 시뮬레이터</span>
            </a>

            {/* Zone 2: 5 nav links */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
              <a href="#visualizer-section" className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
                원자 배열 모델
              </a>
              <a href="#thermal-section" className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
                상변환 열 펄스
              </a>
              <a href="#lab-section" className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>가상 측정 실험실</span>
              </a>
              <a href="#theory-section" className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
                과학적 원리
              </a>
              <a href="#discussion-section" className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
                청중 퀴즈 &amp; 토론
              </a>
            </nav>

            {/* Zone 3: Primary Actions (Share & QR, Download, Presentation) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Prominent Share / Join Button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm hover:shadow-cyan-500/20"
                title="친구들과 선생님이 스마트폰이나 PC로 바로 접속할 수 있는 공개 링크와 QR 코드를 엽니다"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>참여 링크 &amp; QR</span>
              </button>

              <button
                onClick={togglePresentation}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
                title="프로젝터 발표를 위해 여백을 줄이고 시각화 모델을 강조합니다"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>발표 모드</span>
              </button>

              <button
                onClick={downloadStandaloneHtml}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
                title="오프라인 교실에서도 바로 실행 가능한 단일 HTML 파일을 다운로드합니다"
              >
                <Download className="w-3.5 h-3.5" />
                <span>단일 HTML</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Title & Exploration Briefing */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>고등학교 2학년 과학적 모델링 탐구 발표</span>
              <span>·</span>
              <span>차세대 비휘발성 메모리 (PRAM)</span>
              <span>·</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                청중 실시간 참여 지원
              </span>
            </div>
            {/* Exact Required Title from user prompt */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
              「GST 소재의 원자 배열 변화와 전기 저항」
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              상변환 메모리(Phase Change RAM)에 핵심으로 사용되는 칼코게나이드계 화합물{' '}
              <strong className="text-slate-200">GST(Ge₂Sb₂Te₅)</strong>의 비정질 상태와 결정질 상태를
              비교하고, 원자 배열의 차이와 전기 저항의 관계를 시각적으로 직관적이게 탐구하는 과학적 개념 모델입니다.
            </p>
          </div>

          {/* Quick Actions (Share + Exit presentation) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>청중 참여 QR 띄우기</span>
            </button>

            {isPresentationMode && (
              <button
                onClick={togglePresentation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>일반 모드로 복귀</span>
              </button>
            )}
          </div>
        </div>

        {/* Audience Participation Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                함께 참여 중인 급우/선생님이신가요?
              </span>
              <span className="text-slate-400">
                아래 2차원 원자 격자를 직접 터치하고, 가상 실험실에서 전압을 조절하며 실시간 퀴즈에 도전해보세요!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleQuickCopyPublicLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {quickCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{quickCopied ? '복사됨!' : '참여 링크 복사'}</span>
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR 코드 전체화면</span>
            </button>
          </div>
        </div>

        {/* Core Interactive Sandbox: 2-Column Split Layout */}
        <section id="visualizer-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Atomic Visualization SVG Stage (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white">GST 2차원 원자 배열 모델 (SVG)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                원자를 클릭하면 상세 배위 정보를 확인합니다
              </span>
            </div>

            {/* Atomic Arrangement Component */}
            <AtomicArrangement
              state={state}
              showElectrons={showElectrons}
              onToggleElectrons={() => setShowElectrons(!showElectrons)}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
            />
          </div>

          {/* Right: State Selectors & Characteristics Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <StateCard currentState={state} onSelectState={setState} />
          </div>
        </section>

        {/* Thermal Pulse Mechanism Section */}
        <section id="thermal-section">
          <ThermalPulseViewer currentState={state} onApplyPulse={setState} />
        </section>

        {/* Audience Interactive Virtual Lab Section (I-V and Threshold Switching) */}
        <section id="lab-section">
          <InteractiveLab currentState={state} onChangeState={setState} />
        </section>

        {/* Scientific Accuracy & In-Depth Notes */}
        <section id="theory-section">
          <ScientificDepth />
        </section>

        {/* Classroom Presentation Q&A Discussion & Live Quizzes */}
        <section id="discussion-section">
          <PresentationQuiz />
        </section>

        {/* Mandatory Scientific Disclaimer Banner at bottom */}
        <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300 font-semibold block mb-0.5">
              과학적 모델링 한계 및 유의사항 명시
            </strong>
            본 시뮬레이션은 실제 GST 결정의 3차원 격자 진동 및 비평형 상태의 전자 수송을 양자역학적으로 계산한 수치
            결과가 아니며, 과학적 핵심 원리(상변환에 따른 원자 배열의 규칙성과 전기 저항의 상관관계)를 고등학교 발표
            현장에서 직관적으로 설명하기 위한 교육용 개념 모델(Conceptual Model)입니다.
          </div>
        </div>
      </main>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentState={state}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>고등학교 2학년 과학적 모델링 탐구 발표 자료 · GST 상변환 메모리 시뮬레이터</p>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              참여 링크 &amp; QR 공유
            </button>
            <span>·</span>
            <button
              onClick={downloadStandaloneHtml}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              단일 HTML 저장
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
