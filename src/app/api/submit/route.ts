// src/app/api/submit/route.ts  (v7-runtime)
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const SURVEY_DB_ID = process.env.NOTION_SURVEY_DB_ID;
    const CONSULT_DB_ID = process.env.NOTION_CONSULT_DB_ID;

    console.log("[v7-submit] 환경변수 확인:", {
      hasKey: !!NOTION_API_KEY,
      keyPrefix: NOTION_API_KEY?.substring(0, 10),
      surveyDb: SURVEY_DB_ID?.substring(0, 8),
      consultDb: CONSULT_DB_ID?.substring(0, 8),
    });

    if (!NOTION_API_KEY || !SURVEY_DB_ID || !CONSULT_DB_ID) {
      console.error("[v7-submit] 환경변수 누락!");
      return NextResponse.json({ ok: false, msg: "환경변수 누락" }, { status: 500 });
    }

    const headers = {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    };

    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();

    console.log("[v7-submit 시작]", phone, surveyId);

    const surveyRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        parent: { database_id: SURVEY_DB_ID },
        properties: {
          이름:      { title: [{ text: { content: surveyId } }] },
          설문ID:    { rich_text: [{ text: { content: surveyId } }] },
          인증ID:    { rich_text: [{ text: { content: verificationId || "" } }] },
          채무범위:  { rich_text: [{ text: { content: String(answers.debt_range || "") } }] },
          채무종류:  { rich_text: [{ text: { content: String(answers.debt_type || "") } }] },
          담보여부:  { rich_text: [{ text: { content: String(answers.housing ?? "") } }] },
          직업:      { rich_text: [{ text: { content: String(answers.job_type || "") } }] },
          소득범위:  { rich_text: [{ text: { content: String(answers.income_range || "") } }] },
          가족수:    { rich_text: [{ text: { content: String(answers.family || "") } }] },
          연체여부:  { rich_text: [{ text: { content: String(answers.overdue || "") } }] },
          소송여부:  { rich_text: [{ text: { content: String(answers.lawsuit ?? "") } }] },
          등록일시:  { rich_text: [{ text: { content: new Date().toISOString() } }] },
        },
      }),
    });

    const surveyData = await surveyRes.json();
    console.log("[설문 저장 결과]", surveyRes.status, JSON.stringify(surveyData));

    const consultRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        parent: { database_id: CONSULT_DB_ID },
        properties: {
          이름:       { title: [{ text: { content: phone } }] },
          전화번호:   { rich_text: [{ text: { content: phone } }] },
          예상변제금: { rich_text: [{ text: { content: String(result.mp || 0) } }] },
          예상감면율: { rich_text: [{ text: { content: String(result.reduction || 0) } }] },
          상담상태:   { select: { name: "대기중" } },
          담당자:     { rich_text: [{ text: { content: "" } }] },
          신청일시:   { rich_text: [{ text: { content: new Date().toISOString() } }] },
        },
      }),
    });

    const consultData = await consultRes.json();
    console.log("[상담 저장 결과]", consultRes.status, JSON.stringify(consultData));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
