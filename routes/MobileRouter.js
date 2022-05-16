const express = require('express')
const router = express.Router()

//get controllers
const mobileAuthController = require('../controllers/mobileAuth')


// auth routes
router.post('/login', mobileAuthController.login)
router.post('/register', mobileAuthController.register)
router.post('/register/verify', mobileAuthController.verifyRegister)

module.exports = router

