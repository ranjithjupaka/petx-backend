const express = require('express')
const router = express.Router()
const { create,categoryById,read,remove,update,list } = require('../controllers/category')
const { requireSignin,isAdmin,isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
)
router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
)
router.get('/categories',list)

router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router
