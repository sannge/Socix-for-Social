"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.addColumn(
					"messages",
					"pendingID",
					{
						type: Sequelize.STRING,
					},
					{ transaction: t }
				),
			]);
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		return queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.removeColumn("messages", "pendingID", {
					transaction: t,
				}),
			]);
		});
	},
};
