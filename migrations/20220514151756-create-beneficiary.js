'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Beneficiaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ID_number:{
        type: Sequelize.STRING, 
        allowNull: false
      },
      phone_number:{
        type: Sequelize.STRING,
        allowNull: false
      },
      birth_date:{
        type: Sequelize.DATE,
        allowNull: false
      },
      gender:{
        type: Sequelize.ENUM,
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
        type: Sequelize.ENUM,
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
        type: Sequelize.INT,
        defaultValue: 0
      },
      job:{
        type: Sequelize.STRING,
        allowNull: false
      },
      salary:{
        type: Sequelize.INT,
        defaultValue: 0,
        allowNull: false
      },
      province:{
        type: Sequelize.ENUM,
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
        type: Sequelize.STRING,
        allowNull: false
      },
      address:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      description:{
        type: Sequelize.TEXT
      },
      health_status:{
        type: Sequelize.TEXT,
        defaultValue: 'خالي من الامراض السارية و المعدية'
      },
      residential_status:{
        type: Sequelize.ENUM,
        values: [
          'ملك',
          'اجار'
        ],
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Beneficiaries');
  }
};