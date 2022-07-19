const e = require("express")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require('../errors')
const {User, Donation, Project, sequelize} = require("../models")


const get = async(req, res)=>{
	const {
		user : {
			id
		}
	} = req

	const user = await User.findByPk(id)
	//test donation sum 
	/*await Project.create({name:"bla", start_date:"09-09-2000", end_date:"08-08-2001", province: "حلب", project_type:"private", target_money:1000, project_status:"pending"})
	await Donation.create({value:10, date:"09-09-2001", UserId: id, ProjectId: 1})
	await Donation.create({value:20, date:"09-09-2001", UserId: id, ProjectId: 1})
	await Donation.create({value:30, date:"09-09-2001", UserId: id, ProjectId: 1})*/
	const user_donations = await Donation.sum('value', {where: {UserId : id}});
	user.dataValues.donations = (user_donations === null ? 0 : user_donations)
	res.status(StatusCodes.OK).json(user)
}

const getDonations = async (req, res) =>{
	const {
		user : {
			id
		}
	} = req

	const [results, metadata] = await sequelize.query(`
	SELECT donations.ProjectId, donations.date, donations.value, projects.name,
		(SELECT GROUP_CONCAT(pro_cats.id) FROM pro_cats WHERE projects.id = pro_cats.ProjectId) AS categories
	FROM users 
	INNER JOIN donations on users.id = donations.UserId 
	INNER JOIN projects ON donations.ProjectId = projects.id
	WHERE users.id = ${id}`)
	const user_donations = results
	res.status(StatusCodes.OK).json({hits:user_donations.length, user_donations})
}

const edit = async(req, res)=>{
	//destructring an object
	const {
		user : {
			id
		}
	} = req
	
	const user = await User.findByPk(id)
	await user.update(req.body)
	res.status(StatusCodes.OK).json(user)
}

const donate = async(req, res)=>{
	const {
		body:{
			value,
			ProjectId
		},
		user : {
			id
		}
	} = req
	//TODO donation verification
	const date = new Date().toISOString().slice(0, 10)
	const donation = {value, ProjectId, UserId : id, date}
	await Donation.create(donation)
	res.status(StatusCodes.OK).json(donation)
}

const all = {
	get,
	edit,
	donate,
	getDonations
}

module.exports = all