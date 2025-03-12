import { sheets_v4 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';

import { getAuth } from '@/utils/auth';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

export async function GET() {
    const { auth, googleSheets } = await getAuth();

    // // Get metadata about the spreadsheet
    // const metaData: GaxiosResponse<sheets_v4.Schema$Spreadsheet> = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId,
    // });

    // Read rows from the spreadsheet
    const rows: GaxiosResponse<sheets_v4.Schema$ValueRange> = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:D`, // can provide column number
    });

    return new Response(JSON.stringify(rows.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST() {
    const { auth, googleSheets } = await getAuth();

    const now = new Date();
    const isoDateTime = now.toISOString().slice(0, 19); 
    console.log("isoDateTime ::::", isoDateTime);

    // Write row(s) to the spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:D`,
        valueInputOption: "USER_ENTERED", // "RAW" or "USER_ENTERED"
        resource: {
            values: [
                [isoDateTime, "Egg", 1, true],
            ],
        },
    });

    return new Response("", {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
 
// export async function POST(request: Request) {
//   // Parse the request body
//   const body = await request.json();
//   const { name } = body;
 
//   // e.g. Insert new user into your DB
//   const newUser = { id: Date.now(), name };
 
//   return new Response(JSON.stringify(newUser), {
//     status: 201,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }