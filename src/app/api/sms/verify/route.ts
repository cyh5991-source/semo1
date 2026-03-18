import { NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const VERIFY_DB_ID = process.env.NOTION_VERIFY_DB_ID!;

export async function POST(req: Request) {
  try {
    const { id, code } = await req.json();

    // 노션에서 인증 ID로 페이지 찾기
    const searchRes = await fetch(
      `https://api.notion.com/v1/databases/${VERIFY_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          filter: {
            property: "이름",
            title: { equals: id },
          },
        }),
      }
    );

    const searchData = await searchRes.json();
    const page = searchData.results?.[0];

    if (!page) {
      return NextResponse.json({ ok: false, msg: "존재하지 않는 인증입니다" });
    }

    const props = page.properties;
    const savedCode = props["인증코드"]?.rich_text?.[0]?.text?.content;
    const status = props["상태"]?.rich_text?.[0]?.text?.content;
    const expiresAt = props["만료시간"]?.rich_text?.[0]?.text?.content;

    if (status === "verified") {
      return NextResponse.json({ ok: false, msg: "이미 인증된 번호입니다" });
    }

    if (new Date(expiresAt) < new Date()) {
      // 만료 상태 업데이트
      await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          properties: {
            상태: { rich_text: [{ text: { content: "expired" } }] },
          },
        }),
      });
      return NextResponse.json({ ok: false, msg: "인증 시간이 만료되었습니다" });
    }

    if (savedCode !== code) {
      return NextResponse.json({ ok: false, msg: "인증번호가 일치하지 않습니다" });
    }

    // 인증 성공 - 상태 업데이트
    await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        properties: {
          상태: { rich_text: [{ text: { content: "verified" } }] },
        },
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[인증 확인 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
