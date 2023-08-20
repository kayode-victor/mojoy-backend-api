const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createVoucher,
  updateVoucher,
  getVoucher,
  getAllVoucher,
  deleteVoucher,
} = require("../controller/voucherCtrl");

router.post("/", authMiddleware, isAdmin, createVoucher);
router.put("/:id", authMiddleware, isAdmin, updateVoucher);
router.get("/", getAllVoucher);
router.get("/:id", getVoucher);
router.delete("/:id", authMiddleware, isAdmin, deleteVoucher);

module.exports = router;
