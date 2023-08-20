const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Voucher = require("../models/voucherModel");
const Order = require("../models/orderModel");

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");

// create User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User Already exists
    throw new Error("User Already Exists");
  }
});

// login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findAdmin = await User.findOne({ email });
  //check if user is admin
  if (findAdmin.role !== "admin") throw new Error("Not authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?.id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is somethong wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout Functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: " " });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //forbidden
});

// Update a User
const updateaUser = asyncHandler(async (req, res) => {
  console.log();
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateaUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateaUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Save user Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get single User
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete User
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Block User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      messege: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      messege: "User Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// Generate Password Token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this Email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi Please follow this link to reset your Password. This link is valid for 10 minutes from now. <a href="http://localhost:3000/reset-password/${token}">Click Here</a>`;

    const emailData = {
      email: email,
      subject: "Reset Password Link",
      message: "Hey user",
      activationUrl: resetURL,
    };

    sendEmail(emailData, () => {
      console.log(`Email sent to ${email}`);
      res.json(token);
    });
  } catch (error) {
    console.log(`Error occurred while generating password token: ${error}`);
    throw new Error(error);
  }
});

// ResetPassword
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if the expiration time is greater than the current time
  });

  if (!user) {
    throw new Error("Token Expired or Invalid. Please try again.");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

//wishlist
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Cart
const userCart = asyncHandler(async (req, res) => {
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      quantity,
      price,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//view cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
//update quantity from cart
const updateQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({
      userId: _id,
      _id: cartItemId,
    });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

//remove from cart
const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount } =
    req.body;
  const { _id } = req.user;
  // Extract the paymentId from the paymentInfo array
  const paymentId = req.body.paymentInfo.payPaymentId;
  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo: {
        payPaymentId: paymentId,
      },
      user: _id,
    });
    res.json({ order, success: true });
  } catch (error) {
    throw new Error(error);
  }
});

const getMyOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product");
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({ userId: _id });
    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color"); // Populate the 'color' field inside 'orderItems'

    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findOne({ _id: id }).populate("orderItems");
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id);
    orders.orderStatus = req.body.status;
    await orders.save();
    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  getMyOrder,
  emptyCart,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  createOrder,
  removeProductFromCart,
  updateQuantityFromCart,
};
