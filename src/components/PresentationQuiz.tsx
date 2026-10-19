import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  MessageSquareQuote,
  Send,
  Sparkles,
  Users,
  Award,
  RefreshCw,
  MessageCircle,
  Check
} from 'lucide-react';

interface InteractiveQuizItem {
  id: number;
  question: string;
  badge: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const INTERACTIVE_QUIZZES: InteractiveQuizItem[] = [
  {
    id: 1,
    badge: '원자 결합과 저항',
    question: 'GST의 결정질 상태가 비정질 상태보다 전기 저항이 1,000배 이상 현저하게 낮은 결정적 이유는 무엇일까요?',
    options: [
      '원자의 크기가 결정질일 때 절반으로 줄어들기 때문',
      '주기적인 격자 정렬과 함께 p-오비탈 공명 결합(Resonant bonding)으로 전자가 비편재화되기 때문',
      '결정질 상태가 되면 물질 내에 구리 도선이 생성되기 때문',
      '결정질 상태는 절대영도(-273℃)에 가까운 초전도 상태이기 때문',
    ],
    correctIndex: 1,
    explanation:
      '정답입니다! 결정질 GST는 원자들의 규칙적 배열뿐만 아니라, 인접한 원자들 간의 p-오비탈 공명 결합에 의해 전자가 널리 퍼져(비편재화) 산란 없이 자유롭게 이동하여 전기 저항이 급감합니다.',
  },
  {
    id: 2,
    badge: '상변환 열 펄스',
    question: 'PRAM에서 데이터를 0(비정질, 고저항)으로 리셋(RESET)할 때 가하는 열 펄스의 올바른 특징은?',
    options: [
      '녹는점(Tm) 이상으로 고온 가열한 후 아주 천천히 서서히 식힌다',
      '결정화 온도(Tx) 아래에서만 미약하게 장시간 가열한다',
      '녹는점(Tm) 이상으로 순식간에 가열하여 액체 상태로 만든 후 급격히 냉각(급랭)시킨다',
      '영하 50℃로 냉매를 분사하여 동결시킨다',
    ],
    correctIndex: 2,
    explanation:
      '정답입니다! RESET 동작은 높은 전류로 녹는점(Tm ≈ 600℃) 이상으로 순식간에 녹인 뒤 수 나노초(ns) 이내에 급랭시켜 원자들이 규칙적인 자리를 찾지 못하고 불규칙하게 얼어붙게(비정질화) 만듭니다.',
  },
  {
    id: 3,
    badge: '과학적 오개념 탐구',
    question: '"원자 배열이 규칙적인 결정질이면 모든 물질의 전기 저항이 낮아진다"라는 명제는 과학적으로 옳을까요?',
    options: [
      '옳다. 원자 배열의 규칙성이 전기 저항을 결정하는 유일한 요인이다.',
      '틀렸다. 다이아몬드는 완벽한 결정질이지만 밴드갭이 매우 커서 전류가 안 통하는 부도체이다.',
      '옳다. 비정질 상태에서는 어떤 물질도 전기가 통할 수 없다.',
      '틀렸다. 물질의 원자 배열과 전기 저항은 전혀 아무런 상관이 없다.',
    ],
    correctIndex: 1,
    explanation:
      '정답입니다! 전기 전도도는 원자 배열뿐 아니라 에너지 밴드갭과 자유 전자 수에 의해 결정됩니다. 따라서 GST의 특성을 다른 고체 물질에 무분별하게 일반화하지 않도록 주의해야 합니다.',
  },
];

interface AudienceComment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  '결정질에서 비정질로 바꿀 때 왜 급랭시켜야 하나요?',
  'PRAM의 쓰기 수명은 플래시 메모리보다 얼마나 긴가요?',
  '실제 컴퓨터 RAM을 완전히 대체하기 어려운 이유는 무엇인가요?',
  '게르마늄, 안티모니, 텔루륨 중 어떤 원소가 상변환 속도에 가장 큰 영향을 주나요?',
];

