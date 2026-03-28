const jwt = require("jsonwebtoken");
const errorhandler = require("./errors.js");


 function verifyToken(req,res,next) {
    const token=req.cookies.access_token;
    if(!token) return next(errorhandler(401,"invalid_user"));
     jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorhandler(401,"Forbidden"));
        req.user=user;
        next();
        console.log("Cookies:", req.cookies);
    })
}

module.exports={
    verifyToken
}