import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import {prisma} from "../../../lib/prisma"

const authRouter = express.Router();
const secret = process.env.JWT_SECRET || 'fallback_development_secret';

authRouter.post("/signup",async (req: express.Request, res: express.Response)=>{
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ error: "A user with this email already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})

authRouter.post("/signin", async(req: express.Request, res : express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const { password: _, ...userWithoutPassword } = user;
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

        return res.status(200).json({
            message: "Signed in successfully",
            user: userWithoutPassword,
            token: token
        });

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ error: "An internal server error occurred." });
    }
})


export default authRouter;