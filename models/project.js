'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.Activity, {
        onDelete: "cascade"
      })

      Project.hasMany(models.Donation, {
        onDelete: "cascade"
      })

      Project.hasMany(models.Pro_Cat, {
        onDelete: "cascade"
      })

      Project.hasMany(models.Benefit, {
        onDelete: "cascade"
      })
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: true,
        notEmpty: true,
        isAlpha: true,
      }
    },
    start_date: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
        notNull: true,
        notEmpty: true,
      }
    },
    end_date:{
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        notNull: true,
        notEmpty: true,
      }
    },
    province:{
      allowNull: false,
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
      },
    },
    project_type:{
      allowNull: false,
      type: DataTypes.ENUM,
      values: [
        'public',
        'private',
        'خاص',
        'عام'
      ],
      validate: {
        notEmpty: true,
        notNull: true,
        isIn: [
          [
            'خاص',
            'عام'
          ]
        ],
      },
    },
    target_money:{
      type: DataTypes.BIGINT,
      allowNull: false,
      notEmpty: true,
      validate:{
        notNull: true,
        notEmpty: true,
        isNumeric: true,
      }
    },
    project_status:{
      defaultValue: 'ongoing',
      type: DataTypes.ENUM,
      values:[
        'pending',
        'ongoing',
        'finished',
        'معلق',
        'مستمر',
        'منتهي',
      ],
      validate:{
        isIn:[[
          'pending',
          'ongoing',
          'finished',
          'معلق',
          'مستمر',
          'منتهي',
        ]]
      }
    }
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};