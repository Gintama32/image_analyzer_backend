// 🔹 Must be first to force IPv4 resolution
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./database.js"; // DB connection

const PORT = process.env.PORT || 3000;

// Test DB connection before starting server
db.raw("SELECT 1")
  .then(() => {
    console.log("✅ Database connection established");

    // Start server only after DB is ready
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Optional: Handle server errors
    server.on("error", (err) => console.error("Server error:", err));

  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop process if DB cannot connect
  });

// Global error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
