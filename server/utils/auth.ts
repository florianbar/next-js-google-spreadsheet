import { google, sheets_v4 } from "googleapis";

export async function getAuth() {
  const credentials = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || "{}"
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client =
    (await auth.getClient()) as sheets_v4.Params$Resource$Spreadsheets$Get["auth"];

  // Instance of Google Sheets API
  const googleSheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  return {
    auth,
    client,
    googleSheets,
  };
}

export function validateApiKey(apiKey: string | null): Response | void {
  if (!apiKey) {
    throw new Error("Missing API key header", { cause: 401 });
  }

  if (apiKey !== process.env.API_KEY) {
    throw new Error("Invalid API key", { cause: 401 });
  }
}
