const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/auth');

//get controllers
const mobileAuthController = require('../controllers/mobileAuth')
const userController = require('../controllers/user')
const projectsController = require('../controllers/projects_moblie')

// auth routes
router.post('/login', mobileAuthController.login)
router.post('/register', mobileAuthController.register)
router.post('/register/verify', mobileAuthController.verifyRegister)
router.post('/register/code', mobileAuthController.resendCode)

//user routes
router.use('/profile', authenticateUser)
router.get('/profile', userController.get)
router.post('/profile',userController.edit)
router.get('/profile/donations',userController.getDonations)

//donation routes
router.use('/donate', authenticateUser)
router.post('/donate', userController.donate)

//project route
router.get('/projects', projectsController.getAll)
router.get('/project/:id', projectsController.getOne)

//token check
router.get('/tokencheck', authenticateUser, (req, res)=>{
	res.status(200).send()
})

module.exports = router

