import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    
    console.log("[1] 시작 phone:", phone);
    console.log("[2] NOTION_API_KEY:", process.env.NOTION_API_KEY ? "있음" : "없음");
    console.log("[3] NOTION_VERIFY_DB_ID:", process.env.NOTION_VERIFY_DB_ID ? "있음" : "없음");

    const id = crypto.randomUUID();
    const authCode = "123456";

    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_VERIFY_DB_ID },
        properties: {
          이름:     { title: [{ text: { content: id } }] },
          전화번호: { rich_text: [{ text: { content: phone } }] },
          인증코드: { rich_text: [{ text: { content: authCode } }] },
          상태:     { rich_text: [{ text: { content: "sent" } }] },
          만료시간: { rich_text: [{ text: { content: new Date(Date.now() + 3 * 60 * 1000).toISOString() } }] },
          생성일:   { rich_text: [{ text: { content: new Date().toISOString() } }] },
        },
      }),
    });

    const notionData = await notionRes.json();
    console.log("[4] 노션 결과:", JSON.stringify(notionData));

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("[에러]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
