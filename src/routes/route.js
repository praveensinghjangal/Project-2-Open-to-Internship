const express = require('express');
const router = express.Router();
const Controller= require("../controllers/controller");

router.post("/functionup/colleges", Controller.createCollege)

router.post("/functionup/interns", Controller.createIntern)

router.get("/functionup/collegeDetails", Controller.getInternsInCollege)

module.exports = router;