const {Project, Category, sequelize} = require('../models')
const { Op } = require("sequelize");
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors')

const getAll = async(req, res)=>{
	const [results, metadata] = await sequelize.query(`
		SELECT * ,
		(SELECT GROUP_CONCAT(categories.tag)
			FROM pro_cats INNER JOIN categories ON pro_cats.CategoryId = categories.id
			WHERE pro_cats.ProjectId = projects.id) AS categories
		FROM projects
		WHERE projects.project_status = "ongoing" OR projects.project_status = "مستمر"
	`)
	let projects = results
	projects.forEach((element)=>{
		if(element.categories){
			element.categories = element.categories.split(',')
		}
		else{
			element.categories = []
		}
	})
	res.status(StatusCodes.OK).json(projects);
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
			WHERE pro_cats.ProjectId = projects.id) AS categories
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
	})
	res.status(StatusCodes.OK).json(projects)
}
module.exports = {
	getAll, 
	getByTag
}