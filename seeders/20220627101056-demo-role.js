const bcrypt = require('bcryptjs');
require('dotenv').config();
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
    const salt = await bcrypt.genSalt(10);
    return queryInterface.bulkInsert('Roles', [{
      username: 'مدير',
      password: await bcrypt.hash(process.env.Manager, salt),//process.env.Manager
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      username: 'مدير مشاريع',
      password: await bcrypt.hash(process.env.Project_Manager, salt),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      username: 'موظف',
      password: await bcrypt.hash(process.env.Worker, salt),
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
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
