const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  unblockUser,
  blockUser,
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
  emptyCart,
  // applyVoucher,
  createOrder,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  removeProductFromCart,
  updateQuantityFromCart,
  getMyOrder,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/adminlogin", loginAdmin);
// router.post("/cart/applyvoucher", authMiddleware, applyVoucher);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/all-users", getallUser);
router.get("/get-my-orders", authMiddleware, getMyOrder);

router.get("/get-order", authMiddleware, getSingleOrder);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
// router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.put("/order/update_status/:id", authMiddleware, isAdmin, updateOrder);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishList);
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  authMiddleware,
  updateQuantityFromCart
);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProductFromCart
);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);

router.put("/edit-user", authMiddleware, updateaUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
