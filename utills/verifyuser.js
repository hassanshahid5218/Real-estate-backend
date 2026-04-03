const jwt = require("jsonwebtoken");
const errorhandler = require("./errors.js");


 function verifyToken(req,res,next) {
    const token=req.cookies.access_token;
    console.log("Verify Token - Cookies received:", Object.keys(req.cookies));
    console.log("Access token:", token ? "exists" : "missing");
    if(!token) return next(errorhandler(401,"invalid_user"));
     jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) {
          console.log("JWT verification error:", err.message);
          return next(errorhandler(401,"Forbidden"));
        }
        req.user=user;
        next();
    })
}

module.exports={
    verifyToken
}