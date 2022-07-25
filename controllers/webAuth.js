const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { Role } = require('../models');

const login = async(req, res)=>{
    const {username, password} = req.body;

    if( !username || !password ){
        throw new BadRequestError('Please provide User name & password');
    }

    const role = await Role.findOne({where: {username}});
    if(!role){
        return res.status(StatusCodes.UNAUTHORIZED).json({'username': 'Invalid username'});
    }

    const isPasswordCorrect = await role.comparePassword(password);

    if(!isPasswordCorrect){
        return res.status(StatusCodes.UNAUTHORIZED).json({'password': 'Invalid password'});
    }

    const token = role.createJWT();

    res.status(StatusCodes.OK).json({ token, 'username': username })
};

const webAuth = {
    login,
};

module.exports = {webAuth};