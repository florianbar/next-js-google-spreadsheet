import { sheets_v4 } from "googleapis";
import { GaxiosResponse } from "gaxios";
import { v4 as uuidv4 } from "uuid";

import { getAuth } from "@/utils/auth";
import { getTodayISOString } from "@/utils/date";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

export async function GET() {
  try {
    const { auth, googleSheets } = await getAuth();

    // // Get metadata about the spreadsheet
    // const metaData: GaxiosResponse<sheets_v4.Schema$Spreadsheet> = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId,
    // });

    // Read rows from the spreadsheet
    const response: GaxiosResponse<sheets_v4.Schema$ValueRange> =
      await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:E`, // can provide column number
      });

    if (response.status !== 200) {
      // throw error
    }

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    if (
      !requestBody.food ||
      !requestBody.quantity ||
      typeof requestBody.healthy !== "boolean"
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { auth, googleSheets } = await getAuth();
    const createdAt = requestBody.createdAt ?? getTodayISOString();

    // Write row(s) to the spreadsheet
    const response = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: "USER_ENTERED", // "RAW" or "USER_ENTERED"
      resource: {
        values: [
          [
            uuidv4(),
            requestBody.food,
            requestBody.quantity,
            requestBody.healthy,
            createdAt,
          ],
        ],
      },
    });

    if (response.status !== 200) {
      // throw error
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
