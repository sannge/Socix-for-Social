"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn("messages", "content", {
				type: Sequelize.TEXT("long"),
				allowNull: false,
			}),
		]);
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	down: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn("messages", "content", {
				type: Sequelize.STRING,
				allowNull: false,
			}),
		]);
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
