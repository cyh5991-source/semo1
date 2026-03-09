"use client";

import { useState, useEffect, useRef } from "react";

/* ── 컬러 팔레트 ── */
const P = {
  bg: "#F6F7FB",
  surface: "#FFFFFF",
  navy: "#1B2559",
  navyLight: "#2D3A6E",
  accent: "#3B6AFF",
  accentSoft: "rgba(59,106,255,0.08)",
  accentMid: "rgba(59,106,255,0.15)",
  green: "#0DBF73",
  greenSoft: "rgba(13,191,115,0.1)",
  red: "#FF4757",
  orange: "#FF8C42",
  orangeSoft: "rgba(255,140,66,0.1)",
  yellow: "#FFC107",
  yellowSoft: "rgba(255,193,7,0.12)",
  text: "#1B2559",
  textMid: "#5A6387",
  textLight: "#9BA3BF",
  border: "#E8EBF3",
  kakao: "#FEE500",
};

const LAWYER_IMG = "data:image/jpeg;base64,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";

const LAWYER_IMG2 = "data:image/jpeg;base64,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";

const KAKAO_LINK = "https://open.kakao.com/o/gKoe0xki";

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
      { label: "185만 원 이하", value: 150 },
      { label: "185~250만 원", value: 215 },
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
/* 2026년 기준 생계비 (만원) */
const LIVING_COST: Record<number, number> = {
  1: 154, 2: 251, 3: 322, 4: 389, 5: 453, 6: 513,
};

function calcResult(a: Record<string, any>) {
  const debt = Number(a.debt_range) || 5000;
  const income = Number(a.income_range) || 250;
  const family = Number(a.family) || 1;
  const living = LIVING_COST[Math.min(family, 6)] || LIVING_COST[6];
  const mp = income < 185 ? 0 : Math.max(Math.round(income - living), 0);
  const total36 = mp * 36;
  const reduction = debt > 0 ? Math.max(Math.min(Math.round((1 - total36 / debt) * 100), 90), 0) : 0;
  return { debt, income, family, living, mp, total36, reduction };
}

/* ── 원형 진행바 ── */
function CircleProgress({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="48" height="48" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke={P.border} strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={P.accent} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.16,1,.3,1)", transform: "rotate(-90deg)", transformOrigin: "center" }} />
        <text x="48" y="53" textAnchor="middle" fill={P.navy} fontSize="22" fontWeight="800" fontFamily="Outfit">{current}</text>
      </svg>
      <div>
        <p style={{ fontSize: 12, color: P.textLight, fontWeight: 500, margin: 0 }}>{total}개 중 {current}번째</p>
        <p style={{ fontSize: 14, color: P.navy, fontWeight: 700, margin: 0 }}>거의 다 왔어요!</p>
      </div>
    </div>
  );
}

/* ── 선택 버튼 ── */
function OptionButton({ label, icon, selected, onClick }: { label: string; icon?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
        background: selected ? P.accentSoft : P.surface,
        border: `2px solid ${selected ? P.accent : P.border}`, borderRadius: 14,
        cursor: "pointer", transition: "all .2s",
        boxShadow: selected ? `0 0 0 3px ${P.accentMid}` : "none",
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = P.textLight; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
      <span style={{ fontSize: 15, fontWeight: selected ? 700 : 500, color: selected ? P.accent : P.text, letterSpacing: -0.3 }}>{label}</span>
      {selected && (
        <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: P.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>
        </span>
      )}
    </button>
  );
}

/* ── 카카오 오픈채팅 배너 ── */
function KakaoBanner() {
  return (
    <a href={KAKAO_LINK} target="_blank" rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
        background: P.kakao, borderRadius: 14, textDecoration: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "all .2s", cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; }}
    >
      <span style={{ fontSize: 28 }}>💬</span>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#3B1E1E", margin: 0 }}>카카오톡으로 바로 상담하기</p>
        <p style={{ fontSize: 12, color: "#5B4636", margin: "2px 0 0", fontWeight: 500 }}>인증 없이 편하게 물어보세요</p>
      </div>
      <span style={{ marginLeft: "auto", fontSize: 18, color: "#3B1E1E" }}>→</span>
    </a>
  );
}

