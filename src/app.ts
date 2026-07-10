import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/test.routes";
import csvRoutes from "./routes/csv.routes";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api/test", testRoutes);

app.use("/api/csv", csvRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GrowEasy CSV Importer API Running",
  });
});

app.use(errorHandler);

export default app;
