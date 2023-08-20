const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createAdvert,
  updateAdvert,
  deleteAdvert,
  getAdvert,
  getAllAdvert,
} = require("../controller/advertCtrl");

router.post("/", authMiddleware, isAdmin, createAdvert);

router.put("/:id", authMiddleware, isAdmin, updateAdvert);
router.delete("/:id", authMiddleware, isAdmin, deleteAdvert);
router.get("/:id", getAdvert);
router.get("/", getAllAdvert);

module.exports = router;
