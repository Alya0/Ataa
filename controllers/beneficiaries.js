const {Beneficiary , Ben_Cat} = require('../models')
const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const {sendEmail} = require('../emailMessaging')

const getAll = async(req, res)=>{
	const {status} = req.params
	let beneficiaries;
	if(status == 'all'){
		beneficiaries = await Beneficiary.findAll()
	}
	else{
		beneficiaries = await Beneficiary.findAll({
			where:{
				application_status : status
			}
		})
	}
	res.status(StatusCodes.OK).json(beneficiaries)
}

const create = async(req, res)=>{
	const beneficiary = await Beneficiary.create({...req.body})
	const categories = req.body.categories
	categories.forEach(async(element) =>{
		await Ben_Cat.create({BeneficiaryId : beneficiary.id, CategoryId : element})
	})
	res.status(StatusCodes.CREATED).json({beneficiary})
}

const getOne = async(req, res)=>{
	const {id} = req.params
	const beneficiary = await Beneficiary.findByPk(id)
	if( !beneficiary ){
		throw new NotFoundError(`No beneficiary with id ${id}`)
	}
	beneficiary.dataValues.categories = await Ben_Cat.findAll({
		attributes : ['CategoryId'],
		where : {BeneficiaryId : beneficiary.id}
	})
	res.status(StatusCodes.OK).json(beneficiary)
}


const edit = async(req, res)=>{
	const {id} = req.params
	const beneficiary = await Beneficiary.findByPk(id)
	if(!beneficiary){
		throw new NotFoundError(`No beneficiary with id ${id}`)
	}
	if(req.body.application_status === 'accepted'){
		await sendEmail(beneficiary.full_name, beneficiary.email)
	}
	const categories = req.body.categories
	if(categories){
		await Ben_Cat.destroy({
			where : {BeneficiaryId : beneficiary.id}
		})
		categories.forEach(async(element) =>{
			await Ben_Cat.create({BeneficiaryId : beneficiary.id, CategoryId : element})
		})
	}
	await beneficiary.update(req.body)
	res.status(StatusCodes.OK).json(beneficiary)
}


const del = async(req, res)=>{
	const {id} = req.params
	const beneficiary = await Beneficiary.findByPk(id)
	if(!beneficiary){
		throw new NotFoundError(`No beneficiary with id ${id}`)
	}
	await beneficiary.destroy()
	res.status(StatusCodes.OK).send()
}


module.exports = {
	getAll, 
	getOne, 
	create, 
	edit,
	del
}
