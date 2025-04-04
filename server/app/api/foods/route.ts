import { query } from "@/utils/database";
import { validateApiKey } from "@/utils/auth";

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    const result = await query("SELECT * FROM foods ORDER BY created_at ASC");

    return new Response(JSON.stringify({ foods: result.rows }), {
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

    const { name, healthy } = await request.json();

    if (!name || typeof healthy !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await query(
      "INSERT INTO foods (name, healthy) VALUES ($1, $2) RETURNING *",
      [name, healthy]
    );

    return new Response(JSON.stringify(result.rows[0]), {
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

    const foodId = new URL(request.url).searchParams.get("id");

    if (!foodId) {
      return new Response(JSON.stringify({ error: "Missing food id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await query(`DELETE FROM foods WHERE id=${foodId}`);

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

export async function PUT(request: Request) {
  try {
    const apiKey = request.headers.get("X-API-KEY");
    validateApiKey(apiKey);

    const { id, name, healthy } = await request.json();

    if (!id || !name || typeof healthy !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await query(
      "UPDATE foods SET name = $1, healthy = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, healthy, id]
    );

    return new Response(JSON.stringify(result.rows[0]), {
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
