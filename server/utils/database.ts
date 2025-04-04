import { Client } from "pg";

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
// });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Heroku PostgreSQL
  },
});

let connected = false;

export async function query(
  text: string,
  params?: (string | number | boolean | Date)[]
) {
  // const client = await pool.connect();
  try {
    if (!connected) {
      await client.connect();
      connected = true;
    }
    const res = await client.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Optional: Add a cleanup function for when the server shuts down
export async function disconnect() {
  if (connected) {
    await client.end();
    connected = false;
  }
}
