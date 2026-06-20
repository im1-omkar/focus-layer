import express from "express";
import {prisma} from "../../../lib/prisma"

const ritualRouter = express.Router();

ritualRouter.get("/",async(req: express.Request, res: express.Response)=>{
    try {
        const userId = req.query.userId as string; 
        if (!userId) return res.status(401).json({ error: "Unauthorized. User ID required." });

        const rituals = await prisma.ritual.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' } 
        });

        return res.status(200).json({ rituals });
    } catch (error) {
        console.error("GET /rituals Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

ritualRouter.post("/", async(req: express.Request, res: express.Response) => {
    try {
        const { userId, title } = req.body; 

        if (!userId || !title) {
            return res.status(400).json({ error: "User ID and title are required." });
        }

        
        const ritualCount = await prisma.ritual.count({
            where: { userId }
        });

        
        if (ritualCount >= 15) {
            return res.status(400).json({
                error: "You have reached the maximum limit of 15 rituals. Please delete one before adding more."
            });
        }

        
        const newRitual = await prisma.ritual.create({
            data: {
                userId,
                title,
                isActive: false 
            }
        });

        return res.status(201).json({
            message: "Ritual created successfully",
            ritual: newRitual
        });
    } catch (error) {
        console.error("POST /rituals Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

ritualRouter.patch("/:id/toggle", async (req: express.Request, res: express.Response) => {
    try {
        
        const id = req.params.id as string;

        const currentRitual = await prisma.ritual.findUnique({
            where: { id },
            select: { isActive: true }
        });

        if (!currentRitual) {
            return res.status(404).json({ error: "Ritual not found." });
        }

        const updatedRitual = await prisma.ritual.update({
            where: { id },
            data: {
                isActive: !currentRitual.isActive
            }
        });

        return res.status(200).json({
            message: updatedRitual.isActive ? "Ritual activated" : "Ritual paused",
            ritual: updatedRitual
        });
    } catch (error) {
        console.error("PATCH /rituals/:id/toggle Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
});





ritualRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
        
        const id = req.params.id as string;

        await prisma.ritual.delete({
            where: { id }
        });

        return res.status(200).json({ message: "Ritual deleted successfully" });
    } catch (error:any) {
        
        if (error) {
            
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "Ritual not found." });
            }
        }

        console.error("DELETE /rituals/:id Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
});
export default ritualRouter;