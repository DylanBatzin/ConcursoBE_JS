import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "miClaveSecreta";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; 

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            }
            req.user = user; 
            next();
        });
    } else {
        res.status(401).json({ message: "Token no proporcionado" });
    }
};
