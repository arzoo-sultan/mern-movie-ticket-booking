import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });

export default app;
