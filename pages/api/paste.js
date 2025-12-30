import pool from "../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { content, ttl, maxViews } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content required" });
      }

      const id = uuidv4();
      const expiresAt = ttl
        ? new Date(Date.now() + ttl * 1000)
        : null;

      await pool.query(
        `INSERT INTO pastes (id, content, expires_at, max_views)
         VALUES ($1, $2, $3, $4)`,
        [id, content, expiresAt, maxViews || null]
      );

      return res.status(200).json({
        url: `http://localhost:3000/paste/${id}`
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
