const {Beneficiary} = require('../models')
const StatusCodes = require('http-status-codes')

const getAll = async(req, res)=>{
	const {status} = req.params
	res.json({msg: `getAll ${status}`})
}

const create = async(req, res)=>{
	console.log(req.body)
	const beneficiary = Beneficiary.create({...req.body})
	res.status(StatusCodes.CREATED).json({beneficiary})
}

const edit = async(req, res)=>{
	const {id} = req.params
	res.json({msg: `edit ${id}`})
}

const getOne = async(req, res)=>{
	const {id} = req.params
	res.json({get: `get ${id}`})
}

const del = async(req, res)=>{
	const {id} = req.params
	res.json({msg: `delete ${id}`})
}


const all = {
	getAll, 
	getOne, 
	create, 
	edit,
	del
}

module.exports = all
