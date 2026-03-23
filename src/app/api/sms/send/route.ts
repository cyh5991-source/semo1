// v3
import { NextResponse } from "next/server";
import crypto from "crypto";

const NOTION_API_KEY = "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";
const VERIFY_DB_ID = "51495391e79741ff84bc093da69e3e72";
const ACCESS_KEY = process.env.NAVER_ACCESS_KEY!;
const SECRET_KEY = process.env.NAVER_SECRET_KEY!;
const SERVICE_ID = process.env.NAVER_SMS_SERVICE_ID!;
const SENDER = process.env.NAVER_SMS_SENDER!;

function makeSignature(method: string, url: string, timestamp: string) {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(method);
  hmac.update(" ");
  hmac.update(url);
  hmac.update("\n");
  hmac.update(timestamp);
  hmac.update("\n");
  hmac.update(ACCESS_KEY);
  return hmac.digest("base64");
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ ok: false, msg: "전화번호를 입력해주세요" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const authCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();
    const timestamp = Date.now().toString();
    const url = `/sms/v2/services/${SERVICE_ID}/messages`;

    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: VERIFY_DB_ID },
        properties: {
          이름:     { title: [{ text: { content: id } }] },
          전화번호: { rich_text: [{ text: { content: phone } }] },
          인증코드: { rich_text: [{ text: { content: authCode } }] },
          상태:     { rich_text: [{ text: { content: "sent" } }] },
          만료시간: { rich_text: [{ text: { content: expiresAt } }] },
          생성일:   { rich_text: [{ text: { content: new Date().toISOString() } }] },
        },
      }),
    });

    const notionData = await notionRes.json();
    console.log("[노션 저장 결과]", JSON.stringify(notionData));

    const smsRes = await fetch(`https://sens.apigw.ntruss.com${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": ACCESS_KEY,
        "x-ncp-apigw-signature-v2": makeSignature("POST", url, timestamp),
      },
      body: JSON.stringify({
