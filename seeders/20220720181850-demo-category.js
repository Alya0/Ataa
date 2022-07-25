'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('categories', [{
      tag: 'تعليم',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'غذاء',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'أيتام',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'أغاثة',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'كسوة',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'صحة',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'إسكان',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'رمضان',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'مساجد',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tag: 'ذوي الأحتياجات',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
