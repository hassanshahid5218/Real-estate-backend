// const path = require('path');
// require('dotenv').config({
//   path: path.join(__dirname, '.env')
// });
// // dotenv.config();
// console.log("ENV CHECK:", process.env.MONGO_URL);
// const exp=require("express")
// const app=exp()
// const PORT=5000
// const mongoose=require('mongoose')
// const UserRoute=require('./routes/userroutes.js')
// const authRoute=require('./routes/authroutes.js')
// const listingRoute=require('./routes/listingRoute.js')
// const cookieParser = require("cookie-parser");



// // mongoose.connect(process.env.MONGO).then(()=>{
// //      console.log("database connected successfully")
// // }).catch((error)=>{
// //     console.log(error)
// // })
//  const cors = require("cors");

// app.use(
//   cors({
//     origin: "http://localhost:5175",
//     credentials: true,
//   })
// ); 
// app.use(exp.json());
// app.use(cookieParser());
// app.use(exp.urlencoded({ extended: true }));

// mongoose.connect(process.env.MONGO_URL).then(()=>{
//      console.log("database connected successfully")
// }).catch((error)=>{
//     console.log(error)
// })

// app.use('/api/user',UserRoute)
// app.use('/api/auth',authRoute)
// app.use('/api/listing',listingRoute)

// app.use((err,req,res,next)=>{
//     const statusCode=err.statusCode||500;
//     const msg=err.message||"Internal server error";
//     return res.status(statusCode).json({
//         success:false,
//         statusCode,
//         msg
//     });
// })

// app.listen(PORT,()=>{
//     console.log(`server started at port ${PORT}`);
// })

const exp = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ❌ REMOVE dotenv (Vercel handles env automatically)
// ❌ REMOVE path config
// ❌ REMOVE app.listen

const app = exp();

// routes
const UserRoute = require("../routes/userroutes.js");
const authRoute = require("../routes/authroutes.js");
const listingRoute = require("../routes/listingRoute.js");

// middleware
app.use(exp.json());
app.use(cookieParser());
app.use(exp.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true, // allow all (or set your frontend URL later)
    credentials: true,
  })
);

// ✅ MongoDB connection (important for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};

// call DB
connectDB();

// routes
app.use("/api/user", UserRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

// error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    msg,
  });
});

// ✅ EXPORT (NO app.listen)
module.exports = app;