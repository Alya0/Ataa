
const {Beneficiary , Ben_Cat} = require('../models')
const {StatusCodes} = require('http-status-codes');
const { NotFoundError} = require('../errors');
const {BadRequestError} = require('../errors/bad-request');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);
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
};

const create = async(req, res)=>{
	if(req.user.username === "Project_Manager"){
		throw new BadRequestError('You Do not have the permission');
	}
	const beneficiary = {...req.body};
	if (!req.file)
		beneficiary.image = null;
	else
		beneficiary.image = req.file.path;
	await Beneficiary.create(beneficiary);
  const categories = req.body.categories
  // TODO : make categories list it is currently a string
	categories.forEach(async(element) =>{
		await Ben_Cat.create({BeneficiaryId : beneficiary.id, CategoryId : element})
	})
	res.status(StatusCodes.CREATED).json(beneficiary);
};


const getOne = async(req, res)=>{
	if(req.user.username === "Project_Manager"){
		throw new BadRequestError('You Do not have the permission');
	}
	const {id} = req.params;
	const beneficiary = await Beneficiary.findByPk(id);
	if( !beneficiary ){
		throw new NotFoundError(`No beneficiary with id ${id}`);
	}
	beneficiary.dataValues.categories = await Ben_Cat.findAll({
		attributes : ['CategoryId'],
		where : {BeneficiaryId : beneficiary.id}
	})
	res.status(StatusCodes.OK).json(beneficiary)
};

const edit = async(req, res)=>{
	if(req.user.username === "Project_Manager"){
		throw new BadRequestError('You Do not have the permission');
	}
	const {id} = req.params;
	const beneficiary = await Beneficiary.findByPk(id);
	if(!beneficiary){
		throw new NotFoundError(`No beneficiary with id ${id}`);
	}
	const benef = {...req.body};
	if (beneficiary.image && req.file){
		const p = beneficiary.image;
		await unlinkAsync(p);
		benef.image = req.file.path;
	}
	else if(req.file){
		benef.image = req.file.path;
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
	await beneficiary.update(benef);
	res.status(StatusCodes.OK).json(beneficiary);
};
	



const del = async(req, res)=>{
	if(req.user.username === "Project_Manager"){
		throw new BadRequestError('You Do not have the permission');
	}
	const {id} = req.params;
	const beneficiary = await Beneficiary.findByPk(id);
	if(!beneficiary){
		throw new NotFoundError(`No beneficiary with id ${id}`)
	}
	if (beneficiary.image)
		await unlinkAsync(beneficiary.image);
	await beneficiary.destroy();
	res.status(StatusCodes.OK).send()
};

module.exports = {
	getAll, 
	getOne, 
	create, 
	edit,
	del
};

