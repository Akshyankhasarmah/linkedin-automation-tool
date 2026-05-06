import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Professional SQL Persistence Layer
async function initDatabase() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT,
      action TEXT,
      user_id TEXT,
      payload TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const db = await initDatabase();

  app.use(express.json());

  // Professional System Status API
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "operational",
      engine: "LinkedIn Intelligence v4.2",
      db_type: "SQLite 3.x",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Audit Logging API (Enterprise usage)
  app.post("/api/audit", async (req, res) => {
    const { event_type, action, user_id, payload } = req.body;
    try {
      await db.run(
        "INSERT INTO audit_logs (event_type, action, user_id, payload) VALUES (?, ?, ?, ?)",
        [event_type, action, user_id, JSON.stringify(payload)]
      );
      res.json({ success: true });
    } catch (err) {
      console.error("SQL Audit failed:", err);
      res.status(500).json({ error: "Persistence failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\x1b[34m%s\x1b[0m`, `LinkedIn Intelligence Server Active`);
    console.log(`\x1b[32m%s\x1b[0m`, `URL: http://localhost:${PORT}`);
    console.log(`\x1b[33m%s\x1b[0m`, `Auth Check: Ensure http://localhost:${PORT} is authorized in Firebase Console\n`);
  });
}

startServer();
