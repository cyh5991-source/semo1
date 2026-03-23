// v4-memory
import { NextResponse } from "next/server";

const store: Record<string, { code: string; expires: number }> = (global as any).__authStore ?? ((global as any).__authStore = {});

export async function POST(req: Request) {
  try {
    const { id, code } = await req.json();
    console.log("[인증 확인]", id, code, Object.keys(store));

    const entry = store[id];
    if (!entry) {
      return NextResponse.json({ ok: false, msg: "존재하지 않는 인증입니다" });
    }
    if (Date.now() > entry.expires) {
      delete store[id];
      return NextResponse.json({ ok: false, msg: "인증 시간이 만료되었습니다" });
    }
    if (entry.code !== code) {
      return NextResponse.json({ ok: false, msg: "인증번호가 일치하지 않습니다" });
    }

    delete store[id];
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[인증 확인 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
