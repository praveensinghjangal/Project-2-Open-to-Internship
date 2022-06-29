const  mongoose = require("mongoose");

const collegeSchema =new mongoose.Schema({
    name:{
        type:String,
        require:"Unabbreviated College Name is required",
        unquie:true },

    fullName:{
        type:String,
        require:"Full name of college is required" },

    logoLink:{
        type:String,
    require:"Please provide the logo link"},

    isDeleted:{
        type:Boolean,
        default:false },
},{timestamps:true});

module.exports=mongoose.model("College",collegeSchema)
