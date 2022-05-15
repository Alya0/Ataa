'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      full_name: {
        type: DataTypes.STRING,
        notEmpty: true,
        isAlpha: true,
        len: [3, 25]
      },
      ID_number: {
        type: DataTypes.STRING,
        notEmpty: true,
        len: [5, 20]
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true,
        notEmpty: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
      birth_date: {
        type: DataTypes.DATE,
        notEmpty: true,
        isDate: true,
      },
      gender: {
        type: DataTypes.STRING,
        isIn: [['ذكر', 'أنثى']],
        notEmpty: true,
      },
      province: {
        type: DataTypes.STRING,
        isIn: [[
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
          'طرطوس']],
        notEmpty: true,
      },
      area: {
        type: DataTypes.STRING,
        notEmpty: true,
        len: [5, 30],
      },
      address: {
        type: DataTypes.STRING,
        notEmpty: true,
        len: [5, 30],
      },
      description: {
        type: DataTypes.TEXT,
        notEmpty: true,
        len: [5, 30],
      },
      type: {
        type: DataTypes.STRING,
        isIn: [['ممول', 'عام']],
        notEmpty: true,
      },
      picture: {

      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};