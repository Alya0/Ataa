'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull : false
      },
      start_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      end_date:{
        type: Sequelize.DATE
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
      description: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      project_goal: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      project_type:{
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          'public',
          'private',
          'خاص',
          'عام'
        ],
      },
      target_money:{
        type: Sequelize.BIGINT,
        allowNull:false,
      },
      project_status:{
        defaultValue: 'ongoing',
        type: Sequelize.ENUM,
        values:[
          'pending',
          'ongoing',
          'finished',
          'ملغى',
          'مستمر',
          'منتهي'
        ],
      },
      image: {
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};