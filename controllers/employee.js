const {Employee, Role, sequelize} = require('../models');
const {NotFoundError} = require('../errors/not-found');
const {BadRequestError} = require('../errors/bad-request');
const {StatusCodes} = require('http-status-codes');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const index = async (req, res) => {
    if(!(req.user.username === 'مدير')){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const [results, metadata] = await sequelize.query(
        `SELECT e.id, e.full_name, e.gender, e.birth_date, e.status , r.username 
        FROM employees e JOIN roles r
        ON e.RoleId = r.id`
    );
    return res.status(StatusCodes.OK).json(results);
};

const create = async (req, res) => {
    if(!(req.user.username === 'مدير')){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const emp = {...req.body};
    let role = await Role.findOne({
        attributes:['id']
        ,where: {
            username : emp.jobState
        }
    });
    emp.RoleId = role.id;
    if(emp.type === 'متطوع'){
        emp.status = 'معلق';
        emp.RoleId = 4;
    }
    if (!req.file)
        emp.image = null;
    else
        emp.image = req.file.path;
    await Employee.create(emp);
    return res.status(StatusCodes.CREATED).json(emp);
};

const read = async (req, res) => {
    if(!(req.user.username === 'مدير')){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const emp = await Employee.findOne({
        where: {
            id: req.params.id,
        },
        include: {
            model:Role,
            attributes:['username']
        },
    });
    if (!emp) {
        throw new NotFoundError("Employee Not Found");
    }
    res.status(StatusCodes.OK).json(emp);
};

const update = async (req, res) => {
    if(!(req.user.username === 'مدير')){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const emp = await Employee.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!emp) {
        throw new NotFoundError("Employee Not Found");
    }
    const empl = {...req.body};
    if(empl.image === 'null'){
        empl.image = emp.image;
    }
    else if (emp.image && req.file){
        const p = emp.image;
        await unlinkAsync(p);
        empl.image = req.file.path;
    }
    else if(req.file){
        empl.image = req.file.path;
    }
    if(empl.jobState){
        let role = await Role.findOne({
            attributes:['id']
            ,where: {
                username : empl.jobState
            }
        });
        empl.RoleId = role.id;
    }
    await emp.update(empl);
    return res.status(StatusCodes.OK).json(emp);
};

const destroy = async (req, res) => {
    if(!(req.user.username === 'مدير')){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
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