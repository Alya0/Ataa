const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/auth');

//get controllers
const mobileAuthController = require('../controllers/mobileAuth')
const userController = require('../controllers/user')
const projectsController = require('../controllers/projects_moblie')
const donationController = require('../controllers/donation')

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


//project route
router.get('/projects', projectsController.getAll)
router.get('/projects/ads', projectsController.getThreeProjects)
router.get('/projects/:tag', projectsController.getByTag)

//donation routes
router.post('/donate', authenticateUser, donationController.donate)
// router.use('/donate/success/:value/:ProjectId/:UserId',express.static('./public'));
router.get('/donate/success/:value/:ProjectId/:UserId', donationController.donation_success)
router.get('/donate/cancel', donationController.donation_cancel)

//token check
router.get('/tokencheck', authenticateUser, (req, res)=>{
	res.status(200).send()
})

//data needed for front
router.get('/data/miskeen',projectsController.getMiskeenVal)
router.get('/data/sacrifice',projectsController.getSacrificeVal)

module.exports = router

