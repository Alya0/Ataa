const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require('../errors')
const {User} = require("../models")
const bcrypt = require('bcryptjs')


const login = async(req, res)=>{
	const {email, password} = req.body
	
	if( !email || !password ){
		throw new BadRequestError('Please provide email & password')
	}

	const user = await User.findOne({where: {email}})
	if(!user){
		throw new UnauthenticatedError('Invalid Credentials')
	}
	
	const isPasswordCorrect = await user.comparePassword(password)
	
	if(!isPasswordCorrect){
		throw new UnauthenticatedError('Invalid Credentials')
	}

	const token = user.createJWT()

	res.status(StatusCodes.OK).json({ user: { name: user.full_name }, token })
}

const register = async(req, res)=>{
	//hash password
	const credentials = req.body
	const salt = await bcrypt.genSalt(10)
 const hashedPassword = await bcrypt.hash(credentials.password, salt)
	credentials.password = hashedPassword
	// create user
	console.log('before')
	const user = await User.create(credentials)
	console.log('after')
	//generate code and save it to data base

	//send code
	
	res.status(StatusCodes.CREATED).json(user)
}

const verifyRegister = async(req, res)=>{

	//check code

	//mark active

	//generate token


	res.send('verifyMyREgister')
}

const all = {
	login,
	register,
	verifyRegister
}

module.exports = all
