const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require('../errors')
const {User} = require("../models")
const bcrypt = require('bcryptjs')
const {sendCode} = require('../emailMessaging')


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

	res.status(StatusCodes.OK).json({
		user:{
			full_name : user.full_name ,
			email : user.email,
		},
		token
	})
}

const register = async(req, res)=>{
	const {email} = req.body
	const userTest = await User.findOne({where:{email}});
	if(userTest && !userTest.dataValues.is_active){
		await userTest.destroy()
	}

	//hash password
	const credentials = req.body
	const salt = await bcrypt.genSalt(10)
 const hashedPassword = await bcrypt.hash(credentials.password, salt)
	credentials.password = hashedPassword

	// create user (creation of secret code happens by default)
	try{
		const user = await User.create(credentials)

		//send code
		await sendCode(user.secret_code, user.email)
		res.status(StatusCodes.CREATED).json()
	}catch(e){
		res.status(StatusCodes.BAD_REQUEST).json({msg: 'Email already exists'})
	}

	// res.status(StatusCodes.CREATED).json(user.dataValues.secret_code)
}

const resendCode = async(req, res)=>{
	const {email} = req.body
	const user = await User.findOne({where : {email}})
	if(!user){
		throw new UnauthenticatedError('Invalid Credentials')
	}
	const secret_code = Math.floor(Math.random() * 10000)
	await user.update({ secret_code  })
	await sendCode(secret_code, user.email)
	res.status(StatusCodes.OK).json()
	// res.status(StatusCodes.OK).json(user.dataValues.secret_code)
}

const verifyRegister = async(req, res)=>{
	const {email , code} = req.body
	
	if( !email || !code ){
		throw new BadRequestError('Please provide email & code')
	}
//get user 
	const user = await User.findOne({where: {email}})
	if(!user){
		throw new UnauthenticatedError('Invalid Credentials')
	}
	//check correctness of token
	const isCodeCorrect = user.compareSecretCode(parseInt(code))
	if(!isCodeCorrect){
		throw new UnauthenticatedError('Invalid Code')
	}
	//mark active may delete later !
	await user.update({ is_active: true })
	//generate tokens
	const token = user.createJWT()
	res.status(StatusCodes.OK).json({
		user:{
			full_name : user.full_name ,
			email : user.email,
		},
		token
	})
}

const all = {
	login,
	register,
	verifyRegister,
	resendCode
}

module.exports = all
