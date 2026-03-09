import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "더엘 법률사무소 | 2026년형 개인회생 예상 변제금 확인",
  description:
    "2026년 생계비 기준 반영. 1분이면 내 예상 월 변제금을 확인할 수 있습니다.",
  openGraph: {
    title: "더엘 법률사무소 | 개인회생 예상 변제금 확인",
    description: "8개 질문에 답하면 끝. 2026년 기준 예상 월 변제금을 바로 알려드려요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
