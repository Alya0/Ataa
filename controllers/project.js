const { Project } = require('../models');
const { NotFoundError } = require('../errors/not-found');
const { BadRequestError } = require('../errors/bad-request');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res) =>{

};

const create = async (req, res) =>{
    try {
      const project = await Project.create({...req.body});
      if(!project){
          throw new BadRequestError("Bad Request");
      }
      return res.status(StatusCodes.CREATED).json(project);
    } catch(e){
        return res.status(StatusCodes.BAD_REQUEST).json({"message": e});
    }
};

const read = async (req, res) =>{
    try {
        const project = await Project.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!project){
            throw new NotFoundError("project not found");
        }
        return res.status(StatusCodes.OK).json(project);
    }catch(e){
        return res.status(StatusCodes.NOT_FOUND).json({"message": e.message});
    }
};

const update = async (req, res) =>{
    try {
        const project = await Project.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!project){
            throw new NotFoundError("project not found");
        }
        await project.set({...req.body});
        project.save();
        return res.status(StatusCodes.OK).json(project);
    } catch (e) {
        return res.status(StatusCodes.NOT_FOUND).json({"messag": e});
    }

};

const destroy = async (req, res) =>{
    try{
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
    } catch(e){
        return res.status(StatusCodes.NOT_FOUND).json({"message": e.message})
    }
};

const projectController = {
    index,
    create,
    read,
    update,
    destroy
};

module.exports = {projectController};