// lib/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

async function getDatabase() {
  if (db) {
    return db;
  }

  const databasePath = "./data/myhealth.db"; // Adjust the path as needed

  db = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });

  return db;
}

export async function query(sql, params = []) {
  const db = await getDatabase();
  try {
    const rows = await db.all(sql, params);
    return rows;
  } finally {
    // You might choose to close the database connection here,
    // but for simpler applications, keeping it open can be efficient.
    // Be mindful of resource usage in long-running applications.
    // await db.close();
  }
}

export async function execute(sql, params = []) {
  const db = await getDatabase();
  try {
    const result = await db.run(sql, params);
    return result;
  } finally {
    // await db.close();
  }
}

export async function get(sql, params = []) {
  const db = await getDatabase();
  try {
    const row = await db.get(sql, params);
    return row;
  } finally {
    // await db.close();
  }
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
