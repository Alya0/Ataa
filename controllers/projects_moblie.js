const {Project, Donation,Category, sequelize} = require('../models')
const { Op } = require("sequelize");
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors')

const getAll = async(req, res)=>{
	const [results, metadata] = await sequelize.query(`
		SELECT * ,
		(SELECT GROUP_CONCAT(categories.tag)
			FROM pro_cats INNER JOIN categories ON pro_cats.CategoryId = categories.id
			WHERE pro_cats.ProjectId = projects.id) AS categories,
		(SELECT SUM(value) FROM donations WHERE donations.ProjectId = projects.id) AS raised
		FROM projects
		WHERE projects.project_status = "ongoing" OR projects.project_status = "مستمر"
	`)
	let projects = results
	projects.forEach(async(element)=>{
		if(element.categories){
			element.categories = element.categories.split(',')
		}
		else{
			element.categories = []
		}
		if(!element.raised){
			element.raised = 0
		}
	})
	projects = projects.filter((element)=> element.id > 4)
	res.status(StatusCodes.OK).json({projects});
}

const getThreeProjects = async(req, res)=>{
	let projects = await Project.findAll({
		attributes: ['id', 'name', 'image'],
		where:{
			project_status : 'مستمر'
		}
	})
	projects = projects.filter(element => (element.id > 4))
	projects = projects.slice(0, 3)
	res.status(StatusCodes.OK).json({projects});
}

const getByTag = async(req, res)=>{
	const {tag} = req.params
	const category = await Category.findOne({
		where:{tag}
	})
	if(!category){
		throw new NotFoundError(`No category with name ${tag}`)
	}
	const [results, metadata] = await sequelize.query(`
		SELECT * ,
		(SELECT GROUP_CONCAT(categories.tag) FROM pro_cats 
			INNER JOIN categories ON pro_cats.CategoryId = categories.id
			WHERE pro_cats.ProjectId = projects.id) AS categories,
			(SELECT SUM(value) FROM donations WHERE donations.ProjectId = projects.id) AS raised
		FROM projects
		INNER JOIN pro_cats ON projects.id = pro_cats.ProjectId
		WHERE pro_cats.CategoryId = ${category.id} AND (projects.project_status = "ongoing" OR projects.project_status = "مستمر")
	`)
	let projects = results
	projects.forEach((element)=>{
		if(element.categories){
			element.categories = element.categories.split(',')
		}
		else{
			element.categories = []
		}
		if(!element.raised){
			element.raised = 0
		}
	})
	res.status(StatusCodes.OK).json({projects})
}

const getMiskeenVal = async(req, res) => {
	const result = await Project.findOne({where: {name : 'إطعام مسكين'}})
	res.status(StatusCodes.OK).json({value:result.target_money})
}

const getSacrificeVal = async(req, res) => {
	const result = await Project.findOne({where: {name : 'أضحية'}})
	res.status(StatusCodes.OK).json({value:result.target_money})
}

module.exports = {
	getAll, 
	getByTag,
	getMiskeenVal,
	getSacrificeVal,
	getThreeProjects
}