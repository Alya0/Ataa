const { StatusCodes } = require("http-status-codes")
const {User} = require("../models")



const login = async(req, res)=>{
	res.send('login')
}

const register = async(req, res)=>{
	console.log('i');
	const user = User.build({...req.body})
	console.log(user)
	await user.save()
	console.log('dd')
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
