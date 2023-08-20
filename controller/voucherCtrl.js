const Voucher = require("../models/voucherModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//create voucher
const createVoucher = asyncHandler(async (req, res) => {
  try {
    const newVoucher = await Voucher.create(req.body);
    res.json(newVoucher);
  } catch (error) {
    throw new Error(error);
  }
});

//update Voucher
const updateVoucher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateVoucher = await Voucher.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateVoucher);
  } catch (error) {
    throw new Error(error);
  }
});

//get
const getVoucher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getVoucher = await Voucher.findById(id);
    res.json(getVoucher);
  } catch (error) {
    throw new Error(error);
  }
});

//get All Voucher
const getAllVoucher = asyncHandler(async (req, res) => {
  try {
    const getVouchers = await Voucher.find();
    res.json(getVouchers);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Voucher
const deleteVoucher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(id);
    res.json(deletedVoucher);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createVoucher,
  getVoucher,
  getAllVoucher,
  updateVoucher,
  deleteVoucher,
};
