const BlogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create
const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newBCategory = await BlogCategory.create(req.body);
    res.json(newBCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//update
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//get Category
const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBCategory = await BlogCategory.findById(id);
    res.json(getBCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//get All Categories
const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const getBCategories = await BlogCategory.find();
    res.json(getBCategories);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBCategory = await BlogCategory.findByIdAndDelete(id);
    res.json(deletedBCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  getBlogCategory,
  getAllBlogCategory,
  deleteBlogCategory,
};
