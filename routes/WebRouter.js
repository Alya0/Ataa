const express = require('express');
const router = express.Router();

//get controllers
const {beneficiaryController} = require('../controllers/beneficiaries');
const {employeeController} = require('../controllers/employee');
const {projectController} = require('../controllers/project');
const {webAuth} = require('../controllers/webAuth');
const authenticationMiddleware = require('../middleware/auth')
const { upload } = require('../controllers/imagesetter')

//login
router.post('/login', webAuth.login);

//beneficiaries
router.get('/beneficiaries/:status', beneficiaryController.getAll);
router.post('/beneficiary/create',beneficiaryController.create);
router.route('/beneficiary/create').post(upload ,beneficiaryController.create);
router.route('/beneficiary/:id').get(beneficiaryController.getOne).post(upload ,beneficiaryController.edit).delete(beneficiaryController.del);

//employee routes
router.route('/employee/create').post(authenticationMiddleware ,upload ,employeeController.create);
router.route('/employee/:id').get(authenticationMiddleware ,employeeController.read).delete(authenticationMiddleware ,employeeController.destroy).post(authenticationMiddleware ,upload ,employeeController.update);

//project routes
router.route('/project/create').post(authenticationMiddleware ,upload ,projectController.create);
router.route('/project/:id').post(authenticationMiddleware ,upload ,projectController.update).get(authenticationMiddleware ,projectController.read).delete(authenticationMiddleware ,projectController.destroy);

module.exports = router;

