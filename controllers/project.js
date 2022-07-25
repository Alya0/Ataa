const { Project, Beneficiary, Employee, Role, Activity, Benefit, Pro_Cat, Category } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize')
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const path = require('path');

const index = async (req, res) =>{
    try {
        const all = await Project.findAll();
        return res.json(all);
    } catch (e) {
        return res.json(e);
    }
};

const create = async (req, res) => {
    if(req.user.username === 'موظف'){
        throw new BadRequestError('You Do not have the permission');
    }
    const project = {...req.body};
    if (!req.file) {
        project.image = null;
    }
    else {
        project.image = req.file.path;
    }
    const pro = await Project.create(project);
    let projectEmployee = JSON.parse(req.body.projectEmployees);
    let projectBen = JSON.parse(req.body.projectBeneficiaries);
    let projectCat = JSON.parse(req.body.projectCategories);
    projectEmployee.forEach(async (item) => {
        await Activity.create({
            active:true,
            EmployeeId:item,
            ProjectId:pro.id
        });
    });
    projectBen.forEach(async (item) => {
        await Benefit.create({
            date:Date.now(),
            BeneficiaryId:item,
            ProjectId:pro.id
        });
    });
    projectCat.forEach(async (item) => {
        await Pro_Cat.create({
            date:Date.now(),
            CategoryId:item,
            ProjectId:pro.id
        });
    });
    return res.status(StatusCodes.CREATED).json(project);
};

const add = async (req, res) => {
    if(req.user.username === 'موظف'){
        throw new BadRequestError('You Do not have the permission');
    }
    let beneficiaries = await Beneficiary.findAll({
        attributes: ['id', 'full_name', 'image','province','application_status']
    });
    let emoloyees = await Employee.findAll({
        attributes: ['id', 'full_name', 'image','status'],
        include: {
            model:Role,
            attributes:['username']
    },
    });
    return res.status(StatusCodes.OK).json({
        bene : beneficiaries,
        emp : emoloyees
    })
};

const read = async (req, res) =>{
    if(req.user.username === 'موظف'){
        throw new BadRequestError('You Do not have the permission');
    }
    const project = await Project.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!project){
        throw new NotFoundError("project not found");
    }
    let empId = await Activity.findAll({
        attributes:['EmployeeId'],
        where: {
            ProjectId: project.id
        }
    });
    let benID = await Benefit.findAll({
        attributes:['BeneficiaryId'],
        where: {
            ProjectId: project.id
        }
    });
    let catID = await Pro_Cat.findAll({
        attributes:['CategoryId'],
        where: {
            ProjectId: project.id
        }
    });
    let employeeId = empId.map(emp => emp.EmployeeId);
    let beneficiaryId = benID.map(ben => ben.BeneficiaryId);
    let categoryId = catID.map(cat => cat.CategoryId);
    const emp = await Employee.findAll({
        attributes:['id', 'full_name', 'image', 'province', 'status']
        ,where:{
            id: employeeId
        },
        include: {
            model:Role,
            attributes:['username']
        }
    });
    const ben = await Beneficiary.findAll({
        attributes:['id', 'full_name', 'image', 'province', 'application_status']
        ,where:{
            id:beneficiaryId
        },
    });
    const cat = await Category.findAll({
        attributes:['tag'],
        where:{
            id:categoryId
        }
    });
    return res.status(StatusCodes.OK).json({project: project, categories:cat, emp: emp, ben:ben});
};

const edit = async (req, res) =>{
    if(req.user.username === 'موظف'){
        throw new BadRequestError('You Do not have the permission');
    }
    const project = await Project.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!project){
        throw new NotFoundError("project not found");
    }
    let empId = await Activity.findAll({
        attributes:['EmployeeId'],
        where: {
            ProjectId: project.id
        }
    });
    let benID = await Benefit.findAll({
        attributes:['BeneficiaryId'],
        where: {
            ProjectId: project.id
        }
    });
    let catID = await Pro_Cat.findAll({
        attributes:['CategoryId'],
        where:{
            ProjectId: project.id
        }
    });
    let employeeId = empId.map(emp => emp.EmployeeId);
    let beneficiaryId = benID.map(ben => ben.BeneficiaryId);
    let categoryId = catID.map(cat => cat.CategoryId);
    const emp = await Employee.findAll({
        attributes:['id', 'full_name', 'image','province','status']
        ,where:{
            id: {
                [Op.notIn]:employeeId
            }
        },
        include: {
            model:Role,
            attributes:['username']
        }
    });
    const ben = await Beneficiary.findAll({
        attributes:['id', 'full_name', 'image','province','application_status']
        ,where:{
            id: {
                [Op.notIn]:beneficiaryId
            }
        },
    });
    const cat = await Category.findAll({
        attributes:['id','tag']
        ,where:{
            id: {
                [Op.notIn]:categoryId
            }
        },
    });
    return res.status(StatusCodes.OK).json({project: project,category:cat, emp: emp, ben:ben});
};

const update = async (req, res) => {
    if(req.user.username === 'Worker'){
        throw new BadRequestError('You Do not have the permission');
    }
    const project = await Project.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!project) {
        throw new NotFoundError("Employee Not Found");
    }
    try {
        const pro = {...req.body};
        if (project.image && req.file){
            const p = project.image;
            await unlinkAsync(p);
            pro.image = req.file.path;
        }
        else if(req.file){
            pro.image = req.file.path;
        }
        await project.update(pro);
        return res.status(StatusCodes.OK).json(project);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};

const destroy = async (req, res) => {
    if(req.user.username === 'موظف'){
        throw new BadRequestError('You Do not have the permission');
    }
    const project = await Project.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!project) {
        throw new NotFoundError("Project not Found");
    }
    if (project.image)
        await unlinkAsync(project.image);
    await Project.destroy({
        where: {
            id: req.params.id,
        }
    });
    return res.status(StatusCodes.OK).json(project);
};

const projectController = {
    index,
    add,
    create,
    read,
    update,
    edit,
    destroy
};

module.exports = {projectController};