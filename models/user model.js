const mongoose=require('mongoose')
const { timeStamp } = require('node:console')
const { type } = require('node:os')
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lvjjRAVDQ-nBDq_4dy1xCyRjjDaHV-Tqcw&s"
        }
    },{timestamps:true}
)

const User=mongoose.model('User',userSchema)

module.exports=User