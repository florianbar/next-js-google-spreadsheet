import { query } from "@/utils/database";
import { validateApiKey } from "@/utils/auth";
import { Meal } from "@/types/meal";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    let date = new URL(request.url).searchParams.get("date");
    if (!date) {
      // Use current date if not provided
      date = new Date().toISOString().split("T")[0];
    }

    const result = await query(
      `SELECT
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
      WHERE meals.consumed_at::date = $1
      ORDER BY meals.consumed_at ASC
      `,
      [date]
    );

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
    const { meals, consumed_at } = requestBody;

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
        (_: Meal, index: number) =>
          `($${index * 3 + 1}, $${index * 3 + 2}, COALESCE($${
            index * 3 + 3
          }, CURRENT_TIMESTAMP))`
      )
      .join(", ");

    const values = meals.flatMap((meal: Meal) => [
      meal.food_id,
      meal.quantity,
      consumed_at || null,
    ]);

    const result = await query(
      `INSERT INTO meals (food_id, quantity, consumed_at) VALUES ${placeholders} RETURNING *`,
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

    const result = await query("DELETE FROM meals WHERE id = $1", [
      parseInt(mealId),
    ]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "Meal not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, {
      status: 204,
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
