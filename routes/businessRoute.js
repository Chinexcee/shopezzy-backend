const express = require('express');
const { postBusiness } = require('../controls/businessController');
const auth = require("../middlewares/auth")

const router = express.Router();



router.post("/register_biz", postBusiness);




module.exports = router;



