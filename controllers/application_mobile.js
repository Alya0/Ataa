const {Beneficiary, Employee} = require('../models')
const {StatusCodes} = require('http-status-codes');

const create_benef = async(req, res)=>{
	try {
		const beneficiary = req.body;
		await Beneficiary.create(beneficiary)
		res.status(StatusCodes.CREATED).json();
	}catch(e){
		res.status(StatusCodes.BAD_REQUEST).json({msg: 'Can\'t submit more than once'})
	}
}

const create_volunteer = async(req, res)=>{
	try{
		const employee = req.body;
		employee.status = 'معلق'
		employee.RoleId = 4
		employee.type = 'متطوع'
		await Employee.create(employee)
		res.status(StatusCodes.CREATED).json();
	}catch(e){
		res.status(StatusCodes.BAD_REQUEST).json({msg: 'Your registration has already been submitted'})
	}
}

module.exports = {
	create_benef, 
	create_volunteer
}