import express from "express";
import {prisma} from "../../../lib/prisma"

const logsRouter = express.Router();

logsRouter.post("/",async(req: express.Request, res: express.Response)=>{
    try {
        
        const { userId, logs, ritualId, date, score } = {
            userId : req.user?.id,
            logs : req.body.logs,
            ritualId : req.body.ritualId,
            date : req.body.date,
            score : req.body.score
        };

        const userIdentifier = userId; // In a real app, prefer: req.user?.id
        if (!userIdentifier) return res.status(401).json({ error: "Unauthorized. User ID required." });

        const logsToProcess = logs ? logs : [{ ritualId, date, score }];

        if (!Array.isArray(logsToProcess) || logsToProcess.length === 0) {
            return res.status(400).json({ error: "Invalid payload. Provide 'logs' array or single log data." });
        }

        // Process all upserts in parallel using Promise.all
        const upsertedLogs = await Promise.all(
            logsToProcess.map(async (log) => {
                const logDate = new Date(log.date);

                return prisma.dailyLog.upsert({
                    where: {
                        ritualId_date: {
                            ritualId: log.ritualId,
                            date: logDate,
                        },
                    },
                    update: {
                        score: log.score,
                    },
                    create: {
                        userId: userIdentifier,
                        ritualId: log.ritualId,
                        date: logDate,
                        score: log.score,
                    },
                });
            })
        );

        return res.status(200).json({
            message: "Logs processed successfully",
            logs: upsertedLogs,
        });

    } catch (error) {
        console.error("POST /logs Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

logsRouter.get("/active", async(req: express.Request, res: express.Response) => {
    try {
        const userId = (req.user?.id); // In a real app: req.user?.id
        if (!userId) return res.status(401).json({ error: "Unauthorized. User ID required." });

        const activeLogs = await prisma.dailyLog.findMany({
            where: {
                userId: userId,
                ritual: {
                    isActive: true,
                },
            },
            include: {
                ritual: {
                    select: { title: true, isActive: true }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        return res.status(200).json({ logs: activeLogs });

    } catch (error) {
        console.error("GET /logs/active Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

logsRouter.get("/heatmap", async(req: express.Request, res: express.Response) => {
    try {
        const userId = (req.user?.id); // In a real app: req.user?.id
        if (!userId) return res.status(401).json({ error: "Unauthorized. User ID required." });

        const heatmapAggregations = await prisma.dailyLog.groupBy({
            by: ['date'],
            where: {
                userId: userId
            },
            _sum: {
                score: true, // Sums up the scores for each day across all rituals
            },
            orderBy: {
                date: 'asc'
            }
        });

        const formattedHeatmap = heatmapAggregations.map(entry => ({
            date: entry.date.toISOString().split('T')[0], 
            totalScore: entry._sum.score || 0 
        }));

        return res.status(200).json({ heatmap: formattedHeatmap });

    } catch (error) {
        console.error("GET /logs/heatmap Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

export default logsRouter;
