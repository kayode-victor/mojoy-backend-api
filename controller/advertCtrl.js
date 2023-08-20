const Advert = require("../models/advertModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create
const createAdvert = asyncHandler(async (req, res) => {
  try {
    const newAdvert = await Advert.create(req.body);
    res.json(newAdvert);
  } catch (error) {
    throw new Error(error);
  }
});

//update
const updateAdvert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateAdvert = await Advert.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateAdvert);
  } catch (error) {
    throw new Error(error);
  }
});

//get
const getAdvert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getAdvert = await Advert.findById(id);
    res.json(getAdvert);
  } catch (error) {
    throw new Error(error);
  }
});

//get All
const getAllAdvert = asyncHandler(async (req, res) => {
  try {
    const getAdverts = await Advert.find();
    res.json(getAdverts);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete
const deleteAdvert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedAdvert = await Advert.findByIdAndDelete(id);
    res.json(deletedAdvert);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createAdvert,
  updateAdvert,
  getAdvert,
  getAllAdvert,
  deleteAdvert,
};