/* ── 사무소 정보 푸터 ── */
function OfficeInfo() {
  return (
    <div style={{ marginTop: 40, padding: "24px 0", borderTop: `1px solid ${P.border}`, textAlign: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: P.navy, margin: "0 0 8px" }}>더엘 법률사무소</p>
      <p style={{ fontSize: 12, color: P.textLight, lineHeight: 1.8, margin: 0 }}>
        대표 변호사 이우형<br />
        사업자등록번호 822-10-01825<br />
        서울시 서초구 서초대로60길 27, 4층(서초동, 경복빌딩)
      </p>
    </div>
  );
}

/* ════════════════════════════════════
   랜딩
   ════════════════════════════════════ */
function LandingPage({ onStart }: { onStart: () => void }) {
  const stats = [
    { num: "90%", desc: "최대 채무 감면율" },
    { num: "36개월", desc: "변제 기간" },
    { num: "1분", desc: "예상 납입금 확인" },
  ];
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>

        {/* 변호사 소개 카드 */}
        <div className="slide-up" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, background: P.surface, borderRadius: 24, padding: "28px 24px", boxShadow: "0 4px 32px rgba(27,37,89,0.08)", border: `1px solid ${P.border}` }}>
          <img src={LAWYER_IMG} alt="이우형 변호사" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `4px solid ${P.accent}`, boxShadow: "0 4px 16px rgba(59,106,255,0.15)" }} />
          <div>
            <p style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 22, fontWeight: 800, color: P.navy, margin: 0, letterSpacing: -0.5 }}>이우형 변호사</p>
            <p style={{ fontSize: 15, color: P.textMid, margin: "6px 0 10px", fontWeight: 500 }}>더엘 법률사무소 · 서초동</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 20, background: P.accentSoft, color: P.accent, fontSize: 13, fontWeight: 700 }}>⚡ 개인회생 6,000건 이상</span>
          </div>
        </div>

        {/* 홍보 문구 */}
        <div className="slide-up" style={{ animationDelay: ".05s", marginBottom: 24, textAlign: "center", padding: "16px 20px", background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight})`, borderRadius: 14 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.6 }}>
            포기하지 마세요.<br />6,000명이 이우형 변호사와 다시 시작했습니다
          </p>
        </div>

        {/* 생계비 반영 뱃지 */}
        <div className="slide-up" style={{ marginBottom: 28, animationDelay: ".1s" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 24, background: P.greenSoft, color: P.green, fontSize: 13, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.green, animation: "pulse 2s infinite" }} />
            2026년 생계비 기준 실시간 반영
          </span>
        </div>

        {/* 메인 카피 */}
        <div className="slide-up" style={{ animationDelay: ".15s" }}>
          <h1 style={{ fontFamily: "'Outfit','Noto Sans KR',sans-serif", fontSize: 36, fontWeight: 900, lineHeight: 1.25, letterSpacing: -1.5, color: P.navy, marginBottom: 16, marginTop: 0 }}>
            매달 갚는 돈,<br />
            <span style={{ background: `linear-gradient(135deg, ${P.accent}, #7C5CFC)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>얼마나 줄어들까?</span>
          </h1>
          <p style={{ fontSize: 16, color: P.textMid, lineHeight: 1.7, marginBottom: 32 }}>
            8개 질문에 답하면 끝.<br />
            2026년 기준으로 내 예상 월 변제금을 바로 알려드려요.
          </p>
        </div>

        {/* 수치 카드 */}
        <div className="slide-up" style={{ animationDelay: ".2s", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: P.surface, borderRadius: 14, padding: "20px 12px", textAlign: "center", boxShadow: "0 2px 24px rgba(27,37,89,0.06)", border: `1px solid ${P.border}` }}>
              <p style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 800, color: P.accent, letterSpacing: -1, margin: 0 }}>{s.num}</p>
              <p style={{ fontSize: 11, color: P.textLight, fontWeight: 500, marginTop: 4, marginBottom: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 주의사항 */}
        <div className="slide-up" style={{ animationDelay: ".25s", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: P.orangeSoft }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ fontSize: 13, color: P.orange, fontWeight: 600 }}>채무 2,000만 원 이상부터 이용 가능</span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="slide-up" style={{ animationDelay: ".3s", marginBottom: 16 }}>
          <button onClick={onStart}
            style={{ width: "100%", padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight})`, color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: -0.3, boxShadow: "0 4px 24px rgba(27,37,89,0.25)", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(27,37,89,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(27,37,89,0.25)"; }}
          >내 예상 변제금 확인하기 →</button>
          <p style={{ fontSize: 12, color: P.textLight, textAlign: "center", marginTop: 12 }}>개인정보 입력 없이 바로 시작돼요</p>
        </div>

        {/* 사무소 정보 */}
        <OfficeInfo />
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   질문 단계
   ════════════════════════════════════ */
function QuestionStep({ question, questionIndex, totalQuestions, answer, onSelect, onNext, onBack }: any) {
  const lines = question.title.split("\n");
  const hasAnswer = answer !== null && answer !== undefined;
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", padding: "32px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: P.textLight, fontWeight: 500 }}>← 이전</button>
          <CircleProgress current={questionIndex + 1} total={totalQuestions} />
        </div>
        <div className="slide-up" key={question.id}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{question.emoji}</span>
          <h2 style={{ fontFamily: "'Outfit','Noto Sans KR',sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.3, letterSpacing: -1, color: P.navy, marginBottom: 8, whiteSpace: "pre-line", marginTop: 0 }}>
            {lines.map((line: string, i: number) => <span key={i}>{line}{i < lines.length - 1 && <br />}</span>)}
          </h2>
          <p style={{ fontSize: 14, color: P.textMid, marginBottom: 28 }}>{question.subtitle}</p>
        </div>
        <div className="slide-up" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((opt: any) => (
            <OptionButton key={String(opt.value)} label={opt.label} icon={opt.icon}
              selected={answer === opt.value} onClick={() => onSelect(opt.value)} />
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <button onClick={onNext} disabled={!hasAnswer}
            style={{
              width: "100%", padding: "18px 32px", borderRadius: 14, fontSize: 16, fontWeight: 700,
              border: "none", cursor: hasAnswer ? "pointer" : "not-allowed", transition: "all .3s", letterSpacing: -0.3,
              background: hasAnswer ? P.accent : P.border, color: hasAnswer ? "#fff" : P.textLight,
              boxShadow: hasAnswer ? "0 4px 20px rgba(59,106,255,0.3)" : "none",
            }}>
            {questionIndex < totalQuestions - 1 ? "다음 →" : "결과 확인을 위한 본인인증 →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   본인인증
   ════════════════════════════════════ */
function VerifyStep({ onNext, onBack, answers }: any) {
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
      const res = await fetch("/api/sms/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      if (data.ok) {
        setVerificationId(data.id); setSent(true); setTimer(180);
        intervalRef.current = setInterval(() => { setTimer(t => { if (t <= 1) { clearInterval(intervalRef.current!); return 0; } return t - 1; }); }, 1000);
      } else { setError(data.msg || "발송 실패"); }
    } catch { setError("네트워크 오류"); }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sms/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: verificationId, code }) });
      const data = await res.json();
      if (data.ok) {
        setVerified(true); clearInterval(intervalRef.current!);
        await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verificationId, phone, answers, result }) });
        setTimeout(onNext, 800);
      } else { setError(data.msg || "인증 실패"); }
    } catch { setError("네트워크 오류"); }
    setLoading(false);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);
  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", background: P.bg, border: `1.5px solid ${P.border}`, borderRadius: 10, color: P.text, fontSize: 16, fontWeight: 500, fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: P.textLight, fontWeight: 500, marginBottom: 24, display: "flex", alignItems: "center", gap: 4 }}>← 이전</button>

        {/* 블러 미리보기 */}
        <div className="slide-up" style={{ background: P.surface, borderRadius: 20, padding: 28, marginBottom: 28, border: `1px solid ${P.border}`, position: "relative", overflow: "hidden", boxShadow: "0 2px 24px rgba(27,37,89,0.06)" }}>
          <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(8px)", background: "rgba(246,247,251,0.6)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: P.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22 }}>🔒</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: P.navy, margin: 0 }}>인증 후 바로 확인 가능해요</p>
          </div>
          <div style={{ textAlign: "center", filter: "blur(10px)", userSelect: "none", pointerEvents: "none" }}>
            <p style={{ fontSize: 12, color: P.textLight, marginBottom: 4 }}>예상 월 변제금</p>
            <p style={{ fontFamily: "'Outfit'", fontSize: 44, fontWeight: 900, color: P.accent, margin: 0 }}>{result.mp.toLocaleString()}<span style={{ fontSize: 18 }}>만원</span></p>
          </div>
        </div>

        <div className="slide-up" style={{ animationDelay: ".1s" }}>
          <h2 style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 24, fontWeight: 800, letterSpacing: -1, color: P.navy, marginBottom: 6, marginTop: 0 }}>마지막 단계예요!</h2>
          <p style={{ fontSize: 17, color: P.text, marginBottom: 24, lineHeight: 1.7, fontWeight: 600 }}>인증 후 예상 변제금 확인 + 전문 변호사가 속시원하게 상담 연락드립니다.</p>
        </div>

        <div className="slide-up" style={{ animationDelay: ".15s", background: P.surface, borderRadius: 16, padding: 24, boxShadow: "0 2px 24px rgba(27,37,89,0.06)", border: `1px solid ${P.border}` }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: P.textMid, marginBottom: 6 }}>휴대폰 번호</label>
            <input value={phone} onChange={e => { setPhone(fmtPhone(e.target.value)); setError(""); }} placeholder="010-0000-0000" style={inputStyle} />
          </div>

          {!sent ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }} onClick={() => { setAgreed(!agreed); setError(""); }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1, border: `2px solid ${agreed ? P.accent : P.border}`, background: agreed ? P.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                  {agreed && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: P.textMid, lineHeight: 1.5 }}>
                  [필수] 개인정보 수집·이용 동의<br />
                  <span style={{ fontSize: 11, color: P.textLight }}>수집: 휴대폰번호 | 목적: 본인인증·상담 | 보유: 1년</span>
                </span>
              </div>
              <button onClick={sendCode} disabled={!phone || loading}
                style={{ width: "100%", padding: 16, borderRadius: 12, background: phone ? P.accent : P.border, color: phone ? "#fff" : P.textLight, fontSize: 15, fontWeight: 700, border: "none", cursor: phone ? "pointer" : "not-allowed" }}>
                {loading ? "발송 중..." : "인증번호 받기"}
              </button>
            </>
          ) : !verified ? (
            <>
              <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: P.textMid, marginBottom: 6 }}>인증번호</label>
                <input value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }} placeholder="6자리 숫자" maxLength={6}
                  style={{ ...inputStyle, letterSpacing: 8, textAlign: "center" as const }} />
                {timer > 0 && <span style={{ position: "absolute", right: 14, top: 36, fontSize: 13, fontWeight: 600, color: timer < 30 ? P.red : P.accent }}>{fmtTime(timer)}</span>}
              </div>
              {timer === 0 && <p style={{ fontSize: 13, color: P.red, marginBottom: 12 }}>시간 만료. 다시 요청해주세요.</p>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setSent(false); setCode(""); setTimer(0); if (intervalRef.current) clearInterval(intervalRef.current); }}
                  style={{ flex: 1, padding: 14, borderRadius: 12, background: P.accentSoft, color: P.accent, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>재전송</button>
                <button onClick={verifyCode} disabled={code.length !== 6 || timer === 0 || loading}
                  style={{ flex: 2, padding: 14, borderRadius: 12, background: code.length === 6 && timer > 0 ? P.accent : P.border, color: code.length === 6 && timer > 0 ? "#fff" : P.textLight, fontSize: 14, fontWeight: 700, border: "none", cursor: code.length === 6 && timer > 0 ? "pointer" : "not-allowed" }}>
                  {loading ? "확인 중..." : "인증 확인"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: P.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <span style={{ color: P.green, fontSize: 24, fontWeight: 700 }}>✓</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.green, margin: 0 }}>인증 완료!</p>
            </div>
          )}
          {error && <p style={{ color: P.red, fontSize: 13, marginTop: 12, textAlign: "center", fontWeight: 500 }}>{error}</p>}
        </div>

        {/* 카카오톡 배너 - 인증 폼 아래 */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: P.kakao, borderRadius: 14, cursor: "pointer" }}
          onClick={() => window.open(KAKAO_LINK, "_blank")}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#3B1E1E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>💬</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#3B1E1E", margin: 0 }}>인증이 부담스러우신가요?</p>
            <p style={{ fontSize: 12, color: "#5B4636", margin: "2px 0 0", fontWeight: 500 }}>카카오톡으로 편하게 상담하세요</p>
          </div>
          <span style={{ fontSize: 16, color: "#3B1E1E", fontWeight: 700 }}>→</span>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════
   결과
   ════════════════════════════════════ */
function ResultPage({ answers, onRestart }: any) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1000); return () => clearTimeout(t); }, []);
  const r = calcResult(answers);

  if (!show) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${P.border}`, borderTopColor: P.accent, margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
        <p style={{ color: P.textMid, fontSize: 15, fontWeight: 500 }}>이우형 변호사가 분석 중이에요...</p>
      </div>
    </div>
  );

  /* 가용소득 없는 경우 → 다른 제도 안내 */
  if (r.mp === 0) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 24, background: P.orangeSoft, color: P.orange, fontSize: 13, fontWeight: 600 }}>📋 분석 완료</span>
            <h2 style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 24, fontWeight: 800, letterSpacing: -1, color: P.navy, marginTop: 16 }}>다른 채무조정 제도를 검토해야 합니다</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src={LAWYER_IMG2} alt="이우형 변호사" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `4px solid ${P.accent}`, boxShadow: "0 4px 20px rgba(59,106,255,0.2)" }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: P.navy, margin: 0 }}>이우형 변호사의 분석 결과</p>
          </div>

          <div style={{ background: P.surface, borderRadius: 20, padding: 28, marginBottom: 20, border: `1px solid ${P.border}`, boxShadow: "0 2px 24px rgba(27,37,89,0.06)" }}>
            <p style={{ fontSize: 15, color: P.text, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
              현재 월 소득(<strong>{r.income.toLocaleString()}만원</strong>)이 생계비(<strong>{r.living.toLocaleString()}만원</strong>) 이하로,
              개인회생 변제금을 납부할 <strong>가용소득이 부족</strong>합니다.
            </p>
            <p style={{ fontSize: 15, color: P.text, lineHeight: 1.8, marginTop: 16, marginBottom: 0, fontWeight: 500 }}>
              이 경우 아래 제도를 검토해볼 수 있습니다:
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <div style={{ background: P.surface, borderRadius: 14, padding: "18px 20px", border: `1px solid ${P.border}` }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.accent, margin: "0 0 6px" }}>🔄 신용회복위원회 채무조정</p>
              <p style={{ fontSize: 13, color: P.textMid, margin: 0, lineHeight: 1.6 }}>이자 감면, 상환기간 연장 등을 통해 부담을 줄일 수 있습니다.</p>
            </div>
            <div style={{ background: P.surface, borderRadius: 14, padding: "18px 20px", border: `1px solid ${P.border}` }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.green, margin: "0 0 6px" }}>🌱 새출발기금</p>
              <p style={{ fontSize: 13, color: P.textMid, margin: 0, lineHeight: 1.6 }}>소득·재산 기준 충족 시 채무 최대 90% 감면이 가능합니다.</p>
            </div>
            <div style={{ background: P.surface, borderRadius: 14, padding: "18px 20px", border: `1px solid ${P.border}` }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: P.orange, margin: "0 0 6px" }}>⚖️ 개인파산·면책</p>
              <p style={{ fontSize: 13, color: P.textMid, margin: 0, lineHeight: 1.6 }}>변제 능력이 없는 경우 법원을 통해 채무 전액 면책을 받을 수 있습니다.</p>
            </div>
          </div>

          <div style={{ background: P.accentSoft, borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: P.accent, fontWeight: 700, margin: "0 0 6px" }}>💡 정확한 판단은 전문 변호사 상담이 필요합니다</p>
            <p style={{ fontSize: 13, color: P.textMid, lineHeight: 1.6, margin: 0 }}>개인 상황에 따라 개인회생이 가능할 수도 있고, 다른 제도가 더 유리할 수도 있습니다. 이우형 변호사가 최적의 방법을 안내해드립니다.</p>
          </div>

          <button onClick={() => alert("상담 신청이 접수되었습니다. 이우형 변호사팀에서 곧 연락드립니다.")}
            style={{ width: "100%", padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${P.accent}, #7C5CFC)`, color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(59,106,255,0.3)", marginBottom: 16 }}>
            📞 이우형 변호사 무료 상담 신청
          </button>

          <KakaoBanner />

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={onRestart} style={{ background: "none", border: "none", color: P.textLight, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>처음부터 다시</button>
          </div>

          <OfficeInfo />
        </div>
      </div>
    );
  }

  const cards = [
    { label: "총 채무액", value: `${r.debt.toLocaleString()}만`, color: P.navy },
    { label: "예상 감면", value: `최대 ${r.reduction}%`, color: P.green },
    { label: "변제 기간", value: "36개월", color: P.accent },
    { label: "생계비 기준", value: `${r.living.toLocaleString()}만`, color: P.orange },
  ];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div className="scale-in" style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 24, background: P.greenSoft, color: P.green, fontSize: 13, fontWeight: 600 }}>✅ 분석 완료</span>
          <h2 style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 26, fontWeight: 800, letterSpacing: -1, color: P.navy, marginTop: 16 }}>예상 월 변제금 결과</h2>
        </div>

        {/* 변호사 사진 */}
        <div className="scale-in" style={{ animationDelay: ".1s", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <img src={LAWYER_IMG2} alt="이우형 변호사" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `4px solid ${P.accent}`, boxShadow: "0 4px 20px rgba(59,106,255,0.2)" }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: P.navy, margin: 0 }}>이우형 변호사의 분석 결과</p>
        </div>

        {/* 메인 결과 카드 */}
        <div className="scale-in" style={{ animationDelay: ".2s", background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight})`, borderRadius: 24, padding: "36px 28px", textAlign: "center", marginBottom: 20, boxShadow: "0 12px 40px rgba(27,37,89,0.2)" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500 }}>예상 월 변제금</p>
          <p style={{ fontFamily: "'Outfit'", fontSize: 54, fontWeight: 900, letterSpacing: -2, color: "#fff", margin: 0, animation: "scaleIn .5s cubic-bezier(.16,1,.3,1) .3s both" }}>
            {r.mp.toLocaleString()}<span style={{ fontSize: 20, fontWeight: 600, opacity: 0.7 }}>만원</span>
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>3년간 총 변제액 약 {r.total36.toLocaleString()}만원</p>
        </div>

        {/* 상세 카드 */}
        <div className="slide-up" style={{ animationDelay: ".3s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {cards.map((item, i) => (
            <div key={i} style={{ background: P.surface, borderRadius: 14, padding: "18px 16px", border: `1px solid ${P.border}`, boxShadow: "0 2px 24px rgba(27,37,89,0.06)" }}>
              <p style={{ fontSize: 11, color: P.textLight, fontWeight: 500, marginBottom: 6, marginTop: 0 }}>{item.label}</p>
              <p style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 20, fontWeight: 800, color: item.color, letterSpacing: -0.5, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* 참고 */}
        <div className="slide-up" style={{ animationDelay: ".4s", background: P.accentSoft, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: P.accent, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>💡 참고</p>
          <p style={{ fontSize: 13, color: P.textMid, lineHeight: 1.6, margin: 0 }}>AI 시뮬레이션 결과이며 실제 변제금은 법원 인가에 따라 달라질 수 있습니다. 정확한 산정을 위해 전문 변호사 상담을 권장합니다.</p>
        </div>

        {/* CTA 버튼 */}
        <div className="slide-up" style={{ animationDelay: ".5s", marginBottom: 16 }}>
          <button onClick={() => alert("상담 신청이 접수되었습니다. 이우형 변호사팀에서 곧 연락드립니다.")}
            style={{ width: "100%", padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${P.accent}, #7C5CFC)`, color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: -0.3, boxShadow: "0 4px 24px rgba(59,106,255,0.3)" }}>
            📞 이우형 변호사 무료 상담 신청
          </button>
        </div>

        {/* 카카오 배너 */}
        <div className="slide-up" style={{ animationDelay: ".55s", marginBottom: 16 }}>
          <KakaoBanner />
        </div>

        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button onClick={onRestart} style={{ background: "none", border: "none", color: P.textLight, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>처음부터 다시</button>
        </div>

        {/* 사무소 정보 */}
        <OfficeInfo />


      </div>
    </div>
  );
}

/* ════════════════════════════════════
   메인
   ════════════════════════════════════ */
export default function Home() {
  const [phase, setPhase] = useState<"landing" | "questions" | "verify" | "result">("landing");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const goTo = (p: typeof phase) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPhase(p); };
  const handleSelect = (value: any) => setAnswers(prev => ({ ...prev, [QUESTIONS[qIndex].id]: value }));
  const handleNext = () => { if (qIndex < QUESTIONS.length - 1) setQIndex(qIndex + 1); else goTo("verify"); };
  const handleBack = () => { if (qIndex > 0) setQIndex(qIndex - 1); else goTo("landing"); };

  return (
    <main style={{ minHeight: "100dvh", background: P.bg, fontFamily: "'Noto Sans KR', sans-serif" }}>
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
