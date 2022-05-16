const express = require('express');
const router = express.Router();

//get controllers
const {all} = require('../controllers/beneficiaries')
const {employeeController} =require('../controllers/employee');

//beneficiaries
router.get('/beneficiaries/:status', all.getAll)
router.post('/beneficiary/create',all.create)
router.route('/beneficiary/:id').get(all.getOne).post(all.edit).delete(all.del);

//employee routes
router.route('/employee/create').post(employeeController.create);
router.route('/employee/:id').get(employeeController.read).delete(employeeController.destroy).post(employeeController.update);

module.exports = router;

