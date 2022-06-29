const {Employee} = require('../models');
const {NotFoundError} = require('../errors/not-found');
const {BadRequestError} = require('../errors/bad-request');
const {StatusCodes} = require('http-status-codes');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const index = async (req, res) => {
    try {
        const all = await Employee.findAll();
        return res.json(all);
    } catch (e) {
        return res.json(e);
    }
};

const create = async (req, res) => {
    if(!(req.user.username === 'Manager')){
        throw new BadRequestError('You Do not have the permission');
    }
    try {
        const emp = {...req.body};
        if (!req.file)
            emp.image = null;
        else
            emp.image = req.file.path;
        await Employee.create(emp);
        return res.status(StatusCodes.CREATED).json(emp);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};

const read = async (req, res) => {
    if(!(req.user.username === 'Manager')){
        throw new BadRequestError('You Do not have the permission');
    }
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
    if(!(req.user.username === 'Manager')){
        throw new BadRequestError('You Do not have the permission');
    }
    const emp = await Employee.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!emp) {
        throw new NotFoundError("Employee Not Found");
    }
    try {
        const empl = {...req.body};
        if (emp.image && req.file){
            const p = emp.image;
            await unlinkAsync(p);
            empl.image = req.file.path;
        }
        else if(req.file){
            empl.image = req.file.path;
        }
        await emp.update(empl);
        return res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};

const destroy = async (req, res) => {
    if(!(req.user.username === 'Manager')){
        throw new BadRequestError('You Do not have the permission');
    }
    const emp = await Employee.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!emp) {
        throw new NotFoundError("Employee not Found");
    }
    if (emp.image)
        await unlinkAsync(emp.image);
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
    destroy
};

module.exports = {
    employeeController
};