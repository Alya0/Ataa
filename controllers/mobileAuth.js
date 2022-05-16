const { StatusCodes } = require("http-status-codes")
const {User} = require("../models")



const login = async(req, res)=>{
	res.send('login')
}

const register = async(req, res)=>{
	const user = await User.create({...req.body})
	res.status(StatusCodes.CREATED).json(user)
}

const verifyRegister = async(req, res)=>{
	res.send('verifyMyREgister')
}

const all = {
	login,
	register,
	verifyRegister
}

module.exports = all
