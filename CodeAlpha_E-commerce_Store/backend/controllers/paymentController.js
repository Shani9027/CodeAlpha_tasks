const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;
  if (!amount) {
    res.status(400);
    throw new Error('Amount is required');
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.json({ clientSecret: 'test_mock_secret', liveMode: false });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency || 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret, liveMode: true });
});
