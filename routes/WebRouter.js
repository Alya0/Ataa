const express = require('express');
const router = express.Router();

//get controllers
const beneficiaryController = require('../controllers/beneficiaries');
const {employeeController} = require('../controllers/employee');
const {projectController} = require('../controllers/project');
const {webAuth} = require('../controllers/webAuth');
const authenticationMiddleware = require('../middleware/auth');
const { upload } = require('../controllers/imagesetter');

//login
router.post('/login', webAuth.login);

//beneficiaries
router.get('/beneficiaries/:status',authenticationMiddleware, beneficiaryController.getAll);
router.route('/beneficiary/create').post(authenticationMiddleware, upload ,beneficiaryController.create);
router.route('/beneficiary/:id').get(authenticationMiddleware, beneficiaryController.getOne).post(authenticationMiddleware, upload ,beneficiaryController.edit).delete(authenticationMiddleware, beneficiaryController.del);


//employee routes
router.route('/employee/create').post(authenticationMiddleware ,upload ,employeeController.create);
router.route('/employee').get(authenticationMiddleware ,employeeController.index);
router.route('/employee/:id').get(authenticationMiddleware ,employeeController.read).delete(authenticationMiddleware ,employeeController.destroy).post(authenticationMiddleware ,upload ,employeeController.update);

//project routes
router.route('/project/add').get(authenticationMiddleware ,projectController.add);
router.route('/project/all').get(authenticationMiddleware ,projectController.index);
router.route('/project/edit/:id').get(authenticationMiddleware ,projectController.edit);
router.route('/project/create').post(authenticationMiddleware ,upload ,projectController.create);
router.route('/project/:id').post(authenticationMiddleware ,upload ,projectController.update).get(authenticationMiddleware ,projectController.read).delete(authenticationMiddleware ,projectController.destroy);

module.exports = router;

