import { sheets_v4 } from "googleapis";
import { GaxiosResponse } from "gaxios";
import { v4 as uuidv4 } from "uuid";

import { getAuth } from "@/utils/auth";

import { Meal } from "@/types/meal";

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

    if (!requestBody.meals || requestBody.meals.length === 0) {
      return new Response(JSON.stringify({ error: "Missing meals" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mappedMeals = requestBody.meals.map((meal: Meal) => {
      if (
        !meal.food ||
        !meal.quantity ||
        typeof meal.healthy !== "boolean" ||
        !meal.createdAt // TODO make sure it's a valid date
      ) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return [uuidv4(), meal.food, meal.quantity, meal.healthy, meal.createdAt];
    });

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

    // if (response.status !== 200) {
    //   // throw error
    // }

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
