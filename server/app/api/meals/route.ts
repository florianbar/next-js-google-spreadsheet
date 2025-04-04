import { query } from "@/utils/database";
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
      const { food_id, quantity } = meal;

      if (!food_id || !quantity) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      mappedMeals.push({
        food_id,
        quantity,
      });
    }

    const placeholders = mappedMeals
      .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
      .join(", ");

    const values = mappedMeals.flatMap((meal) => [meal.food_id, meal.quantity]);

    const result = await query(
      `INSERT INTO meals (food_id, quantity) VALUES ${placeholders} RETURNING *`,
      values
    );

    return new Response(JSON.stringify({ meals: result.rows }), {
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

    const mealId = new URL(request.url).searchParams.get("id");

    if (!mealId) {
      return new Response(JSON.stringify({ error: "Missing meal id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await query(`DELETE FROM meals WHERE id=${mealId}`);

    return new Response("DELETE", { status: 204 });
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
