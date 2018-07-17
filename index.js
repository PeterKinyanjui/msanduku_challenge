const ExcelReader = require("node-excel-stream").ExcelReader;
const ExcelWriter = require("node-excel-stream").ExcelWriter;
const headers = require("./headers");
const fs = require("fs");
const db = require("./db");
const INPUT_FILE_NAME = "input.xlsx";
const OUTPUT_FILE_NAME = "output.xlsx";
const SHEET_NAME = "100000 Records";

console.time("solution");

let dataStream = fs.createReadStream(INPUT_FILE_NAME);
let reader = new ExcelReader(dataStream, {
	sheets: [
		{
			name: SHEET_NAME,
			rows: {
				headerRow: 1,
				allowedHeaders: headers
			}
		}
	]
});

let writer = new ExcelWriter({
	sheets: [
		{
			name: SHEET_NAME,
			key: SHEET_NAME,
			headers
		}
	]
});

async function saveToFile(rows) {
	try {
		for (let i = 0; i < rows.length; i++) {
			await writer.addData(SHEET_NAME, rows[i]);
		}
		const stream = await writer.save();
		const fileStream = fs.createWriteStream(OUTPUT_FILE_NAME);
		fileStream.on("close", () => {
			console.timeEnd("write");
			console.timeEnd("solution");
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
reader
	.eachRow(rowData => {
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
				console.time("write");
				saveToFile(rows);
			})
			.catch(error => {
				console.log(error);
			});
	});
