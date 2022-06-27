const { Project } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res) =>{
    try {
        const all = await Project.findAll();
        return res.json(all);
    } catch (e) {
        return res.json(e);
    }
};

const create = async (req, res) =>{
    try {
        const project = await Project.create({...req.body});
        return res.status(StatusCodes.CREATED).json(project);}
    catch (e) {
        throw new BadRequestError(e.message);
    }
};

const read = async (req, res) =>{
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

const update = async (req, res) =>{
    const pro = await Project.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!pro){
        throw new NotFoundError("project not found");
    }
    try {
        await pro.update({...req.body});
        return res.status(StatusCodes.OK).json(pro);}
    catch (e) {
        throw new BadRequestError(e.message);
    }
};

const destroy = async (req, res) =>{
    const project = await Project.findOne({
        where: {
            id: req.params.id,
        }
    });
    if(!project){
        throw new NotFoundError("project not found");
    }
    await Project.destroy({
        where: {
            id: req.params.id,
        }
    });
    return res.status(StatusCodes.OK).json(project);
};

const projectController = {
    index,
    create,
    read,
    update,
    destroy
};

module.exports = {projectController};