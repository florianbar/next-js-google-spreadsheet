import { query } from "@/utils/database";
import { getTodayISOString } from "@/utils/date";
import { validateApiKey } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    const result = await query("SELECT * FROM meals");

    return new Response(JSON.stringify({ meals: result.rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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
      const { name, quantity, healthy } = meal;

      if (!name || !quantity || typeof healthy !== "boolean") {
        return new Response(
          JSON.stringify({ error: "Missing or invalid required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      mappedMeals.push({
        name,
        quantity,
        healthy,
        created_at: getTodayISOString(),
        updated_at: getTodayISOString(),
      });
    }

    const values = mappedMeals.flatMap((meal) => [
      meal.name,
      meal.quantity,
      meal.healthy,
      meal.created_at,
      meal.updated_at,
    ]);

    const placeholders = mappedMeals.map(() => "(?, ?, ?, ?, ?)").join(", ");
    // const sql = `INSERT INTO meals (name, quantity, healthy, created_at, updated_at) VALUES ${placeholders}`;
    // await execute(sql, values);

    // const result = await query("SELECT * FROM meals");
    const result = await query(
      "INSERT INTO meals (food, quantity, healthy) VALUES ($1, $2, $3) RETURNING *",
      ["Apple", 1, true]
    );

    return new Response(JSON.stringify({ meals: result.rows[0] }), {
      status: 201,
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

export async function DELETE(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    // get meal id from query param
    const mealId = new URL(request.url).searchParams.get("id");

    if (!mealId) {
      return new Response(JSON.stringify({ error: "Missing meal id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await query(`DELETE FROM meals WHERE id=${mealId}`);

    return new Response("DELETE", { status: 200 });
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
