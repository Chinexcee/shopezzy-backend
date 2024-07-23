
const express = require('express');
const { postAd, getAds } = require('../controls/adController');



const router = express.Router();






router.post('/ad', postAd);
router.get('/fetch', getAds);





module.exports = router;
