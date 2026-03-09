import { NextResponse } from "next/server";
import { appendRow } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { verificationId, phone, answers, result } = await req.json();
    const surveyId = crypto.randomUUID();

    // '설문' 시트에 저장
    // 헤더: ID | 인증ID | 채무범위 | 채무종류 | 담보 | 직업 | 소득 | 가족수 | 연체 | 소송
    await appendRow("설문", [
      surveyId,
      verificationId,
      answers.debt_range || "",
      answers.debt_type || "",
      answers.housing ?? "",
      answers.job_type || "",
      answers.income_range || "",
      answers.family || "",
      answers.overdue || "",
      answers.lawsuit ?? "",
    ]);

    // '상담' 시트에 저장
    // 헤더: ID | 전화번호 | 예상변제금 | 예상감면율 | 상담상태 | 담당자 | 신청일시
    await appendRow("상담", [
      crypto.randomUUID(),
      phone,
      result.mp || 0,
      result.reduction || 0,
      "대기중",
      "",
      new Date().toISOString(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[설문 저장 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
