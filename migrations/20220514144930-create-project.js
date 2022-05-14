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
    await queryInterface.dropTable('Projects');
  }
};