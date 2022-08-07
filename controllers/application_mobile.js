const {Beneficiary, Employee} = require('../models')
const {StatusCodes} = require('http-status-codes');

const create_benef = async(req, res)=>{
	const beneficiary = req.body;
	await Beneficiary.create(beneficiary)
	res.status(StatusCodes.CREATED).json();
}

const create_volunteer = async(req, res)=>{
	const employee = req.body;
	employee.status = 'معلق'
	employee.RoleId = 4
	employee.type = 'متطوع'
	await Employee.create(employee)
	res.status(StatusCodes.CREATED).json();
}

module.exports = {
	create_benef, 
	create_volunteer
}