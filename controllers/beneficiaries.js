
const {Beneficiary , Ben_Cat, Benefit, Project, sequelize} = require('../models')
const {StatusCodes} = require('http-status-codes');
const { NotFoundError} = require('../errors');
const {BadRequestError} = require('../errors/bad-request');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);
const {sendEmail} = require('../emailMessaging')

const getAll = async(req, res)=>{
	if(req.user.username === "مدير مشاريع"){
		return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
	}
	const {status} = req.params
	let beneficiaries;
	if(status == 'all'){
		beneficiaries = await Beneficiary.findAll({
			attributes:['id','full_name','birth_date','application_status','gender','province']
		})
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
	if(req.user.username === "مدير مشاريع"){
		return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
	}
	const beneficiary = {...req.body};
	if (!req.file)
		beneficiary.image = null;
	else
		beneficiary.image = req.file.path;
	const ben = await Beneficiary.create(beneficiary);
	let categories = JSON.parse(req.body.benCategories);
	categories.forEach(async(element) =>{
		await Ben_Cat.create({BeneficiaryId : ben.id, CategoryId : element})
	});
	res.status(StatusCodes.CREATED).json(beneficiary);
};

const getOne = async(req, res)=>{
	if(req.user.username === "مدير مشاريع"){
		return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
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

	const [results, metadata] = await sequelize.query(`
	SELECT projects.id AS ProjectId , projects.name , projects.project_type AS type FROM benefits
	INNER JOIN projects ON projects.id = benefits.ProjectId
	WHERE benefits.BeneficiaryId = ${beneficiary.id}
	`)
	beneficiary.dataValues.projects = results
	res.status(StatusCodes.OK).json({beneficiary})
};

const edit = async(req, res)=>{
	if(req.user.username === "مدير مشاريع"){
		return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
	}
	const {id} = req.params;
	const beneficiary = await Beneficiary.findByPk(id);
	if(!beneficiary){
		throw new NotFoundError(`No beneficiary with id ${id}`);
	}
	const benef = {...req.body};
	if(benef.image === 'null'){
		benef.image = beneficiary.image;
	}
	else if (beneficiary.image && req.file){
		const p = beneficiary.image;
		await unlinkAsync(p);
		benef.image = req.file.path;
	}
	else if(req.file){
		benef.image = req.file.path;
	}
  if(req.body.application_status === 'accepted' || req.body.application_status === 'مقبول'){
		sendEmail(beneficiary.full_name, beneficiary.email)
	}
	const categories = JSON.parse(req.body.benCategories);
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
	if(req.user.username === "مدير مشاريع"){
		return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
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

