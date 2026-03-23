// v5-upstash
import { NextResponse } from "next/server";

const REDIS_URL = process.env.KV_REST_API_URL!;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN!;

async function redisGet(key: string) {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

async function redisDel(key: string) {
  await fetch(`${REDIS_URL}/del/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
}

export async function POST(req: Request) {
  try {
    const { id, code } = await req.json();
    console.log("[인증 확인]", id, code);

    const savedCode = await redisGet(`auth:${id}`);
    console.log("[Redis 조회]", savedCode);

    if (!savedCode) {
      return NextResponse.json({ ok: false, msg: "존재하지 않는 인증입니다" });
    }
    if (savedCode !== code) {
      return NextResponse.json({ ok: false, msg: "인증번호가 일치하지 않습니다" });
    }

    await redisDel(`auth:${id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[인증 확인 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
