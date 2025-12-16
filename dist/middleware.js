import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const userMiddleware = (req, res, next) => {
    const JWT_PASSWORD = process.env.JWT_PASSWORD;
    if (!JWT_PASSWORD) {
        throw new Error("password not set in .env!");
    }
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header, JWT_PASSWORD);
    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: 'User not found'
        });
    }
};
//# sourceMappingURL=middleware.js.map