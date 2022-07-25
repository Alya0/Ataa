'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INT,
      },
      full_name: {
        type: Sequelize.STRING,
        notEmpty: true,
        isAlpha: true,
      },
      ID_number: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail: true,
        notEmpty: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      birth_date: {
        type: Sequelize.DATE,
        notEmpty: true,
        isDate: true,
      },
      gender: {
        type: Sequelize.STRING,
        isIn: [['ذكر', 'أنثى']],
        notEmpty: true,
      },
      province: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        notEmpty: true,
      },
      address: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      description: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      image: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING,
        isIn: [['ممول', 'عام']],
        notEmpty: true,
      },
      status:{
        type: Sequelize.ENUM,
        values:[['معلق', 'مقبول', 'مرفوض','pending', 'accepted', 'rejected']]
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};