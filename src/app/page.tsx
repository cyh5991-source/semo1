"use client";

import { useState, useEffect, useRef } from "react";

/* ── 질문 데이터 ── */
const QUESTIONS = [
  {
    id: "debt_range", emoji: "💳",
    title: "현재 총 채무가\n얼마 정도인가요?",
    subtitle: "대략적인 범위만 골라주세요",
    options: [
      { label: "2,000~3,000만", value: 2500 },
      { label: "3,000~5,000만", value: 4000 },
      { label: "5,000만~1억", value: 7500 },
      { label: "1억~2억", value: 15000 },
      { label: "2억 이상", value: 25000 },
    ],
  },
  {
    id: "debt_type", emoji: "📑",
    title: "어떤 종류의 빚이\n가장 많은가요?",
    subtitle: "가장 큰 비중을 차지하는 것 하나만",
    options: [
      { label: "카드값·현금서비스", value: "card", icon: "💳" },
      { label: "은행 대출", value: "bank", icon: "🏦" },
      { label: "캐피탈·저축은행", value: "capital", icon: "🏢" },
      { label: "사채·개인빚", value: "private", icon: "🤝" },
      { label: "여러 가지 섞여있음", value: "mixed", icon: "📦" },
    ],
  },
  {
    id: "housing", emoji: "🏠",
    title: "본인 명의의 집이\n있으신가요?",
    subtitle: "담보대출 여부를 확인하기 위해서예요",
    options: [
      { label: "네, 있어요", value: "yes", icon: "🏠" },
      { label: "아니요, 없어요", value: "no", icon: "🙅" },
    ],
  },
  {
    id: "job_type", emoji: "💼",
    title: "현재 어떤 일을\n하고 계신가요?",
    subtitle: "소득 유형에 따라 변제금이 달라져요",
    options: [
      { label: "직장인 (정규직)", value: "regular", icon: "👔" },
      { label: "직장인 (계약·파견)", value: "contract", icon: "📋" },
      { label: "자영업·사업자", value: "self", icon: "🏪" },
      { label: "아르바이트·일용직", value: "part", icon: "🔧" },
      { label: "프리랜서", value: "freelance", icon: "💻" },
      { label: "현재 무직", value: "unemployed", icon: "🏠" },
    ],
  },
  {
    id: "income_range", emoji: "💰",
    title: "월 소득이\n얼마 정도인가요?",
    subtitle: "세전 기준으로 골라주세요",
    options: [
      { label: "150만 원 이하", value: 120 },
      { label: "150~250만 원", value: 200 },
      { label: "250~350만 원", value: 300 },
      { label: "350~500만 원", value: 420 },
      { label: "500만 원 이상", value: 550 },
    ],
  },
  {
    id: "family", emoji: "👨‍👩‍👧‍👦",
    title: "부양가족이\n몇 명인가요?",
    subtitle: "본인 포함, 같이 먹고 사는 가족 수",
    options: [
      { label: "나 혼자", value: 1, icon: "🧑" },
      { label: "2명", value: 2, icon: "👫" },
      { label: "3명", value: 3, icon: "👨‍👩‍👦" },
      { label: "4명", value: 4, icon: "👨‍👩‍👧‍👦" },
      { label: "5명 이상", value: 5, icon: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    id: "overdue", emoji: "⏰",
    title: "연체된 지\n얼마나 되셨나요?",
    subtitle: "아직 연체 전이어도 괜찮아요",
    options: [
      { label: "아직 연체 전", value: 0 },
      { label: "1~3개월", value: 2 },
      { label: "3~6개월", value: 5 },
      { label: "6개월~1년", value: 9 },
      { label: "1년 넘었어요", value: 15 },
    ],
  },
  {
    id: "lawsuit", emoji: "⚖️",
    title: "압류나 소송을\n받고 계신가요?",
    subtitle: "급여 압류, 재산 압류, 독촉장 모두 포함",
    options: [
      { label: "네, 받고 있어요", value: "yes", icon: "📩" },
      { label: "아직은 없어요", value: "no", icon: "🙂" },
    ],
  },
];

/* ── 계산 ── */
function calcResult(a: Record<string, any>) {
  const debt = Number(a.debt_range) || 5000;
  const income = Number(a.income_range) || 250;
  const family = Number(a.family) || 1;
  const living = family * 120;
  const disp = Math.max(income - living, 0);
  const mp = Math.round(disp * 0.65);
  const total36 = mp * 36;
  const reduction = debt > 0 ? Math.min(Math.round((1 - total36 / debt) * 100), 90) : 0;
  return { debt, income, family, living, mp, total36, reduction };
}

/* ── 공통 컴포넌트 ── */
function CircleProgress({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex items-center gap-3.5">
      <svg width="48" height="48" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#E8EBF3" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="#3B6AFF" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.16,1,.3,1)", transform: "rotate(-90deg)", transformOrigin: "center" }} />
        <text x="48" y="53" textAnchor="middle" fill="#1B2559" fontSize="22" fontWeight="800" fontFamily="Outfit">{current}</text>
      </svg>
      <div>
        <p className="text-xs text-gray-400 font-medium">{total}개 중 {current}번째</p>
        <p className="text-sm text-navy font-bold">거의 다 왔어요!</p>
      </div>
    </div>
  );
}

function OptionButton({ label, icon, selected, onClick }: { label: string; icon?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200
      ${selected ? "border-accent bg-accent-soft shadow-[0_0_0_3px_rgba(59,106,255,0.15)]" : "border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-0.5"}`}>
      {icon && <span className="text-xl">{icon}</span>}
      <span className={`text-[15px] ${selected ? "font-bold text-accent" : "font-medium text-navy"}`}>{label}</span>
      {selected && (
        <span className="ml-auto w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </span>
      )}
    </button>
  );
}

/* ── 랜딩 ── */
function LandingPage({ onStart }: { onStart: () => void }) {
  const stats = [
    { num: "90%", desc: "최대 채무 감면율" },
    { num: "36개월", desc: "변제 기간" },
    { num: "1분", desc: "예상 납입금 확인" },
  ];
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-5 py-8">
      <div className="max-w-[440px] w-full">
        <div className="slide-up mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            2026년 생계비 기준 실시간 반영
          </span>
        </div>
        <div className="slide-up" style={{ animationDelay: ".08s" }}>
          <h1 className="font-display text-4xl font-black leading-[1.25] tracking-tight text-navy mb-4">
            매달 갚는 돈,<br />
            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">얼마나 줄어들까?</span>
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-8">
            8개 질문에 답하면 끝.<br />
            2026년 기준으로 내 예상 월 변제금을 바로 알려드려요.
          </p>
        </div>
        <div className="slide-up grid grid-cols-3 gap-2.5 mb-8" style={{ animationDelay: ".16s" }}>
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
              <p className="font-display text-2xl font-extrabold text-accent tracking-tight">{s.num}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="slide-up mb-8" style={{ animationDelay: ".24s" }}>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-orange-50">
            <span className="text-sm">⚠️</span>
            <span className="text-[13px] text-orange-500 font-semibold">채무 2,000만 원 이상부터 이용 가능</span>
          </div>
        </div>
        <div className="slide-up" style={{ animationDelay: ".32s" }}>
          <button onClick={onStart}
            className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-navy to-navy-light text-white text-[17px] font-bold shadow-lg shadow-navy/25 hover:-translate-y-0.5 hover:shadow-xl transition-all">
            내 예상 변제금 확인하기 →
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">개인정보 입력 없이 바로 시작돼요</p>
        </div>
      </div>
    </div>
  );
}

/* ── 질문 ── */
function QuestionStep({ question, questionIndex, totalQuestions, answer, onSelect, onNext, onBack }: {
  question: typeof QUESTIONS[0]; questionIndex: number; totalQuestions: number;
  answer: any; onSelect: (v: any) => void; onNext: () => void; onBack: () => void;
}) {
  const lines = question.title.split("\n");
  const hasAnswer = answer !== null && answer !== undefined;
  return (
    <div className="min-h-dvh flex flex-col px-5 py-8">
      <div className="max-w-[440px] w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-sm text-gray-400 font-medium hover:text-gray-600">← 이전</button>
          <CircleProgress current={questionIndex + 1} total={totalQuestions} />
        </div>
        <div className="slide-up" key={question.id}>
          <span className="text-4xl block mb-3">{question.emoji}</span>
          <h2 className="font-display text-[28px] font-extrabold leading-[1.3] tracking-tight text-navy mb-2 whitespace-pre-line">
            {lines.map((line, i) => <span key={i}>{line}{i < lines.length - 1 && <br />}</span>)}
          </h2>
          <p className="text-sm text-gray-500 mb-7">{question.subtitle}</p>
        </div>
        <div className="slide-up flex flex-col gap-2.5" style={{ animationDelay: ".1s" }}>
          {question.options.map((opt) => (
            <OptionButton key={String(opt.value)} label={opt.label} icon={(opt as any).icon}
              selected={answer === opt.value} onClick={() => onSelect(opt.value)} />
          ))}
        </div>
        <div className="mt-8">
          <button onClick={onNext} disabled={!hasAnswer}
            className={`w-full py-[18px] px-8 rounded-xl text-base font-bold transition-all duration-300
              ${hasAnswer ? "bg-accent text-white shadow-lg shadow-accent/30 hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            {questionIndex < totalQuestions - 1 ? "다음 →" : "결과 확인을 위한 본인인증 →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 본인인증 ── */
function VerifyStep({ onNext, onBack, answers }: { onNext: () => void; onBack: () => void; answers: Record<string, any> }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const result = calcResult(answers);

  const fmtPhone = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
  };

  const sendCode = async () => {
    if (!agreed) { setError("개인정보 수집·이용에 동의해 주세요."); return; }
    const raw = phone.replace(/-/g, "");
    if (!/^01[016789]\d{7,8}$/.test(raw)) { setError("올바른 전화번호를 입력해 주세요."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.ok) {
        setVerificationId(data.id);
        setSent(true); setTimer(180);
        intervalRef.current = setInterval(() => {
          setTimer(t => { if (t <= 1) { clearInterval(intervalRef.current!); return 0; } return t - 1; });
        }, 1000);
      } else {
        setError(data.msg || "발송 실패");
      }
    } catch { setError("네트워크 오류"); }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: verificationId, code }),
      });
      const data = await res.json();
      if (data.ok) {
        setVerified(true); clearInterval(intervalRef.current!);
        // 설문+상담 데이터 저장
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verificationId, phone, answers, result }),
        });
        setTimeout(onNext, 800);
      } else {
        setError(data.msg || "인증 실패");
      }
    } catch { setError("네트워크 오류"); }
    setLoading(false);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-5 py-8">
      <div className="max-w-[440px] w-full">
        <button onClick={onBack} className="text-sm text-gray-400 font-medium mb-6 flex items-center gap-1">← 이전</button>
        {/* 블러 미리보기 */}
        <div className="slide-up bg-white rounded-2xl p-7 mb-7 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-md bg-gray-50/60 z-10 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center"><span className="text-xl">🔒</span></div>
            <p className="text-[15px] font-bold text-navy">인증 후 바로 확인 가능해요</p>
          </div>
          <div className="text-center blur-[10px] select-none pointer-events-none">
            <p className="text-xs text-gray-400 mb-1">예상 월 변제금</p>
            <p className="font-display text-5xl font-black text-accent">{result.mp.toLocaleString()}<span className="text-lg">만원</span></p>
          </div>
        </div>
        <div className="slide-up" style={{ animationDelay: ".1s" }}>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy mb-1.5">마지막 단계예요!</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">결과 확인과 상담 연결을 위해 전화번호만 인증해 주세요.</p>
        </div>
        <div className="slide-up bg-white rounded-2xl p-6 shadow-sm border border-gray-100" style={{ animationDelay: ".15s" }}>
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">휴대폰 번호</label>
            <input value={phone} onChange={e => { setPhone(fmtPhone(e.target.value)); setError(""); }} placeholder="010-0000-0000"
              className="w-full py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-lg text-base font-medium text-navy focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10" />
          </div>
          {!sent ? (
            <>
              <div className="flex items-start gap-2.5 mb-5 cursor-pointer" onClick={() => { setAgreed(!agreed); setError(""); }}>
                <div className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all
                  ${agreed ? "border-accent bg-accent" : "border-gray-200"}`}>
                  {agreed && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-[13px] text-gray-500 leading-relaxed">
                  [필수] 개인정보 수집·이용 동의<br />
                  <span className="text-[11px] text-gray-400">수집: 휴대폰번호 | 목적: 본인인증·상담 | 보유: 1년</span>
                </span>
              </div>
              <button onClick={sendCode} disabled={!phone || loading}
                className={`w-full py-4 rounded-xl text-[15px] font-bold transition-all
                  ${phone ? "bg-accent text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                {loading ? "발송 중..." : "인증번호 받기"}
              </button>
            </>
          ) : !verified ? (
            <>
              <div className="mb-4 relative">
                <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">인증번호</label>
                <input value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }} placeholder="6자리 숫자" maxLength={6}
                  className="w-full py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-lg text-base font-medium text-navy tracking-[8px] text-center focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10" />
                {timer > 0 && <span className={`absolute right-3.5 top-9 text-[13px] font-semibold ${timer < 30 ? "text-red-400" : "text-accent"}`}>{fmtTime(timer)}</span>}
              </div>
              {timer === 0 && <p className="text-[13px] text-red-400 mb-3">시간 만료. 다시 요청해주세요.</p>}
              <div className="flex gap-2.5">
                <button onClick={() => { setSent(false); setCode(""); setTimer(0); if (intervalRef.current) clearInterval(intervalRef.current); }}
                  className="flex-1 py-3.5 rounded-xl bg-blue-50 text-accent text-sm font-semibold">재전송</button>
                <button onClick={verifyCode} disabled={code.length !== 6 || timer === 0 || loading}
                  className={`flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all
                    ${code.length === 6 && timer > 0 ? "bg-accent text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  {loading ? "확인 중..." : "인증 확인"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-2.5">
                <span className="text-emerald-500 text-xl font-bold">✓</span>
              </div>
              <p className="text-[15px] font-bold text-emerald-500">인증 완료!</p>
            </div>
          )}
          {error && <p className="text-red-400 text-[13px] mt-3 text-center font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}

/* ── 결과 ── */
function ResultPage({ answers, onRestart }: { answers: Record<string, any>; onRestart: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1000); return () => clearTimeout(t); }, []);
  const r = calcResult(answers);

  if (!show) return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-[3px] border-gray-200 border-t-accent mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }} />
        <p className="text-gray-500 text-[15px] font-medium">분석 중이에요...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col items-center px-5 py-10">
      <div className="max-w-[440px] w-full">
        <div className="scale-in text-center mb-7">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-semibold">✅ 분석 완료</span>
          <h2 className="font-display text-[26px] font-extrabold tracking-tight text-navy mt-4">예상 월 변제금 결과</h2>
        </div>
        <div className="scale-in bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 text-center mb-5 shadow-xl shadow-navy/20" style={{ animationDelay: ".15s" }}>
          <p className="text-[13px] text-white/60 mb-2 font-medium">예상 월 변제금</p>
          <p className="font-display text-[54px] font-black tracking-tight text-white">{r.mp.toLocaleString()}<span className="text-xl font-semibold opacity-70">만원</span></p>
          <p className="text-sm text-white/50 mt-2">3년간 총 변제액 약 {r.total36.toLocaleString()}만원</p>
        </div>
        <div className="slide-up grid grid-cols-2 gap-2.5 mb-5" style={{ animationDelay: ".3s" }}>
          {[
            { label: "총 채무액", value: `${r.debt.toLocaleString()}만`, color: "text-navy" },
            { label: "예상 감면", value: `최대 ${r.reduction}%`, color: "text-emerald-500" },
            { label: "변제 기간", value: "36개월", color: "text-accent" },
            { label: "생계비 기준", value: `${r.living.toLocaleString()}만`, color: "text-orange-400" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[11px] text-gray-400 font-medium mb-1.5">{item.label}</p>
              <p className={`font-display text-xl font-extrabold tracking-tight ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="slide-up bg-blue-50 rounded-xl p-4.5 mb-6" style={{ animationDelay: ".4s" }}>
          <p className="text-[13px] text-accent font-semibold mb-1">💡 참고</p>
          <p className="text-[13px] text-gray-500 leading-relaxed">AI 시뮬레이션 결과이며 실제 변제금은 법원 인가에 따라 달라질 수 있습니다.</p>
        </div>
        <div className="slide-up" style={{ animationDelay: ".5s" }}>
          <button onClick={() => alert("상담 신청이 접수되었습니다. 곧 전문 컨설턴트가 연락드립니다.")}
            className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-accent to-purple-500 text-white text-[17px] font-bold shadow-lg shadow-accent/30 hover:-translate-y-0.5 transition-all">
            📞 무료 전문 상담 신청
          </button>
          <div className="text-center mt-3.5">
            <button onClick={onRestart} className="text-gray-400 text-[13px] underline">처음부터 다시</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 ── */
export default function Home() {
  const [phase, setPhase] = useState<"landing" | "questions" | "verify" | "result">("landing");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const goTo = (p: typeof phase) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPhase(p); };
  const handleSelect = (value: any) => setAnswers(prev => ({ ...prev, [QUESTIONS[qIndex].id]: value }));
  const handleNext = () => { if (qIndex < QUESTIONS.length - 1) setQIndex(qIndex + 1); else goTo("verify"); };
  const handleBack = () => { if (qIndex > 0) setQIndex(qIndex - 1); else goTo("landing"); };

  return (
    <main className="min-h-dvh">
      {phase === "landing" && <LandingPage onStart={() => { setQIndex(0); goTo("questions"); }} />}
      {phase === "questions" && (
        <QuestionStep key={QUESTIONS[qIndex].id} question={QUESTIONS[qIndex]}
          questionIndex={qIndex} totalQuestions={QUESTIONS.length}
          answer={answers[QUESTIONS[qIndex].id]} onSelect={handleSelect} onNext={handleNext} onBack={handleBack} />
      )}
      {phase === "verify" && <VerifyStep onNext={() => goTo("result")} onBack={() => { setQIndex(QUESTIONS.length - 1); goTo("questions"); }} answers={answers} />}
      {phase === "result" && <ResultPage answers={answers} onRestart={() => { setAnswers({}); setQIndex(0); goTo("landing"); }} />}
    </main>
  );
}
