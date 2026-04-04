const listing=require('../models/listing model.js');
const User = require('../models/user model.js');
const errorhandler = require('../utills/errors.js');

async function creatingList(req,res,next){
    try{
        console.log("REQ.USER:", req.user); // debug
        console.log("REQ.BODY:", req.body); // debug

    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const newListing = new listing({
      ...req.body,
      userRef: req.user.id || req.user._id,
    });

    console.log("NEW LISTING:", newListing); // debug

    const savedListing = await newListing.save();

    console.log("SAVED LISTING:", savedListing); // debug

    return res.status(201).json(savedListing);
    }
    catch(error){
       console.log("ERROR CREATING LISTING:", error);
       next(error)
    }
}

async function deleteListing(req,res,next){
   const Listing=await listing.findById(req.params.id)
   if(!Listing){
    return next(errorhandler(404,"Listing not found"));
   }
   if(String(req.user.id)!==String(Listing.userRef)){
    return next(errorhandler(403,"You can delete only your own listing"))
   }
   try{
      await listing.findByIdAndDelete(req.params.id)
      res.status(200).json("Deleted Successfully")
   }
   catch(error){
        next(error)
   }
}

async function updateListing(req,res,next){
   const Listing=await listing.findById(req.params.id)
   if(!Listing){
    return next(errorhandler(404,"Listing not found"));
   }
   if(String(req.user.id)!==String(Listing.userRef)){
    return next(errorhandler(403,"You can update only your own listing"))
   } 
   try{
    const updatedList=await listing.findByIdAndUpdate(req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedList)
   }
   catch(error){
    next(error)
   }
}

async function getListing(req,res,next){
   try{
       const Listing= await listing.findById(req.params.id);
       if(!Listing){
        return next(errorhandler(401,"Listing not found"))
       }
       res.status(200).json(Listing)
   }  
   catch(error){
       next(error)
   } 
}

async function getListings(req,res,next){
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sell', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}


module.exports={
    creatingList,deleteListing,updateListing,getListing,getListings
}