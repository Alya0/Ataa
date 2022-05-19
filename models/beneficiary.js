'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beneficiary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Beneficiary.hasMany(models.Benefit, {
        onDelete: "cascade"
      })

      Beneficiary.hasMany(models.Ben_Cat, {
        onDelete: "cascade"
      })
    }
  }
  Beneficiary.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
        isAlpha : true
      }
    },
    ID_number:{
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true, 
        isNumeric : true
      }
    },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
        isNumeric : true
      }
    },
    birth_date:{
      type: DataTypes.DATEONLY,
      allowNull: false,
      set(value){
        const jsDate = new Date(value)
        this.setDataValue('birth_date', jsDate)
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
      allowNull: false
    },
    marital_status:{
      type: DataTypes.ENUM,
      values:[
        'أعزب',
        'متزوج',
        'أرمل',
        'مطلق',
        'single',
        'widowed',
        'married',
        'divorced'
      ],
      allowNull: false,
      validate:{
        notEmpty : true
      }
    },
    children_number:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    job:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    salary:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull:false,
      validate: {
        isNumeric : true
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
      validate:{
        notEmpty : true
      }
    },
    area:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description:{
      type: DataTypes.TEXT
    },
    health_status:{
      type: DataTypes.TEXT,
      defaultValue: 'خالي من الامراض السارية و المعدية'
    },
    residential_status:{
      type: DataTypes.ENUM,
      values: [
        'ملك',
        'اجار'
      ],
      allowNull: false,
      validate:{
        notEmpty : true
      }
    },
    application_status:{
      type: DataTypes.ENUM,
      values:[
        'pending',
        'accepted',
        'rejected'
      ],
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Beneficiary',
  });
  return Beneficiary;
};