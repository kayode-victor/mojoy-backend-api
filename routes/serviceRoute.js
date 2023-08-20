const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  serviceImgResize,
} = require("../middlewares/uploadImages");
const {
  createService,
  updateService,
  getService,
  getAllService,
  deleteService,
  deleteServiceImages,
  uploadServiceImages,
} = require("../controller/serviceCtrl");

router.post("/", authMiddleware, isAdmin, createService);
router.put(
  "/upload/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 3),
  serviceImgResize,
  uploadServiceImages
);
router.put("/:id", authMiddleware, isAdmin, updateService);
router.get("/:id", getService);
router.get("/", getAllService);
router.delete("/:id", authMiddleware, isAdmin, deleteService);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteServiceImages);

module.exports = router;
