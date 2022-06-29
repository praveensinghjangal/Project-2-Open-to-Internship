const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const validator = require('validator')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true;
}

const bodyValidator = function (details) {
    return Object.keys(details).length > 0
}

const regxValidator = function(val){
    let regx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
    return regx.test(val);
}

const regexValidator = function(val){
    let regx = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)$/g
    return regx.test(val);
}
const regexNumber = function(val){
    let regx = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    return regx.test(val);
}

const createCollege = async function(req,res){
    try {
       const details = req.body;
       if (!bodyValidator(details)) return res.status(400).send({ status: false, msg: "details is required in body" })
       if (!isValid(details.name) || !regxValidator(details.name))return res. status(400).send({status:false,msg:"Please enter name correctly"});
       if(!isValid(details.fullName))return res.status(400).send({status:false,msg:"Please enter fullName correctly"});
       if(!isValid(details.logoLink) || !regexValidator(details.logoLink))return res.status(400).send({status:false,msg:"Please enter login link correctly"});

       let usedName = await collegeModel.findOne({ name: details.name })
        if (usedName) return res.status(400).send({ status: false, msg: `${details.name} already created`})
   
       const data =await collegeModel.create(details)
       res.status(201).send({status: true, msg :"all data is created sucessfuly",data:data})
       }
   
   catch(err){res.status(500).send({status:false,error:err.message})}
   }

   const createIntern = async function (req, res) {
    try {
      let data = req.body
      if (!bodyValidator(data)) return res.status(400).send({ status: false, msg: "details is required in body" })
      if (!isValid(data.name) || !regxValidator(data.name)) {return res.status(400).send({ status: false, msg: "Intern name is required" })}
      if (!isValid(data.mobile) || !regexNumber(data.mobile)) {return res.status(400).send({ status: false, msg: "Please enter mobile number correctly" })}
      if (!isValid(data.email)){return res.status(400).send({ status: false, msg: "Intern email is required" })}
      if (!isValid(data.collegeName)) {return res.status(400).send({ status: false, msg: "College name is required is required" })}

      if (!(validator.isEmail(data.email))) return res.status(400).send({ status: false, msg: "please enter a valid email" })
      
      const checkMobile = await internModel.findOne({mobile:data.mobile})
      if(checkMobile){return res.status(400).send({ status: false, msg: "Mobile number is already used" })}

      const checkEmailId =await internModel.findOne({email:data.email})
      if(checkEmailId){return res.status(400).send({ status: false, msg: "email is already used" })}

      let collegeId = await collegeModel.findOne({$or: [ {name : `${data.collegeName}` } , { fullName: `${data.collegeName}` }]}).select({_id:1})
      if(!collegeId){return res.status(400).send({status: false, msg: "No such college is available"})}

      let internData = {
        "name": data.name,
        "mobile": data.mobile,
        "email":data.email,
        "collegeId":collegeId._id
    }
let intern =  await internModel.create(internData)
return  res.status(201).send({data: intern })
      
    }
  catch (error) {res.status(500).send({ msg: error.message })}
}

const getInternsInCollege = async function (req, res) {
    try { 
       let collegeName = req.query.collegeName
       
       let obj = {
           isDeleted: false
       }
   
       if (collegeName) {
           obj.name = collegeName
       }else{return res.status(400).send({status : false , msg : "please enter College Name"})}
       
   
       let savedData = await collegeModel.findOne(obj).select({name:1, fullName:1, logoLink:1, _id: 1})
       if (!savedData) {return res.status(400).send({ status: false, msg: "No such College Available" })}
       let internData = await internModel.find({isDeleted: false, collegeId:savedData._id}).select({name:1, email:1, mobile:1, _id:1})
       if(internData.length === 0){return res.status(400).send({ status: false, msg: "No Intern Available in this College" })}
       
       let finalData = {
        "name": savedData.name,
        "fullName": savedData.fullName,
        "logoLink": savedData.logoLink,
        "interns": internData
        }
        return res.status(200).send({data: finalData})

   
   
   } catch(err){
         return  res.status(500).send({ msg: err.message })
       }
    }
module.exports.createCollege = createCollege
module.exports.createIntern = createIntern
module.exports.getInternsInCollege = getInternsInCollege
    