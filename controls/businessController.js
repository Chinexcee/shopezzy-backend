
const Business = require('../models/businessModel');
const auth = require("../middlewares/auth")


exports.postBusiness = async (req, res) => {
  const { name, description, businessname, CAC_number, business_address, home_address, contactEmail, contactPhone } = req.body;

  try {
    const business = new Business({
      name,
      description,
      businessname,
      CAC_number, 
      business_address, 
      home_address,
      contactEmail,
      contactPhone,
    });


    await business.save();

    res.status(201).json({
      message: "You've uploaded your business successfully!",
      data: business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

