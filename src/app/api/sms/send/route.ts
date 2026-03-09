import { NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const VERIFY_DB_ID = process.env.NOTION_VERIFY_DB_ID!;

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ ok: false, msg: "전화번호를 입력해주세요" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const authCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

    // 노션 인증 DB에 저장
    await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: VERIFY_DB_ID },
        properties: {
          이름:       { title: [{ text: { content: id } }] },
          전화번호:   { rich_text: [{ text: { content: phone } }] },
          인증코드:   { rich_text: [{ text: { content: authCode } }] },
          상태:       { rich_text: [{ text: { content: "sent" } }] },
          만료시간:   { rich_text: [{ text: { content: expiresAt } }] },
          생성일:     { rich_text: [{ text: { content: new Date().toISOString() } }] },
        },
      }),
    });

    // 알리고 SMS 발송
    if (process.env.ALIGO_API_KEY) {
      const formData = new FormData();
      formData.append("key", process.env.ALIGO_API_KEY);
      formData.append("userid", process.env.ALIGO_USER_ID!);
      formData.append("sender", process.env.ALIGO_SENDER!);
      formData.append("receiver", phone.replace(/-/g, ""));
      formData.append("msg", `[더엘 법률사무소] 인증번호: ${authCode}`);
      const aligoRes = await fetch("https://apis.aligo.in/send/", {
        method: "POST",
        body: formData,
      });
      const aligoData = await aligoRes.json();
      console.log("[알리고 응답]", aligoData);
    } else {
      console.log(`[테스트 모드] ${phone} 인증코드: ${authCode}`);
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("[SMS 발송 오류]", error);
    return NextRespons
