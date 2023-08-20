const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

//create Blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//update Blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get Blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get All Blog
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//like Blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find blog which want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  //find if user liked the post before
  const isLiked = blog?.isLiked;
  //find the user if he disliked the blog
  const alreadyDisliked =
    Array.isArray(blog?.dislikes) &&
    blog.dislikes.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
  if (alreadyDisliked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  } else if (isLiked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  }
});

//dislike Blog
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find blog which want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  //find if user liked the post before
  const isDisliked = blog?.isDisliked;
  //find the user if he disliked the blog
  const alreadyLiked =
    Array.isArray(blog?.likes) &&
    bloglikes.find((userId) => userId?.toString() === loginUserId?.toString());
  if (alreadyLiked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  } else if (isDisliked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(updatedBlog);
  }
});

//upload image
const uploadBlogImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// delete image to the cloud
const deleteBlogImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadBlogImages,
  deleteBlogImages,
};
