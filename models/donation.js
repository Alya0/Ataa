'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donation.init({
    value:{
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};