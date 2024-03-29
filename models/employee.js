"use strict";
const { Model } = require("sequelize");
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
        onDelete: "cascade",
      }),
        Employee.belongsTo(models.Role);
    }
  }
  Employee.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: false,
          notEmpty: true,
        },
      },
      ID_number: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: true,
          notEmpty: true,
          //unique:true
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        isEmail: true,
        validate: {
          notNull: true,
          notEmpty: true,
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true,
        validate: {
          isDate: true,
          notNull: true,
          notEmpty: true,
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["أنثى", "ذكر", "غير ذلك", "female", "male", "other"],
        allowNull: true,
        notEmpty: true,
        validate: {
          notNull: false,
          notEmpty: true,
          isIn: [["أنثى", "ذكر", "غير ذلك", "female", "male", "other"]],
        },
      },
      province: {
        type: DataTypes.ENUM,
        values: [
          "حلب",
          "الرقة",
          "السويداء",
          "دمشق",
          "درعا",
          "دير الزور",
          "حماة",
          "الحسكة",
          "حمص",
          "إدلب",
          "اللاذقية",
          "القنيطرة",
          "ريف دمشق",
          "طرطوس",
        ],
        allowNull: false,
        notEmpty: true,
        validate: {
          notEmpty: true,
          notNull: true,
          isIn: [
            [
              "حلب",
              "الرقة",
              "السويداء",
              "دمشق",
              "درعا",
              "دير الزور",
              "حماة",
              "الحسكة",
              "حمص",
              "إدلب",
              "اللاذقية",
              "القنيطرة",
              "ريف دمشق",
              "طرطوس",
            ],
          ],
        },
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:'Images\\person.png'
      },
      status: {
        type: DataTypes.ENUM,
        values: ["معلق", "مقبول", "مرفوض", "pending", "accepted", "rejected"],
        defaultValue: "مقبول",
      },
      type: {
        type: DataTypes.ENUM,
        values: ["volunteer", "employee", "متطوع", "موظف"],
        notEmpty: true,
        allowNull: false,
        validate: {
          isIn: [["volunteer", "employee", "متطوع", "موظف"]],
          notEmpty: true,
          notNull: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
    }
  );
  return Employee;
};
