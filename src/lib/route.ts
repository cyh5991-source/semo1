// src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import { saveSurvey, saveConsult } from "@/lib/notion";

export async function POST(req: Request) {
  try {
    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();

    await saveSurvey({
      surveyId,
      verificationId,
      debt_range:    answers.debt_range   || "",
      debt_type:     answers.debt_type    || "",
      housing:       answers.housing      ?? "",
      job_type:      answers.job_type     || "",
      income_range:  answers.income_range || "",
      family:        answers.family       || "",
      overdue:       answers.overdue      || "",
      lawsuit:       answers.lawsuit      ?? "",
    });

    await saveConsult({
      phone,
      mp:        result.mp        || 0,
      reduction: result.reduction || 0,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
