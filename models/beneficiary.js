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
    }
  }
  Beneficiary.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ID_number:{
      type: DataTypes.STRING, 
      allowNull: false
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
      allowNull: false
    },
    children_number:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    job:{
      type: DataTypes.STRING,
      allowNull: false
    },
    salary:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Beneficiary',
  });
  return Beneficiary;
};