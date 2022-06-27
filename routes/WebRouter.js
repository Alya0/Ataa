const express = require('express');
const router = express.Router();

//get controllers
const {all} = require('../controllers/beneficiaries')
const {employeeController} = require('../controllers/employee');
const {projectController} = require('../controllers/project');

//beneficiaries
router.get('/beneficiaries/:status', all.getAll);
router.post('/beneficiary/create',all.create);
router.route('/beneficiary/:id').get(all.getOne).post(all.edit).delete(all.del);

//employee routes
router.route('/employee/create').post(employeeController.create);
router.route('/employee/:id').get(employeeController.read).delete(employeeController.destroy).post(employeeController.update);

//project routes
router.route('/project/create').post(projectController.create);
router.route('/project/:id').post(projectController.update).get(projectController.read).delete(projectController.destroy);

module.exports = router;

