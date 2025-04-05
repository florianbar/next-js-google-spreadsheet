import { query } from "@/utils/database";
import { validateApiKey } from "@/utils/auth";
import { Meal } from "@/types/meal";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    // const result = await query("SELECT * FROM meals");
    const result = await query(`
      SELECT 
        meals.id,
        meals.quantity,
        meals.consumed_at,
        json_build_object(
          'id', foods.id,
          'name', foods.name,
          'healthy', foods.healthy
        ) as food
      FROM meals
      JOIN foods ON meals.food_id = foods.id
      ORDER BY meals.consumed_at ASC
    `);

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
    const { meals } = requestBody;

    if (!meals || meals.length === 0) {
      return new Response(JSON.stringify({ error: "Missing meals" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const meal of meals) {
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
    }

    const placeholders = meals
      .map(
        (meal: Meal, index: number) => `($${index * 2 + 1}, $${index * 2 + 2})`
      )
      .join(", ");

    const values = meals.flatMap((meal: Meal) => [meal.food_id, meal.quantity]);

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
