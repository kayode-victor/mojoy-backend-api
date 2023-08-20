const Service = require("../models/serviceModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

//create Service
const createService = asyncHandler(async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.json(newService);
  } catch (error) {
    throw new Error(error);
  }
});

//update Service
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateService);
  } catch (error) {
    throw new Error(error);
  }
});

//get Servive
const getService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getService = await Service.findById(id);
    res.json(getService);
  } catch (error) {
    throw new Error(error);
  }
});

//get All Services
const getAllService = asyncHandler(async (req, res) => {
  try {
    const getServices = await Service.find();
    res.json(getServices);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Service
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    res.json(deletedService);
  } catch (error) {
    throw new Error(error);
  }
});

//upload image to the cloud
const uploadServiceImages = asyncHandler(async (req, res) => {
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
const deleteServiceImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createService,
  updateService,
  getService,
  getAllService,
  deleteService,
  uploadServiceImages,
  deleteServiceImages,
};
