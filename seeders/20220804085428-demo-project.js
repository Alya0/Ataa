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
    return queryInterface.bulkInsert('Projects', [{
      name: 'إطعام مسكين',
      start_date: new Date(),
      end_date: new Date(),
      province: 'دمشق',
      description:'',
      project_goal:'',
      project_type:'عام',
      target_money: 10000,
      project_status:'مستمر',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
        name: 'إخراج زكاة',
        start_date: new Date(),
        end_date: new Date(),
        province: 'دمشق',
        description:'',
        project_goal:'',
        project_type:'عام',
        target_money: 1000,
        project_status:'مستمر',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'صدقة',
        start_date: new Date(),
        end_date: new Date(),
        province: 'دمشق',
        description:'',
        project_goal:'',
        project_type:'عام',
        target_money: 1000,
        project_status:'مستمر',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'أضحية',
        start_date: new Date(),
        end_date: new Date(),
        province: 'دمشق',
        description:'',
        project_goal:'',
        project_type:'عام',
        target_money: 900000,
        project_status:'مستمر',
        createdAt: new Date(),
        updatedAt: new Date()
      },]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Projects', null, {});
  }
};
