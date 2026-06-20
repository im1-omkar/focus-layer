import express from 'express';
import jwt from 'jsonwebtoken'; 


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}


export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Unauthorized. Missing or invalid token format." });
        }

        const token:any = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'fallback_development_secret';

        
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        
        if (!decoded || typeof decoded === 'string' || !decoded.id) {
            return res.status(401).json({ error: "Unauthorized. Invalid token structure." });
        }

        
        req.user = { id: decoded.id as string };

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ error: "Unauthorized. Token is invalid or has expired." });
    }
};