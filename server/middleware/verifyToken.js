import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next)=> {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({error: "Unauthorized - No Token Provided"})
    jwt.verify(token, "Bhun-er", (err, user) => {
        if (err) return res.status(401).json({error: "Unauthorized - No Token Provided"})
        
        req.user = user;
        next();
    });

}