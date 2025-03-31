import { query, execute } from "@/utils/database";
import { validateApiKey } from "@/utils/auth";
import { getTodayISOString } from "@/utils/date";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    const response = await query("SELECT * FROM meals");

    return new Response(JSON.stringify(response), {
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
        createdAt: getTodayISOString(),
        updatedAt: getTodayISOString(),
      });
    }

    const values = mappedMeals.flatMap((meal) => [
      meal.name,
      meal.quantity,
      meal.healthy,
      meal.createdAt,
      meal.updatedAt,
    ]);

    const placeholders = mappedMeals.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const sql = `INSERT INTO meals (name, quantity, healthy, createdAt, updatedAt) VALUES ${placeholders}`;
    await execute(sql, values);

    return new Response(JSON.stringify({ meals: mappedMeals }), {
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
