import { NextResponse } from "next/server";
import { findRow, getRow, updateCell } from "@/lib/sheets";

export async function POST(req: Request) {
  try {
    const { id, code } = await req.json();

    // '인증' 시트에서 ID로 행 찾기
    const rowIdx = await findRow("인증", 0, id);
    if (rowIdx < 0) {
      return NextResponse.json({ ok: false, msg: "존재하지 않는 인증입니다" });
    }

    const row = await getRow("인증", rowIdx);
    if (!row) {
      return NextResponse.json({ ok: false, msg: "데이터를 찾을 수 없습니다" });
    }

    // row[2] = 인증코드, row[3] = 상태, row[4] = 만료시간
    const savedCode = row[2];
    const status = row[3];
    const expiresAt = row[4];

    if (status === "verified") {
      return NextResponse.json({ ok: false, msg: "이미 인증된 번호입니다" });
    }

    if (new Date(expiresAt) < new Date()) {
      await updateCell("인증", rowIdx, "D", "expired");
      return NextResponse.json({ ok: false, msg: "인증 시간이 만료되었습니다" });
    }

    if (savedCode !== code) {
      return NextResponse.json({ ok: false, msg: "인증번호가 일치하지 않습니다" });
    }

    // 인증 성공
    await updateCell("인증", rowIdx, "D", "verified");
    await updateCell("인증", rowIdx, "F", new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[인증 확인 오류]", error);
    return NextResponse.json({ ok: false, msg: "서버 오류" }, { status: 500 });
  }
}
