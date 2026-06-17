const Review = require('../models/reviewModel');
const AppError = require('../utils/appErr');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.getAllReview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const review = await Review.find(filter);

//   if (!review) {
//     return next(new AppError('Invalid review'));
//   }

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       review,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
