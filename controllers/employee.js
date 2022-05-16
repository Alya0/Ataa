const { Employee } = require('../models');
const { StatusCodes } = require('http-status-codes')

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
        return res.json(e);
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
            return res.status(StatusCodes.NOT_FOUND).json({ "message": "employee not found" });
        }
        res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.json(e);
    }
};

const update = async (req, res) => {
    const id = req.params.id;
    try {
        const emp = await Employee.findOne({
            where:{
                id: req.params.id
            }
        });
        await emp.set({...req.body});
        emp.save();
        return res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.json(e);
    }
};

const destroy = async (req, res) => {
    try {
        const emp = await Employee.findOne({
            where: {
                id: req.params.id,
            }
        });
        await Employee.destroy({
            where: {
                id: req.params.id,
            }
        });
        return res.status(StatusCodes.OK).json(emp);
    } catch (e) {
        return res.json(e);
    }
};

const employeeController = {
    create,
    read,
    update,
    destroy,
};

module.exports = {
    employeeController
};