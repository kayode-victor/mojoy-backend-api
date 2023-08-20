const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadBlogImages,
  deleteBlogImages,
} = require("../controller/blogCtrl");

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 3),
  blogImgResize,
  uploadBlogImages
);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteBlogImages);

module.exports = router;
