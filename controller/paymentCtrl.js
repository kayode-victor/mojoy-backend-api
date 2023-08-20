const Paystack = require("paystack");
require("dotenv").config();

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystack = new Paystack(paystackSecretKey);

const checkout = async (req, res) => {
  const option = {
    amount: 10000, // Replace with your desired amount in kobo (Paystack uses kobo as the base currency unit)
    currency: "NGN", // Change to your desired currency code
  };

  const { data } = await paystack.transaction.initializeTransaction(option);
  const authorization_url = data.authorization_url;
  res.json({
    success: true,
    authorization_url,
  });
};

const paymentVerification = async (req, res) => {
  const { payOrderId, payPaymentId } = req.body;
  res.json({
    payOrderId,
    payPaymentId,
  });
};

module.exports = {
  checkout,
  paymentVerification,
};
