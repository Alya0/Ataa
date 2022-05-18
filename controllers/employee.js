const { Employee } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res) => {
    try {
        const all = await Employee.findAll();
        return res.json(all);
    } catch (e) {
        return res.json(e);
    }
};

const create = async (req, res) => {
    try {
        const emp = await Employee.create({ ...req.body });
        return res.status(StatusCodes.CREATED).json(emp);
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": e.message});
    }
};

const read = async (req, res) => {
    try {
        const emp = await Employee.findOne({
            where: {
                id: req.params.id,
            }
        });
        if (!emp) {
            throw new NotFoundError("Employee Not Found");
        }
        res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": e.message});
    }
};

const update = async (req, res) => {
    try {
        const emp = await Employee.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!emp){
            throw new NotFoundError("Employee Not Found");
        }
        await emp.set({...req.body});
        emp.save();
        return res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message" : e.message});
    }
};

const destroy = async (req, res) => {
    try {
        const emp = await Employee.findOne({
            where: {
                id: req.params.id,
            }
        });
        if(!emp){
            throw new NotFoundError("Employee not Found");
        }
        await Employee.destroy({
            where: {
                id: req.params.id,
            }
        });
        return res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": e.message});
    }
};

const employeeController = {
    index,
    create,
    read,
    update,
    destroy,
};

module.exports = {
    employeeController
};