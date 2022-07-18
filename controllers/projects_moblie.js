const {Project} = require('../models')
const { Op } = require("sequelize");
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors')

const getAll = async(req, res)=>{
	const projects = await Project.findAll({
		where:{
			[Op.or]:[
				{project_status : 'ongoing'},
				{project_status : 'مستمر'}
			]
		}
	})
	res.status(StatusCodes.OK).json(projects);
}

const getOne = async(req, res)=>{
	const {id} = req.params
	const project = await Project.findByPk(id)
	if( !project ){
		throw new NotFoundError(`No project with id ${id}`)
	}
	res.status(StatusCodes.OK).json(project)
}
module.exports = {
	getAll, 
	getOne
}