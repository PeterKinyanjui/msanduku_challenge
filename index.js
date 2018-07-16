const ExcelReader = require("node-excel-stream").ExcelReader;
const ExcelWriter = require("node-excel-stream").ExcelWriter;

const fs = require("fs");
const db = require("./db");
let dataStream = fs.createReadStream("input.xlsx");
let reader = new ExcelReader(dataStream, {
	sheets: [
		{
			name: "Sheet 1",
			rows: {
				headerRow: 1,
				allowedHeaders: [
					{
						name: "Emp ID",
						key: "empId"
					},
					{
						name: "Name Prefix",
						key: "namePrefix"
					},
					{
						name: "First Name",
						key: "firstName"
					},
					{
						name: "Middle Initial",
						key: "middleInitial"
					},
					{
						name: "Last Name",
						key: "lastName"
					},
					{
						name: "Gender",
						key: "gender"
					},
					{
						name: "E Mail",
						key: "email"
					},
					{
						name: "Father's Name",
						key: "fathersName"
					},
					{
						name: "Mother's Name",
						key: "mothersName"
					},
					{
						name: "Mother's Maiden Name",
						key: "mothersMaidenName"
					},
					{
						name: "Date of Birth",
						key: "dob"
					}
				]
			}
		}
	]
});

let writer = new ExcelWriter({
	sheets: [
		{
			name: "Sheet 1",
			key: "tests",
			headers: [
				{
					name: "Emp ID",
					key: "empId"
				},
				{
					name: "Name Prefix",
					key: "namePrefix"
				},
				{
					name: "First Name",
					key: "firstName"
				},
				{
					name: "Middle Initial",
					key: "middleInitial"
				},
				{
					name: "Last Name",
					key: "lastName"
				},
				{
					name: "Gender",
					key: "gender"
				},
				{
					name: "E Mail",
					key: "email"
				},
				{
					name: "Father's Name",
					key: "fathersName"
				},
				{
					name: "Mother's Name",
					key: "mothersName"
				},
				{
					name: "Mother's Maiden Name",
					key: "mothersMaidenName"
				},
				{
					name: "Date of Birth",
					key: "dob"
				}
			]
		}
	]
});

async function saveToFile(rows) {
	try {
		for (let i = 0; i < rows.length; i++) {
			await writer.addData("tests", rows[i]);
		}
		const stream = await writer.save();
		const fileStream = fs.createWriteStream("output.xlsx");
		fileStream.on("open", () => {
			console.log("stream opened");
		});
		fileStream.on("close", () => {
			console.timeEnd("solution");
			console.log("stream closed");
			process.exit();
		});
		stream.pipe(fileStream);
	} catch (error) {
		console.log(error);
	}
}

const rows = [];
const fatherNames = [];
console.time("parse");
console.time("solution");
reader
	.eachRow((rowData, rowNum, sheetSchema) => {
		rows.push(rowData);
		fatherNames.push(rowData.fathersName);
	})
	.then(() => {
		console.timeEnd("parse");
		console.time("sort");
		fatherNames.sort();
		for (let i = 0; i < rows.length; i++) {
			rows[i].fathersName = fatherNames[i];
		}
		console.timeEnd("sort");
		console.time("insert");

		db.User.bulkCreate(rows)
			.then(() => {
				console.timeEnd("insert");
				saveToFile(rows);
			})
			.catch(error => {
				console.log(error);
			});
	});
