// v5-redis
import { NextResponse } from "next/server";
import crypto from "crypto";

const ACCESS_KEY = process.env.NAVER_ACCESS_KEY!;
const SECRET_KEY = process.env.NAVER_SECRET_KEY!;
const SERVICE_ID = process.env.NAVER_SMS_SERVICE_ID!;
const SENDER = process.env.NAVER_SMS_SENDER!;
const REDIS_URL = process.env.KV_REST_API_URL!;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN!;

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

async function redisSet(key: string, value: string, exSeconds: number) {
  await fetch(`${REDIS_URL}/set/${key}/${encodeURIComponent(value)}?EX=${exSeconds}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ ok: false, msg: "전화번호를 입력해주세요" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const authCode = String(Math.floor(100000 + Math.random() * 900000));
    const timestamp = Date.now().toString();
    const url = `/sms/v2/services/${SERVICE_ID}/messages`;

    // Redis에 인증코드 저장 (3분)
    await redisSet(`auth:${id}`, authCode, 180);
    console.log("[Redis 저장]", id, authCode);

    const smsRes = await fetch(`https://sens.apigw.ntruss.com${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": ACCESS_KEY,
        "x-ncp-apigw-signature-v2": makeSignature("POST", url, timestamp),
      },
      body: JSON.stringify({
        type: "SMS",
        contentType: "COMM",
        countryCode: "82",
        from: SENDER,
        content: `[더엘 법률사무소] 인증번호: ${authCode}`,
        messages: [{ to: phone.replace(/-/g, "") }],
      }),
    });

    const smsData = await smsRes.json();
    console.log("[SENS 응답]", JSON.stringify(smsData));

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("[SMS 발송 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
