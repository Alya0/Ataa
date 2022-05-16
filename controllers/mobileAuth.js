

const login = async(req, res)=>{
	res.send('login')
}

const register = async(req, res)=>{
	res.send('register')
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
