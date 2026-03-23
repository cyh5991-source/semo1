// src/app/api/submit/route.ts  (v9-google-sheets)
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    padding: crypto.constants.RSA_PKCS1_v1_5,
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
    console.log("[v9-submit] === ROUTE HIT ===", new Date().toISOString());

    const GS_CLIENT_EMAIL = process.env.GS_CLIENT_EMAIL;
    const GS_PRIVATE_KEY = process.env.GS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const GS_SPREADSHEET_ID = process.env.GS_SPREADSHEET_ID;

    console.log("[v9-submit] 환경변수 확인:", {
      hasEmail: !!GS_CLIENT_EMAIL,
      hasKey: !!GS_PRIVATE_KEY,
      hasSheet: !!GS_SPREADSHEET_ID,
      emailPrefix: GS_CLIENT_EMAIL?.substring(0, 15),
    });

    if (!GS_CLIENT_EMAIL || !GS_PRIVATE_KEY || !GS_SPREADSHEET_ID) {
      console.error("[v9-submit] 환경변수 누락!");
      return NextResponse.json({ ok: false, msg: "환경변수 누락" }, { status: 500 });
    }

    const token = await getAccessToken(GS_CLIENT_EMAIL, GS_PRIVATE_KEY);
    console.log("[v9-submit] 토큰 발급:", !!token);

    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();
    const now = new Date().toISOString();

    console.log("[v9-submit 시작]", phone, surveyId);

    // 설문 시트에 행 추가
    const surveyResult = await appendRow(token, GS_SPREADSHEET_ID, "설문", [
      surveyId,
      surveyId,
      verificationId || "",
      String(answers.debt_range || ""),
      String(answers.debt_type || ""),
      String(answers.housing ?? ""),
      String(answers.job_type || ""),
      String(answers.income_range || ""),
      String(answers.family || ""),
      String(answers.overdue || ""),
      String(answers.lawsuit ?? ""),
      now,
    ]);
    console.log("[설문 저장 결과]", surveyResult.status, JSON.stringify(surveyResult.data));

    // 상담 시트에 행 추가
    const consultResult = await appendRow(token, GS_SPREADSHEET_ID, "상담", [
      phone,
      phone,
      String(result.mp || 0),
      String(result.reduction || 0),
      "대기중",
      "",
      now,
    ]);
    console.log("[상담 저장 결과]", consultResult.status, JSON.stringify(consultResult.data));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