export const PresentationQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<'quiz' | 'qa' | 'cards'>('quiz');

  // Audience Questions state (stored in localStorage for real interactive classroom experience)
  const [comments, setComments] = useState<AudienceComment[]>(() => {
    try {
      const saved = localStorage.getItem('gst_classroom_comments');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: '1',
        name: '김지훈 (2반 학생)',
        text: '비정질에서 결정질로 바뀔 때 부피 변화로 인한 소자 스트레스는 어떻게 해결하나요?',
        timestamp: '방금 전',
      },
      {
        id: '2',
        name: '이수연 (탐구 조원)',
        text: '스마트폰 카메라로 접속해서 직접 전압 슬라이더를 당겨보니 문턱 전압(Vth) 스위칭이 확실히 체감되네요!',
        timestamp: '1분 전',
      },
    ];
  });

  const [inputName, setInputName] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [submittedToast, setSubmittedToast] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('gst_classroom_comments', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  const handleSelectAnswer = (quizId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const handleAddComment = (textToAdd?: string) => {
    const text = (textToAdd || inputText).trim();
    if (!text) return;

    const newComment: AudienceComment = {
      id: Date.now().toString(),
      name: inputName.trim() || '청중 참여자',
      text,
      timestamp: '방금 전',
    };

    setComments((prev) => [newComment, ...prev]);
    if (!textToAdd) {
      setInputText('');
    }
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 2500);
  };

  // Calculate score
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = INTERACTIVE_QUIZZES.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 sm:p-6 space-y-5">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Users className="w-4 h-4" />
            <span>청중 참여 &amp; 실시간 탐구 토론</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            발표 청중 실시간 퀴즈 &amp; 현장 질의응답 보드
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            스마트폰이나 노트북으로 접속한 급우들이 직접 문제를 풀고 질문을 남길 수 있는 실시간 참여 공간입니다.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            실시간 퀴즈 풀기
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'qa'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            질문 남기기 ({comments.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Live Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Score Summary Bar */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-300">내 풀이 진행도</span>
                <div className="text-sm font-bold text-white">
                  3문제 중 <span className="text-cyan-400">{answeredCount}</span>문제 완료 · 정답{' '}
                  <span className="text-emerald-400">{correctCount}</span>개
                </div>
              </div>
            </div>

            {answeredCount > 0 && (
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 풀기</span>
              </button>
            )}
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-4">
            {INTERACTIVE_QUIZZES.map((quiz, qIdx) => {
              const selectedOpt = selectedAnswers[quiz.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === quiz.correctIndex;

              return (
                <div
                  key={quiz.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {quiz.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-400">문제 {qIdx + 1}</span>
                    </div>

                    {isAnswered && (
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>정답!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>오답</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-white leading-snug">{quiz.question}</p>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {quiz.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      let btnStyle =
                        'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                      if (isAnswered) {
                        if (optIdx === quiz.correctIndex) {
                          btnStyle =
                            'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/40';
                        } else if (isThisSelected) {
                          btnStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200';
                        } else {
                          btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(quiz.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                            {optIdx + 1}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box shown after answering */}
                  {isAnswered && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <strong className="block mb-1 font-semibold text-white">
                        {isCorrect ? '💡 정답 해설' : '⚠️ 오답 피드백 및 정답 해설'}
                      </strong>
                      <p className="text-slate-300">{quiz.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Audience Q&A Board */}
      {activeTab === 'qa' && (
        <div className="space-y-5">
          {/* Submit Question Input */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <MessageCircle className="w-4 h-4" />
              <span>발표자에게 질문 또는 탐구 소감 남기기</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="이름 또는 닉네임 (예: 2반 홍길동)"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 sm:col-span-1"
              />
              <div className="relative sm:col-span-3 flex gap-2">
                <input
                  type="text"
                  placeholder="궁금한 점이나 탐구 의견을 자유롭게 적어보세요..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  onClick={() => handleAddComment()}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>
            </div>

            {submittedToast && (
              <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>질문이 등록되었습니다! 발표 화면에 실시간으로 표시됩니다.</span>
              </div>
            )}

            {/* Quick Preset Question Chips */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1.5">
                💡 질문하기 막막할 땐 추천 질문을 클릭해보세요:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddComment(q)}
                    className="text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions Feed */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>현장 청중 질문 목록 ({comments.length}건)</span>
              <span>최신순</span>
            </div>

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">{comment.name}</span>
                  <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
