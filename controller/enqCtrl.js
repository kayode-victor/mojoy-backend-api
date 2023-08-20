const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

//get
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getEnquiry = await Enquiry.findById(id);
    res.json(getEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// update
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

//get All
const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const getEnquiries = await Enquiry.find();
    res.json(getEnquiries);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  getEnquiry,
  getAllEnquiry,
  deleteEnquiry,
  updateEnquiry,
};
