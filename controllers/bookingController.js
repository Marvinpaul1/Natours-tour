const paystack_api = require('paystack-api');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const paystack = paystack_api(process.env.PAYSTACK_SECRET_KEY);
  console.log('paystack key:', process.env.PAYSTACK_SECRET_KEY);
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log('Tour found:', tour);
  // 2) Initialize a Paystack transaction
  // Note: Paystack accepts amounts in lowest currency unit (e.g., Kobo for NGN, Pesewas for GHS)

  const amountInLowestUnit = tour.price * 100;
  const transaction = await paystack.transaction.initialize({
    email: req.user.email,
    amount: amountInLowestUnit,
    currency: 'NGN',
    callback_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    matadata: {
      tourId: tour.id,
      userId: req.user.id,
      custom_fields: [
        {
          display_name: `Tour.Nmae`,
          description: `tour.name`,
          value: tour.name,
        },
        {
          display_name: 'Summary',
          variable_name: 'summary',
          value: tour.summary,
        },
      ],
    },
  });
  console.log(transaction);
  // 3) Send session/transaction data back to client
  res.status(200).json({
    status: 'success',
    data: {
      authorization_url: transaction.data.authorization_url,
      reference: transaction.data.reference,
    },
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only temporary, for testing before deployment, because everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.UpdateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
