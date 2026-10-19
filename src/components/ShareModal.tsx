import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getPublicShareUrl, copyToClipboard, isDevDomain } from '../utils/shareUtils';
import { GSTState } from '../types/gst';
import {
  X,
  Copy,
  Check,
  QrCode,
  Share2,
  AlertTriangle,
  Download,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentState: GSTState;
  currentSection?: string;
}

export const ShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentState,
  currentSection,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [includeState, setIncludeState] = useState<boolean>(false);
  const [targetTab, setTargetTab] = useState<'default' | 'lab' | 'quiz'>('default');

  const activeParams: Record<string, string> = {};
  if (includeState) {
    activeParams.state = currentState;
  }
  if (targetTab === 'lab') {
    activeParams.section = 'lab-section';
  } else if (targetTab === 'quiz') {
    activeParams.section = 'discussion-section';
  }

  const publicUrl = getPublicShareUrl(activeParams);
  const onDev = isDevDomain();

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(publicUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation failed', err));
    }
  }, [isOpen, publicUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GST 소재의 원자 배열 변화와 전기 저항 시뮬레이터',
          text: '고등학교 과학 탐구 발표: GST 상변환 메모리 시뮬레이션에 참여해보세요!',
          url: publicUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'GST_시뮬레이션_참여_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>참여자 초대 &amp; 공개 링크 공유</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  403 방지 완료
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                급우들과 선생님이 로그인 없이 누구나 바로 참여할 수 있는 공개 주소입니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Why 403 happened banner */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200/90 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>403 금지 에러가 떴던 이유와 해결책</span>
            </div>
            <p>
              브라우저 상단 주소창의 <code className="px-1 py-0.5 rounded bg-black/40 text-amber-200 font-mono text-[11px]">ais-dev-...</code> 주소는 <strong>개발자 본인 구글 계정 전용</strong>이라 다른 사람이 열면 구글에서 <span className="underline decoration-amber-400">403 Forbidden</span> 오류를 냅니다.
            </p>
            <p className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              아래의 <strong>공개 참여 링크(<code className="font-mono text-[11px]">ais-pre-...</code>)</strong> 또는 <strong>QR 코드</strong>를 보내면 로그인 없이 누구나 즉시 시뮬레이션에 참여할 수 있습니다!
            </p>
          </div>

          {/* Share Link Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>누구나 접속 가능한 공개 참여 링크</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">로그인 불필요 · 실시간 접속</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 truncate select-all">
                {publicUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick presets for presentation */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              링크 접속 시 시작 화면 선택:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTargetTab('default')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                  targetTab === 'default'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                기본 시작 화면
              </button>
              <button
                onClick={() => setTargetTab('lab')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                  targetTab === 'lab'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                가상 측정 실험실
              </button>
              <button
                onClick={() => setTargetTab('quiz')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                  targetTab === 'quiz'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                청중 퀴즈 &amp; 질문함
              </button>
            </div>

            <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeState}
                onChange={(e) => setIncludeState(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
              />
              <span>
                현재 시뮬레이션 상태(<strong className="text-cyan-300">{currentState === 'amorphous' ? '비정질' : '결정질'}</strong>)를 링크에 포함하여 전달
              </span>
            </label>
          </div>

          {/* QR Code Section for Classroom Projection */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-md">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Classroom Participation QR Code" className="w-32 h-32 sm:w-36 sm:h-36" />
              ) : (
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-slate-200 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-white">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>스마트폰 카메라로 즉시 스캔 참여</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                발표 중 교실 빔프로젝터 화면에 이 창을 띄워두면, 급우들이 스마트폰 기본 카메라로 비추기만 해도 로그인 없이 바로 접속하여 원자 배열을 터치하고 퀴즈에 참여할 수 있습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  onClick={handleDownloadQr}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>QR 이미지 저장 (PPT 삽입용)</span>
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={handleNativeShare}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>카카오톡/SNS로 보내기</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>모바일 · 태블릿 · PC 전기종 호환</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
