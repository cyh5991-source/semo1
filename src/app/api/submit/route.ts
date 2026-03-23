// src/app/api/submit/route.ts  (v5-hardcoded)
import { NextResponse } from "next/server";

const NOTION_API_KEY = "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";
const SURVEY_DB_ID = "c2c7d0f56f784e8094a381592bd67768";
const CONSULT_DB_ID = "e5b50fd23b6a44549190fce8cae288ca";

const headers = {
  "Authorization": `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

export async function POST(req: Request) {
  try {
    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();

    console.log("[v5-submit 시작]", phone, surveyId);

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
    console.log("[설문 저장 결과]", JSON.stringify(surveyData));

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
    console.log("[상담 저장 결과]", JSON.stringify(consultData));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
