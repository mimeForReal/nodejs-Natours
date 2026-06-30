const express = require('express');

const {
  getUsers,
  getUser,
  updateMe,
  deleteMe,
  updateUser,
  getMe,
  deleteUser,
  createUser,
  updateUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');
const {
  signup,
  login,
  resetPassword,
  forgetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgetpassword').post(forgetPassword);
router.route('/resetpassword/:token').patch(resetPassword);

router.use(protect);
router.route('/updatemypassword').patch(updatePassword);
router.route('/updateme').patch(updateUserPhoto, resizeUserPhoto, updateMe);
router.route('/deleteme').delete(deleteMe);
router.route('/me').get(getMe, getUser);

router.use(restrictTo('admin'));
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
