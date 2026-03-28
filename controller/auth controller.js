const User=require('../models/user model.js')
const bcryptjs=require('bcryptjs')
const errorhandler=require('../utills/errors');
const jwt=require('jsonwebtoken')
require("dotenv").config();

async function signup(req, res, next) {
  try {
    console.log("REQ BODY:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorhandler(400, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorhandler(409, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    next(err);
  }
}


async function signin(req,res,next){
   const{email,password}=req.body
   try{
       const validuser=await User.findOne({email});
       if(!validuser) return next(errorhandler(404,"User not found!"))
       const validpassword=bcryptjs.compareSync(password,validuser.password) 
       if(!validpassword) return next(errorhandler(404,"Invalid password"))
       const token= jwt.sign({id:validuser._id},process.env.JWT_SECRET)
       const {password:pass, ...rest}=validuser._doc
       res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,        // for localhost
        sameSite: "lax",
        }).status(200).json(rest)
   }
   catch(error){
    next(error)
   }
}

async function handlegoogle(req,res,next){
   try{
       const user=await User.findOne({email:req.body.email})
       if(user){
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        const {password:pass, ...rest}=user._doc
       res.cookie("access_token", token, {
         httpOnly: true,
         secure: false,        // for localhost
         sameSite: "lax",
         }).status(200).json(rest)
       }
       else{
            const generatedpassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashpassword=bcryptjs.hashSync(generatedpassword,10)
            const newUser= new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashpassword,avatar:req.body.photo})
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password:pass, ...rest}=newUser._doc
            res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest)
       }
   }
   catch(error){
      next(error)
   }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return next(errorhandler(404, "User not found"));

    // Update fields only if they exist
    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
}

async function handlesignout(req,res,next){
  try{
     res.clearCookie('access_token');
     res.status(200).json("User has been logged out")
  }
  catch(error){
    next(error)
  }
}



module.exports={
    signup,
    signin,
    handlegoogle,
    updateUser,
    handlesignout
}