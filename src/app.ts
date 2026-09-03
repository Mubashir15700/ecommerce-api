import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(apiRateLimiter);

app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "E-commerce API is running"
    });
});

export default app;
