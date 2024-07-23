
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register User...
registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample id",
      url: "profileUrl",
    },
  });

  await user.save()
  return  res.status(200).json(`Your account has been created, Welcome ${name}`),
  user
 
});

// Login User...
loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return res.status(400).json({message:"Please Enter Email & Password" })
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({message:"Invalid email or password" })
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({message:"Invalid email or password" })
  }

  sendToken(user, 200, res);
});

// Logout User...
logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

// Forget password...
forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({message: "User Not Found"})
  }

  // Get Reset Password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} seccessfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json(error.message)
  }
});

// reset password...
resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log("chala kya");
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({message: "Reset Password Token is invalid or has been expired"});
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({message:"Password does not password"});
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

});

 // Get User Detail...
getUserDetails = catchAsyncErrors(async(req, res)=>{
  const user = await User.findById(req.user.id);
    res.status(200).json({
      success:true,
      user
    })
});

// Update User Password...
updatePassword = catchAsyncErrors(async(req, res)=>{

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return res.status(400).json({message:"Old Password is incorrect"});
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return res.status(400).json({message:"Password does not matched"});
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Updaate User Profile...
updateProfile = catchAsyncErrors(async(req, res)=>{
    const newUserData = {
      name:req.body.name,
      email:req.body.email,
    }

    const user =  await User.findByIdAndUpdate(req.user.id, newUserData, {
      new:true,
      runValidators:true,
      useFindAndModify:false
    });

    res.status(200).json({
      success:true
    })
});

// Get All User...
getAllUser = catchAsyncErrors(async(req, res)=>{
  const users = await User.find();
  res.status(200).json({
    success:true,
    users
  })
});

// Get Single user By Admin...
getSingleUser = catchAsyncErrors(async(req, res)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(400).json(`User does not exist with id ${req.params.id}`)
  }
  res.status(200).json({
    success:true,
    user
  })
});

// Update User Role... Admin
updateUserRole= catchAsyncErrors(async(req, res)=>{
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
 
  const user =  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success:true
  })
});

// Delete Single User... Admin
deleteUser = catchAsyncErrors(async(req, res)=>{
  // remove from cloudNury
  const user  = await User.findById(req.params.id);
  if(!user){
    return res.status(400).json(`user does not exit with id ${req.params.id} Entered`)
  }

  await user.deleteOne();

  res.status(200).json({
    success:true,
    message:"User Deleted Successfully"
  })
});


module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser
}