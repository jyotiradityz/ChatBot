import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {

    // console.log(req.cookies.jwt);
    
    
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send("You are not Authenticated");
    }
    jwt.verify(token, process.env.JWT_KEY,async(err,payload)=>{
        if(err){
            return res.status(403).send("Token Expired");
        }
        
        req.userId = payload.userID;
        next();
    })
    // next();
}