'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.Activity, {
        onDelete: "cascade"
      })
    }
  }
  Employee.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ID_number:{
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      isEmail:true,
    },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date:{
      type: DataTypes.DATE,
      allowNull: false
    },
    gender:{
      type: DataTypes.ENUM,
      values:[
        'انثى',
        'ذكر',
        'غير ذلك',
        'female',
        'male',
        'other'
      ],
      allowNull: false
    },
    province:{
      type: DataTypes.ENUM,
      values: [
        'حلب',
        'رقة',
        'سويداء',
        'دمشق',
        'درعا',
        'دير الزور',
        'حماة',
        'حسكة',
        'حمص',
        'ادلب',
        'لاذقية',
        'قنيطرة',
        'ريف دمشق',
        'طرطوس'
      ],
      allowNull: false
    },
    area:{
      type: DataTypes.STRING,
      allowNull: false
    },
    address:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    description:{
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM,
      values: ['متطوع', 'موظف'],
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};