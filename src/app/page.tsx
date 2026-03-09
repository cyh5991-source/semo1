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
  text: "#1B2559",
  textMid: "#5A6387",
  textLight: "#9BA3BF",
  border: "#E8EBF3",
};

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

/* ── 랜딩 ── */
function LandingPage({ onStart }: { onStart: () => void }) {
  const stats = [
    { num: "90%", desc: "최대 채무 감면율" },
    { num: "36개월", desc: "변제 기간" },
    { num: "1분", desc: "예상 납입금 확인" },
  ];
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div className="slide-up" style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 24, background: P.greenSoft, color: P.green, fontSize: 13, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.green, animation: "pulse 2s infinite" }} />
            2026년 생계비 기준 실시간 반영
          </span>
        </div>
        <div className="slide-up" style={{ animationDelay: ".08s" }}>
          <h1 style={{ fontFamily: "'Outfit','Noto Sans KR',sans-serif", fontSize: 36, fontWeight: 900, lineHeight: 1.25, letterSpacing: -1.5, color: P.navy, marginBottom: 16, marginTop: 0 }}>
            매달 갚는 돈,<br />
            <span style={{ background: `linear-gradient(135deg, ${P.accent}, #7C5CFC)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>얼마나 줄어들까?</span>
          </h1>
          <p style={{ fontSize: 16, color: P.textMid, lineHeight: 1.7, marginBottom: 32 }}>
            8개 질문에 답하면 끝.<br />
            2026년 기준으로 내 예상 월 변제금을 바로 알려드려요.
          </p>
        </div>
        <div className="slide-up" style={{ animationDelay: ".16s", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: P.surface, borderRadius: 14, padding: "20px 12px", textAlign: "center", boxShadow: "0 2px 24px rgba(27,37,89,0.06)", border: `1px solid ${P.border}` }}>
              <p style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 800, color: P.accent, letterSpacing: -1, margin: 0 }}>{s.num}</p>
              <p style={{ fontSize: 11, color: P.textLight, fontWeight: 500, marginTop: 4, marginBottom: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="slide-up" style={{ animationDelay: ".24s", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: P.orangeSoft }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ fontSize: 13, color: P.orange, fontWeight: 600 }}>채무 2,000만 원 이상부터 이용 가능</span>
          </div>
        </div>
        <div className="slide-up" style={{ animationDelay: ".32s" }}>
          <button onClick={onStart}
            style={{ width: "100%", padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight})`, color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: -0.3, boxShadow: "0 4px 24px rgba(27,37,89,0.25)", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(27,37,89,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(27,37,89,0.25)"; }}
          >내 예상 변제금 확인하기 →</button>
          <p style={{ fontSize: 12, color: P.textLight, textAlign: "center", marginTop: 12 }}>개인정보 입력 없이 바로 시작돼요</p>
        </div>
      </div>
    </div>
  );
}

/* ── 질문 단계 ── */
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

/* ── 본인인증 ── */
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
          <p style={{ fontSize: 14, color: P.textMid, marginBottom: 24, lineHeight: 1.6 }}>결과 확인과 상담 연결을 위해 전화번호만 인증해 주세요.</p>
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
      </div>
    </div>
  );
}

/* ── 결과 ── */
function ResultPage({ answers, onRestart }: any) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1000); return () => clearTimeout(t); }, []);
  const r = calcResult(answers);

  if (!show) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${P.border}`, borderTopColor: P.accent, margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
        <p style={{ color: P.textMid, fontSize: 15, fontWeight: 500 }}>분석 중이에요...</p>
      </div>
    </div>
  );

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

        <div className="scale-in" style={{ animationDelay: ".15s", background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight})`, borderRadius: 24, padding: "36px 28px", textAlign: "center", marginBottom: 20, boxShadow: "0 12px 40px rgba(27,37,89,0.2)" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500 }}>예상 월 변제금</p>
          <p style={{ fontFamily: "'Outfit'", fontSize: 54, fontWeight: 900, letterSpacing: -2, color: "#fff", margin: 0, animation: "scaleIn .5s cubic-bezier(.16,1,.3,1) .3s both" }}>
            {r.mp.toLocaleString()}<span style={{ fontSize: 20, fontWeight: 600, opacity: 0.7 }}>만원</span>
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>3년간 총 변제액 약 {r.total36.toLocaleString()}만원</p>
        </div>

        <div className="slide-up" style={{ animationDelay: ".3s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {cards.map((item, i) => (
            <div key={i} style={{ background: P.surface, borderRadius: 14, padding: "18px 16px", border: `1px solid ${P.border}`, boxShadow: "0 2px 24px rgba(27,37,89,0.06)" }}>
              <p style={{ fontSize: 11, color: P.textLight, fontWeight: 500, marginBottom: 6, marginTop: 0 }}>{item.label}</p>
              <p style={{ fontFamily: "'Outfit','Noto Sans KR'", fontSize: 20, fontWeight: 800, color: item.color, letterSpacing: -0.5, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="slide-up" style={{ animationDelay: ".4s", background: P.accentSoft, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: P.accent, fontWeight: 600, marginBottom: 4, marginTop: 0 }}>💡 참고</p>
          <p style={{ fontSize: 13, color: P.textMid, lineHeight: 1.6, margin: 0 }}>AI 시뮬레이션 결과이며 실제 변제금은 법원 인가에 따라 달라질 수 있습니다.</p>
        </div>

        <div className="slide-up" style={{ animationDelay: ".5s" }}>
          <button onClick={() => alert("상담 신청이 접수되었습니다. 곧 전문 컨설턴트가 연락드립니다.")}
            style={{ width: "100%", padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${P.accent}, #7C5CFC)`, color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: -0.3, boxShadow: "0 4px 24px rgba(59,106,255,0.3)" }}>
            📞 무료 전문 상담 신청
          </button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={onRestart} style={{ background: "none", border: "none", color: P.textLight, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>처음부터 다시</button>
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
