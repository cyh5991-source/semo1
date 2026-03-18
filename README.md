# 티킷제로 - 개인회생 상담 랜딩페이지

2026년 생계비 기준 반영. 버튼 선택형 8단계 설문 → SMS 인증 → 예상 변제금 결과.

## 스택

- **프론트엔드**: Next.js 14 + Tailwind CSS
- **DB**: Google Sheets API
- **SMS**: 알리고 API
- **배포**: Vercel

## 시작하기

```bash
npm install
cp .env.local.example .env.local
# .env.local에 키 입력
npm run dev
```

## 환경변수

| 변수 | 설명 |
|------|------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | GCP 서비스 계정 이메일 |
| `GOOGLE_PRIVATE_KEY` | 서비스 계정 JSON의 private_key |
| `GOOGLE_SHEET_ID` | 스프레드시트 URL의 ID |
| `ALIGO_API_KEY` | 알리고 API 키 (없으면 테스트 모드) |
| `ALIGO_USER_ID` | 알리고 유저 ID |
| `ALIGO_SENDER` | 알리고 발신번호 |

## Google Sheets 구조

시트 3개를 만들고 1행에 헤더를 입력하세요:

- **인증**: ID | 전화번호 | 인증코드 | 상태 | 만료시간 | 인증시간 | IP | 생성일
- **설문**: ID | 인증ID | 채무범위 | 채무종류 | 담보 | 직업 | 소득 | 가족수 | 연체 | 소송
- **상담**: ID | 전화번호 | 예상변제금 | 예상감면율 | 상담상태 | 담당자 | 신청일시
ㄴ
