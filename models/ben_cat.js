'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ben_Cat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ben_Cat.init({
    dummy_val: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ben_Cat',
  });
  return Ben_Cat;
};