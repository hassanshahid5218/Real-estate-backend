const Listing = require("../models/listing model.js")
const User = require("../models/user model.js")
const errorhandler = require("../utills/errors.js")
const bcrypt=require('bcryptjs')
async function test(req,res){
   res.json({
    message:"Hello world"
   })
}

async function updateuserinfo( req,res,next){
   if (req.user.id !== req.params.id)
    return next(errorhandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

async function deleteuser(req,res,next){
  if(req.user.id!==req.params.id) return next(errorhandler(401,"You can delete only you own account"))
   try{
     await User.findByIdAndDelete(req.params.id)
     res.clearCookie('access_token');
     res.status(200).json("User is deleted Successfully");
   }
catch(error){
   next(error)
} 
}

async function getUserListing(req,res,next){
  if(req.user.id===req.params.id){
    try{
       const listing=await Listing.find({userRef:req.params.id})
       res.status(200).json(listing)
    }
    catch(error){
         next(error)
    }
  }
  else{
     return next(errorhandler(401,"You can view only your own listing!"))
  }
}

async function getUser(req,res,next) {
    try{
       const user=await User.findById(req.params.id);
       if(!user) return next(errorhandler(404,"User not found"));
       const {password:pass,...rest}=user._doc;
       res.status(200).json(rest)
       
    }
    catch(error){
            next(error)
    }
}

module.exports={
    test,updateuserinfo,deleteuser,getUserListing,getUser
}