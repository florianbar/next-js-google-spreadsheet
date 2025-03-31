// scripts/init-db.js
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { getTodayISOString } from "../utils/date.js";

async function initializeMyHealthDatabase() {
  try {
    const db = await open({
      filename: "./data/myhealth.db", // Ensure this matches your db path
      driver: sqlite3.Database,
    });

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        healthy BOOLEAN NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      );
    `);

    // Seed initial data (optional)
    await db.run(
      "INSERT INTO meals (name, quantity, healthy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      "Apple",
      1,
      true,
      getTodayISOString(),
      getTodayISOString()
    );

    console.log("Database initialized successfully!");

    await db.close();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initializeMyHealthDatabase();
