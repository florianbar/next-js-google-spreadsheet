import { sheets_v4 } from "googleapis";
import { GaxiosResponse } from "gaxios";
import { v4 as uuidv4 } from "uuid";

import { getAuth, validateApiKey } from "@/utils/auth";
import { getTodayISOString } from "@/utils/date";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

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
      return new Response(JSON.stringify({ error: "Failed to fetch meals" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | unknown) {
    return new Response(
      JSON.stringify(error instanceof Error ? error : error),
      {
        status:
          error instanceof Error && typeof error.cause === "number"
            ? error.cause
            : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    const requestBody = await request.json();

    if (!requestBody.meals || requestBody.meals.length === 0) {
      return new Response(JSON.stringify({ error: "Missing meals" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mappedMeals = [];
    for (const meal of requestBody.meals) {
      if (!meal.name || !meal.quantity || typeof meal.healthy !== "boolean") {
        return new Response(
          JSON.stringify({ error: "Missing or invalid required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      mappedMeals.push([
        uuidv4(),
        meal.name,
        meal.quantity,
        meal.healthy,
        meal.createdAt ?? getTodayISOString(),
      ]);
    }

    const { auth, googleSheets } = await getAuth();

    // Write row(s) to the spreadsheet
    const response = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: "USER_ENTERED", // "RAW" or "USER_ENTERED"
      requestBody: {
        values: mappedMeals,
      },
    });

    if (response.status !== 200) {
      return new Response(JSON.stringify({ error: "Failed to add meals" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: Error | unknown) {
    return new Response(
      JSON.stringify(error instanceof Error ? error : error),
      {
        status:
          error instanceof Error && typeof error.cause === "number"
            ? error.cause
            : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
