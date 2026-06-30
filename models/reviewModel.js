const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty.'] },
    rating: {
      type: Number,
      min: [1, 'Rating must be over 1.'],
      max: [5, 'Rating must be under 5.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'tour',
    select: 'name photo',
  });
});

reviewSchema.statics.calcRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: new mongoose.Types.ObjectId(tourId) },
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

//not allow duplicate reviews for the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
  await this.constructor.calcRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function () {
  const review = await this.model.findOne(this.getFilter());

  this.tourId = review ? review.tour : null;
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (!this.tourId) return;

  await this.model.calcRatings(this.tourId);
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
