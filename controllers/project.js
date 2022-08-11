const { sequelize, Project, Beneficiary, Employee, Role, Activity, Benefit, Pro_Cat, Category, Donation } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const path = require('path');

const index = async (req, res) =>{
    if(req.user.username === 'موظف'){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const [results, metadata] = await sequelize.query(
        `SELECT p.id, p.name, p.image, p.target_money, p.start_date, p.province,p.project_type,p.project_status, SUM(d.value) AS money 
        FROM projects p LEFT OUTER JOIN donations d
        ON p.id = d.ProjectId
        GROUP BY p.id`
    );
    let charityBudget = await Donation.sum('value');
    if(charityBudget == null){
        charityBudget = 0;
    }
    results.forEach((item) => {
        if(item.money == null)
            item.money = 0;
    });
    let programsBudget = await Donation.sum('value',{ where: { ProjectId: { [Op.between]: [1, 4] } } });
    let projectsBudget = await Donation.sum('value',{ where: { ProjectId: { [Op.notBetween]: [1, 4] } } });
    if(programsBudget == null){
        programsBudget = 0;
    }
    if(projectsBudget == null){
        projectsBudget = 0;
    }
    return res.status(StatusCodes.OK).json({'project':results, charityBudget:charityBudget,programsBudget:programsBudget, projectsBudget:projectsBudget});
};

const create = async (req, res) => {
    if(req.user.username === 'موظف'){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const project = {...req.body};
    if (!req.file) {
        project.image = null;
    }
    else {
        project.image = req.file.path;
    }
    project.project_status = 'مستمر';
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
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    let beneficiaries = await Beneficiary.findAll({
        attributes: ['id', 'full_name', 'image','province','application_status']
    });
    let emoloyees = await Employee.findAll({
        attributes: ['id', 'full_name', 'image','type','status'],
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
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const project = await Project.findOne({
        where:{
            id: req.params.id
        },
        // include:{
        //     model:Donation
        // }
    });
    if(!project){
        throw new NotFoundError("project not found");
    }
    let money = await Donation.sum('value', { where: { ProjectId: project.id } });
    if(money == null){
        money = 0;
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
        attributes:['id', 'full_name', 'image', 'type', 'status']
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
        attributes:['id','tag'],
        where:{
            id:categoryId
        }
    });
    return res.status(StatusCodes.OK).json({project: project, money:money, categories:cat, emp: emp, ben:ben});
};

const edit = async (req, res) =>{
    if(req.user.username === 'موظف'){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
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
        attributes:['id', 'full_name', 'image','type','status']
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
    if(req.user.username === 'موظف'){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
    }
    const project = await Project.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!project) {
        throw new NotFoundError("Employee Not Found");
    }
    const pro = {...req.body};
    if(pro.image === 'null'){
        pro.image = project.image;
    }
    else if (project.image && req.file){
        const p = project.image;
        await unlinkAsync(p);
        pro.image = req.file.path;
    }
    else if(req.file){
        pro.image = req.file.path;
    }
    if(req.body.projectEmployees)
    {
        let projectEmployee = JSON.parse(req.body.projectEmployees);
        projectEmployee.forEach(async (item) => {
            await Activity.create({
                active:true,
                EmployeeId:item,
                ProjectId:project.id
            });
        });
    }
    if(req.body.projectBeneficiaries){
        let projectBen = JSON.parse(req.body.projectBeneficiaries);
        projectBen.forEach(async (item) => {
            await Benefit.create({
                date:Date.now(),
                BeneficiaryId:item,
                ProjectId:project.id
            });
        });
    }
    if(req.body.projectCategories){
        await Pro_Cat.destroy({
            where:{
                ProjectId: project.id
            }
        });
        let projectCat = JSON.parse(req.body.projectCategories);
        projectCat.forEach(async (item) => {
            await Pro_Cat.create({
                date: Date.now(),
                CategoryId: item,
                ProjectId: project.id
            });
        });
    }
    await project.update(pro);
    return res.status(StatusCodes.OK).json(project);
};

const destroy = async (req, res) => {
    if(req.user.username === 'موظف'){
        return res.status(StatusCodes.FORBIDDEN).json('you dont have permission');
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