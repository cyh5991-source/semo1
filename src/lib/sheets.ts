import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

/** 시트에 한 줄 추가 */
export async function appendRow(sheetName: string, values: (string | number | boolean)[]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

/** 시트에서 특정 컬럼 값으로 행 찾기 (0-indexed row 반환, -1이면 없음) */
export async function findRow(sheetName: string, column: number, value: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
  });
  const rows = res.data.values || [];
  return rows.findIndex((row) => row[column] === value);
}

/** 시트에서 특정 행 데이터 가져오기 (1-indexed) */
export async function getRow(sheetName: string, rowIndex: number) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
  });
  const rows = res.data.values || [];
  return rows[rowIndex] || null;
}

/** 셀 업데이트 (rowIndex는 0-indexed, col은 "A","B" 등) */
export async function updateCell(
  sheetName: string,
  rowIndex: number,
  col: string,
  value: string
) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!${col}${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[value]] },
  });
}
