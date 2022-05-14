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
      allowNull : false
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    end_date:{
      type: DataTypes.DATE
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
    project_type:{
      type: DataTypes.ENUM,
      values: [
        'خاص',
        'عام'
      ],
      allowNull: false
    },
    target_money:{
      type: DataTypes.BIGINT
    }
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};