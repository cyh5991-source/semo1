const NOTION_API_KEY = "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";
const SURVEY_DB_ID = "c2c7d0f56f784e8094a381592bd67768";
const CONSULT_DB_ID = "e5b50fd23b6a44549190fce8cae288ca";

const headers = {
  "Authorization": `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

export async function saveSurvey(data: {
  surveyId: string;
  verificationId: string;
  debt_range: string;
  debt_type: string;
  housing: string | boolean;
  job_type: string;
  income_range: string;
  family: string;
  overdue: string;
  lawsuit: string | boolean;
}) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { database_id: SURVEY_DB_ID },
      properties: {
        이름:      { title: [{ text: { content: data.surveyId } }] },
        설문ID:    { rich_text: [{ text: { content: data.surveyId } }] },
        인증ID:    { rich_text: [{ text: { content: data.verificationId } }] },
        채무범위:  { rich_text: [{ text: { content: String(data.debt_range) } }] },
        채무종류:  { rich_text: [{ text: { content: String(data.debt_type) } }] },
        담보여부:  { rich_text: [{ text: { content: String(data.housing) } }] },
        직업:      { rich_text: [{ text: { content: String(data.job_type) } }] },
        소득범위:  { rich_text: [{ text: { content: String(data.income_range) } }] },
        가족수:    { rich_text: [{ text: { content: String(data.family) } }] },
        연체여부:  { rich_text: [{ text: { content: String(data.overdue) } }] },
        소송여부:  { rich_text: [{ text: { content: String(data.lawsuit) } }] },
        등록일시:  { rich_text: [{ text: { content: new Date().toISOString() } }] },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[노션 설문 저장 실패] ${JSON.stringify(err)}`);
  }
  console.log("[설문 저장 완료]");
}

export async function saveConsult(data: {
  phone: string;
  mp: number;
  reduction: number;
}) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { database_id: CONSULT_DB_ID },
      properties: {
        이름:       { title: [{ text: { content: data.phone } }] },
        전화번호:   { rich_text: [{ text: { content: data.phone } }] },
        예상변제금: { rich_text: [{ text: { content: String(data.mp) } }] },
        예상감면율: { rich_text: [{ text: { content: String(data.reduction) } }] },
        상담상태:   { select: { name: "대기중" } },
        담당자:     { rich_text: [{ text: { content: "" } }] },
        신청일시:   { rich_text: [{ text: { content: new Date().toISOString() } }] },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[노션 상담 저장 실패] ${JSON.stringify(err)}`);
  }
  console.log("[상담 저장 완료]");
}
