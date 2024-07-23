

const express = require('express');
const { postBusiness } = require('../controls/businessController');

const router = express.Router();



router.post('/post_wares', postBusiness);




module.exports = router;
