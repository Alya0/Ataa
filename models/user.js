const bcrypt = require('bcryptjs');
const { type } = require('express/lib/response');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Donation, {
        onDelete: "cascade"
      })
    }
    static async hashPassword(value){
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(value, salt)
      console.log(hashedPassword)
      return hashedPassword
    }
  }
  User.init({
    full_name:{
      type: DataTypes.STRING,
      allowNull : false
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false
    },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type: DataTypes.TEXT,
      set(value){
        User.hashPassword(value)
        .then((hashedPassword)=>{
          console.log('here '+ hashedPassword)
          this.setDataValue('password', hashedPassword)
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      // allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};