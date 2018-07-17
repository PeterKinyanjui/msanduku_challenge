const Sequelize = require("sequelize");
const sequelize = new Sequelize(
	"msanduku_challenge",
	"root",
	"",
	{
		host: "localhost",
		dialect: "mysql",
		logging: false,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	}
);

const User = sequelize.define("user", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	empId: {
		type: Sequelize.INTEGER,
		field: "emp_id"
	},
	firstName: {
		type: Sequelize.STRING,
		field: "first_name"
	},
	lastName: {
		type: Sequelize.STRING,
		field: "last_name"
	},
	namePrefix: {
		type: Sequelize.STRING,
		field: "name_prefix"
	},
	middleInitial: {
		type: Sequelize.STRING,
		field: "middle_initial"
	},
	gender: {
		type: Sequelize.STRING,
		field: "gender"
	},
	email: {
		type: Sequelize.STRING,
		field: "email"
	},
	fathersName: {
		type: Sequelize.STRING,
		field: "fathers_name"
	},
	mothersName: {
		type: Sequelize.STRING,
		field: "mothers_name"
	},
	mothersMaidenName: {
		type: Sequelize.STRING,
		field: "mothers_maiden_name"
	},
	dob: {
		type: Sequelize.STRING,
		field: "dob"
	}
});
module.exports = {
	User,
	sequelize
};
