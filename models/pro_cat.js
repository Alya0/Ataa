'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pro_Cat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pro_Cat.init({
    dummy_val: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pro_Cat',
  });
  return Pro_Cat;
};