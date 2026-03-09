import { NextResponse } from "next/server";
import { appendRow } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ ok: false, msg: "전화번호를 입력해주세요" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const authCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

    // Google Sheets '인증' 시트에 저장
    // 헤더: ID | 전화번호 | 인증코드 | 상태 | 만료시간 | 인증시간 | IP | 생성일
    await appendRow("인증", [
      id,
      phone,
      authCode,
      "sent",
      expiresAt,
      "",
      req.headers.get("x-forwarded-for") || "",
      new Date().toISOString(),
    ]);

    // ── 알리고 SMS 발송 ──
    // .env.local에 ALIGO_API_KEY, ALIGO_USER_ID, ALIGO_SENDER가 있으면 실제 발송
    // 없으면 테스트 모드 (콘솔에만 출력)
    if (process.env.ALIGO_API_KEY) {
      const formData = new FormData();
      formData.append("key", process.env.ALIGO_API_KEY);
      formData.append("userid", process.env.ALIGO_USER_ID!);
      formData.append("sender", process.env.ALIGO_SENDER!);
      formData.append("receiver", phone.replace(/-/g, ""));
      formData.append("msg", `[티킷제로] 인증번호: ${authCode}`);

      const aligoRes = await fetch("https://apis.aligo.in/send/", {
        method: "POST",
        body: formData,
      });
      const aligoData = await aligoRes.json();
      console.log("[알리고 응답]", aligoData);
    } else {
      // 테스트 모드: 콘솔에 인증코드 출력
      console.log(`[테스트 모드] ${phone} 인증코드: ${authCode}`);
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("[SMS 발송 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
