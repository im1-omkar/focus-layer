import express from "express";
import authRouter from "./modules/api.auth/auth.routes";
import ritualRouter from "./modules/api.rituals/rituals.routes";
import logsRouter from "./modules/api.logs/logs.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/rituals",ritualRouter)
app.use("/api/logs",logsRouter)

export default app;