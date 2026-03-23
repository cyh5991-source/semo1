// src/app/api/submit/route.ts  (v10-single-sheet)
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ── 옵션 value → label 매핑 ── */

const LABELS: Record<string, Record<string, string>> = {
  debt_range: { "2500": "2,000~3,000만", "4000": "3,000~5,000만", "7500": "5,000만~1억", "15000": "1억~2억", "25000": "2억 이상" },
  debt_type: { card: "카드값·현금서비스", bank: "은행 대출", capital: "캐피탈·저축은행", private: "사채·개인빚", mixed: "여러 가지 섞여있음" },
  housing: { yes: "네, 있어요", no: "아니요, 없어요" },
  job_type: { regular: "직장인(정규직)", contract: "직장인(계약·파견)", self: "자영업·사업자", part: "아르바이트·일용직", freelance: "프리랜서", unemployed: "현재 무직" },
  income_range: { "150": "185만 원 이하", "215": "185~250만 원", "300": "250~350만 원", "420": "350~500만 원", "550": "500만 원 이상" },
  family: { "1": "나 혼자", "2": "2명", "3": "3명", "4": "4명", "5": "5명 이상" },
  overdue: { "0": "아직 연체 전", "2": "1~3개월", "5": "3~6개월", "9": "6개월~1년", "15": "1년 넘었어요" },
  lawsuit: { yes: "네, 받고 있어요", no: "아직은 없어요" },
};

function toLabel(field: string, value: any): string {
  return LABELS[field]?.[String(value)] || String(value || "");
}

/* ── Google Sheets 헬퍼 ── */

function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(email: string, key: string) {
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const now = Math.floor(Date.now() / 1000);
  const claim = base64url(
    Buffer.from(
      JSON.stringify({
        iss: email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      })
    )
  );
  const signature = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claim}`), {
    key,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });
  const jwt = `${header}.${claim}.${base64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  return data.access_token as string;
}

async function appendRow(token: string, spreadsheetId: string, sheet: string, values: string[]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheet)}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

/* ── 메인 핸들러 ── */

export async function POST(req: Request) {
  try {
    console.log("[v10-submit] === ROUTE HIT ===", new Date().toISOString());

    const GS_CLIENT_EMAIL = process.env.GS_CLIENT_EMAIL;
    const GS_PRIVATE_KEY = process.env.GS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const GS_SPREADSHEET_ID = process.env.GS_SPREADSHEET_ID;

    console.log("[v10-submit] 환경변수 확인:", {
      hasEmail: !!GS_CLIENT_EMAIL,
      hasKey: !!GS_PRIVATE_KEY,
      hasSheet: !!GS_SPREADSHEET_ID,
      emailPrefix: GS_CLIENT_EMAIL?.substring(0, 15),
    });

    if (!GS_CLIENT_EMAIL || !GS_PRIVATE_KEY || !GS_SPREADSHEET_ID) {
      console.error("[v10-submit] 환경변수 누락!");
      return NextResponse.json({ ok: false, msg: "환경변수 누락" }, { status: 500 });
    }

    const token = await getAccessToken(GS_CLIENT_EMAIL, GS_PRIVATE_KEY);
    console.log("[v10-submit] 토큰 발급:", !!token);

    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();
    const now = new Date().toISOString();

    console.log("[v10-submit 시작]", phone, surveyId);

    // 한 시트에 전체 데이터 행 추가 (옵션 텍스트로 변환)
    const saveResult = await appendRow(token, GS_SPREADSHEET_ID, "시트1", [
      phone,
      toLabel("debt_range", answers.debt_range),
      toLabel("debt_type", answers.debt_type),
      toLabel("housing", answers.housing),
      toLabel("job_type", answers.job_type),
      toLabel("income_range", answers.income_range),
      toLabel("family", answers.family),
      toLabel("overdue", answers.overdue),
      toLabel("lawsuit", answers.lawsuit),
      String(result.mp || 0),
      String(result.reduction || 0),
      "대기중",
      "",
      now,
    ]);
    console.log("[저장 결과]", saveResult.status, JSON.stringify(saveResult.data));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
