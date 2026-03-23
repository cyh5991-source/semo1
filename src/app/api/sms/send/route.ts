// v4-memory
import { NextResponse } from "next/server";
import crypto from "crypto";

const ACCESS_KEY = process.env.NAVER_ACCESS_KEY!;
const SECRET_KEY = process.env.NAVER_SECRET_KEY!;
const SERVICE_ID = process.env.NAVER_SMS_SERVICE_ID!;
const SENDER = process.env.NAVER_SMS_SENDER!;

// 메모리에 인증코드 임시 저장
const store: Record<string, { code: string; expires: number }> = {};

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

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ ok: false, msg: "전화번호를 입력해주세요" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const authCode = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 3 * 60 * 1000;

    // 메모리에 저장
    store[id] = { code: authCode, expires };
    console.log("[메모리 저장]", id, authCode);

    const timestamp = Date.now().toString();
    const url = `/sms/v2/services/${SERVICE_ID}/messages`;

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const code = searchParams.get("code");

  if (!id || !code) {
    return NextResponse.json({ ok: false, msg: "잘못된 요청" });
  }

  const entry = store[id];
  if (!entry) {
    return NextResponse.json({ ok: false, msg: "존재하지 않는 인증입니다" });
  }
  if (Date.now() > entry.expires) {
    return NextResponse.json({ ok: false, msg: "인증 시간이 만료되었습니다" });
  }
  if (entry.code !== code) {
    return NextResponse.json({ ok: false, msg: "인증번호가 일치하지 않습니다" });
  }

  delete store[id];
  return NextResponse.json({ ok: true });
}
