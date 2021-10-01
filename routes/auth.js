const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require('../controllers/auth')
const { validationRules, validation } = require('../validators/index')

router.post('/signup',validationRules(),validation(),signup);
router.post('/signin', signin)
router.get('/signout',signout);


module.exports = router;