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
        throw new BadRequestError(e.message);
    }
};

const read = async (req, res) => {
    const emp = await Employee.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!emp) {
        throw new NotFoundError("Employee Not Found");
    }
    res.status(StatusCodes.OK).json(emp);
};

const update = async (req, res) => {
    const emp = await Employee.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!emp){
        throw new NotFoundError("Employee Not Found");
    }
    try {
        await emp.update({...req.body});
        return res.status(StatusCodes.OK).json(emp);
    }
    catch (e) {
        throw new BadRequestError(e.message);
    }
};

const destroy = async (req, res) => {
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