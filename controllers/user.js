const { StatusCodes } = require("http-status-codes")
const {NotFoundError,	UnauthenticatedError} = require('../errors')
const {User, Donation, Project, sequelize} = require("../models")
const bcrypt = require('bcryptjs')


const get = async(req, res)=>{
	const {
		user : {
			id
		}
	} = req

	const user = await User.findByPk(id)
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
	SELECT donations.ProjectId, SUBSTRING(donations.date, 1, 10) AS date, donations.value, projects.name,
		(SELECT GROUP_CONCAT(categories.tag) FROM pro_cats 
		INNER JOIN categories ON pro_cats.CategoryId = categories.id 
		WHERE projects.id = pro_cats.ProjectId) AS categories
	FROM users 
	INNER JOIN donations on users.id = donations.UserId 
	INNER JOIN projects ON donations.ProjectId = projects.id
	WHERE users.id = ${id}`)
	
	let user_donations = results
	user_donations.forEach((element) => {
		if(element.categories) {
			element.categories = element.categories.split(',')
		}
		else{
			element.categories = []
		}
	})
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
	if(!user){
		throw new NotFoundError(`No user with id ${id}`)
	}
	if(req.body.password){
		const old_password = req.body.old_password
		const isPasswordCorrect = await user.comparePassword(old_password)
		if(!isPasswordCorrect){
			throw new UnauthenticatedError('Old password is incorrect')
	}
	const salt = await bcrypt.genSalt(10)
 const hashedPassword = await bcrypt.hash(req.body.password, salt)
	req.body.password = hashedPassword
	}
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