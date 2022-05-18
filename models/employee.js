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
        foreignKey: "activity_id",
        onDelete: "cascade"
      })
    }
  }
  Employee.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: false,
        notEmpty: true,
        isAlpha: true,
      }
    },
    ID_number:{
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      notEmpty: true,
      isEmail:true,
      validate: {
        notNull:true,
        notEmpty: true,
        isEmail:true,
      }
    },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    birth_date:{
      type: DataTypes.DATE,
      allowNull: false,
      notEmpty: true,
      validate: {
        isDate: true,
        notNull: true,
        notEmpty: true,
      }
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
      allowNull: true,
      notEmpty: true,
      validate: {
        notNull: false,
        notEmpty: true,
        isIn:[
          [
            'انثى',
            'ذكر',
            'غير ذلك',
            'female',
            'male',
            'other'
          ]
        ],
      }
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
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: true,
        notNull: true,
        isIn: [
          [
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
          ]
        ],
      }
    },
    area:{
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notNull: true,
        notEmpty:true,
      }
    },
    address:{
      type: DataTypes.TEXT,
      allowNull: false,
      notEmpty:true,
      validate: {
        notNull: true,
        notEmpty:true,
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull:false,
      validate: {
        notNull: true,
        notEmpty:true,
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['volunteer','employee','متطوع', 'موظف'],
      notEmpty: true,
      allowNull:false,
      validate: {
        isIn: [['volunteer','employee','متطوع', 'موظف']],
        notEmpty: true,
        notNull: true,
      },
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees'
  });
  return Employee;
};