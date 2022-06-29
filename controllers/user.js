const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require('../errors')
const {User} = require("../models")

const get = async(req, res)=>{
	const {
		user : {
			id
		}
	} = req

	const user = await User.findByPk(id)
	res.status(StatusCodes.OK).json(user)
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


const all = {
	get,
	edit
}

module.exports = all