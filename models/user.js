const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

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
    async comparePassword(canditatePassword){
      const isMatch = await bcrypt.compare(canditatePassword, this.password)
      return isMatch
    }
    createJWT(){
      return jwt.sign(
        {id: this.id, username: this.full_name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME})
    }
    compareSecretCode(candidateCode){
      const isMatch = (candidateCode === this.secret_code)
      return isMatch
    }
  }
  User.init({
    full_name:{
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : true, 
        notNull : true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {
        notEmpty: true, 
        isEmail: true, 
      }
    },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull : true, 
        notEmpty: true
      }
    },
    password:{
      type: DataTypes.TEXT,
      allowNull:false
    },
    secret_code:{
      type: DataTypes.INTEGER,
      defaultValue: Math.floor(Math.random() * 100000000) % 10079
    },
    is_active:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};