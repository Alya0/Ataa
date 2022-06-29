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
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await role.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = role.createJWT();

    res.status(StatusCodes.OK).json({ token })
};

const webAuth = {
    login,
};

module.exports = {webAuth};