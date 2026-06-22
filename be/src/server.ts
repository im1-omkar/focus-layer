import express from "express";
import authRouter from "./modules/api.auth/auth.routes";
import ritualRouter from "./modules/api.rituals/rituals.routes";
import logsRouter from "./modules/api.logs/logs.routes";
import cors from "cors";
import { requireAuth } from "./middlewares/authMiddleware";

const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/rituals",requireAuth,ritualRouter)
app.use("/api/logs",requireAuth,logsRouter)

export default app;