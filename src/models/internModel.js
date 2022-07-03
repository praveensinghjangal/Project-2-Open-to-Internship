const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const internSchema = new mongoose.Schema({
name:{type:String,
    require:"Please enter your name",
    trim:true
   },
  email:{
    type:String,
    require:"Please provide email",
    unique:true,
    trim:true,
    lowercase: true
  },
 mobile:{type:Number,
    require:"Please provide contact details",
    unique:true,
    trim:true   
 },
collegeId:{ type:objectId,
    ref:"College",
    require:"Please enter college Id"
},
 isDeleted:{
    type:Boolean,
    default:false
 }

}, {timetamps:true});
module.exports=mongoose.model('Intern', internSchema)
