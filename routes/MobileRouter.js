const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/auth');

//get controllers
const mobileAuthController = require('../controllers/mobileAuth')
const userController = require('../controllers/user')

// auth routes
router.post('/login', mobileAuthController.login)
router.post('/register', mobileAuthController.register)
router.post('/register/verify', mobileAuthController.verifyRegister)
router.post('/register/code', mobileAuthController.resendCode)

//user routes
router.use('/profile', authenticateUser)
router.get('/profile', userController.get)
router.post('/profile',userController.edit)

module.exports = router

