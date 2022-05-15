const express = require('express')
const router = express.Router()

//get controllers
const BenefController = require('../controllers/beneficiaries')


// beneficiaries
router.get('/beneficiary/all/:status', BenefController.getAll)
router.post('/beneficiary/create',BenefController.create)
router.route('/beneficiary/:id').get(BenefController.getOne).post(BenefController.edit).delete(BenefController.del);

module.exports = router

