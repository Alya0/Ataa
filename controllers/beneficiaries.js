const {Beneficiary} = require('../models');
const {StatusCodes} = require('http-status-codes');
const { NotFoundError} = require('../errors');
const {BadRequestError} = require('../errors/bad-request');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

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

const all = {
	getAll, 
	getOne, 
	create, 
	edit,
	del
};

module.exports = {all};
