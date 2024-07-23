
const Ad = require('../models/adModel');

const upload = require('../utils/imageHandler');

exports.postAd = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    } else {
      const { title, description, seller, price, contactEmail, contactPhone } = req.body;

      // Validate required fields
      if (!title || !description || !seller || !price || !contactEmail || !contactPhone) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      try {
        const ad = new Ad({
          title,
          description,
          seller,
          price,
          contactEmail,
          contactPhone,
          imageUrl,
        });

        await ad.save();

        res.status(201).json({
          success: true,
          data: ad,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Server Error',
        });
      }
    }
  });
};

exports.getAds = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'datePosted';
  const order = req.query.order || 'desc';

  const query = {};

  // Add filtering conditions here
  if (req.query.title) {
    query.title = new RegExp(req.query.title, 'i'); // Case-insensitive regex match
  }

  if (req.query.priceMin) {
    query.price = { ...query.price, $gte: parseInt(req.query.priceMin) };
  }

  if (req.query.priceMax) {
    query.price = { ...query.price, $lte: parseInt(req.query.priceMax) };
  }

  try {
    const ads = await Ad.find(query)
      .sort([[sortBy, order]])
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Ad.countDocuments(query);

    res.status(200).json({
      success: true,
      count: ads.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
