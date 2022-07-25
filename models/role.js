const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.Employee, {
        onDelete: "cascade"
      })
    }
    async comparePassword(canditatePassword){
      const isMatch = await bcrypt.compare(canditatePassword, this.password)
      return isMatch
    }
    createJWT(){
      return jwt.sign(
          {userID: this.id, username: this.username},
          process.env.JWT_SECRET,
          {expiresIn: process.env.JWT_LIFETIME})
    }
  }
  Role.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type: DataTypes.TEXT,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};