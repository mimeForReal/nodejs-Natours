const express = require('express');
const {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourIdUser,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(getReviews)
  .post(restrictTo('user'), setTourIdUser, createReview);
router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
