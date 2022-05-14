'use strict';
const {
  Model
} = require('sequelize');
const project = require('./project');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Activity.init({
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    start_date:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    project_id:{
      type: DataTypes.INT,
      references:{
        model: project,
        key: 'id'
      }
    }
    //TODO: add employee foreign key
    
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};