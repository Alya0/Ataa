const { Project } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');
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
    if(req.user.username === 'Worker'){
        throw new BadRequestError('You Do not have the permission');
    }
    try {
        const project = {...req.body};
        if (!req.file)
            project.image = null;
        else
            project.image = req.file.path;
        await Project.create(project);
        return res.status(StatusCodes.CREATED).json(project);
    } catch (e) {
        throw new BadRequestError(e.message);
    }
};
// const create = async (req, res) =>{
//     try {
//         const project = await Project.create({...req.body});
//         return res.status(StatusCodes.CREATED).json(project);}
//     catch (e) {
//         throw new BadRequestError(e.message);
//     }
// };

const read = async (req, res) =>{
    if(req.user.username === 'Worker'){
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
    return res.status(StatusCodes.OK).json(project);
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
// const update = async (req, res) =>{
//     const pro = await Project.findOne({
//         where:{
//             id: req.params.id
//         }
//     });
//     if(!pro){
//         throw new NotFoundError("project not found");
//     }
//     try {
//         await pro.update({...req.body});
//         return res.status(StatusCodes.OK).json(pro);}
//     catch (e) {
//         throw new BadRequestError(e.message);
//     }
// };

const destroy = async (req, res) => {
    if(req.user.username === 'Worker'){
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
// const destroy = async (req, res) =>{
//     const project = await Project.findOne({
//         where: {
//             id: req.params.id,
//         }
//     });
//     if(!project){
//         throw new NotFoundError("project not found");
//     }
//     await Project.destroy({
//         where: {
//             id: req.params.id,
//         }
//     });
//     return res.status(StatusCodes.OK).json(project);
// };

const projectController = {
    index,
    create,
    read,
    update,
    destroy
};

module.exports = {projectController};