'use strict';

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const dbConnectConfig = {
	host: "",
	port: "",
	user: "root",
	password: "",
	database: "",
	connectionLimit: 0
};
let baseUrl = "";

const setConfigSettings = () => {
	let configData = fs.readFileSync("config.json");
	configData = JSON.parse(configData);

	baseUrl = `${configData.baseUrl}:${configData.backendPort}`;
	dbConnectConfig.host = configData.baseUrl;
	dbConnectConfig.port= configData.dbPort;
	dbConnectConfig.user = configData.dbUserName;
	dbConnectConfig.password = configData.dbPassword;
	dbConnectConfig.database = configData.dbName;
	dbConnectConfig.connectionLimit = configData.dbConnLimit;
}

setConfigSettings();
// start of the sequence number for generating tickets
let seq_no = JSON.parse(fs.readFileSync('sequencer.json')).start;
const pool = mysql.createPool(dbConnectConfig);

const app = express();
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(3000, () => {
	console.log('Server started listening on port 3000');
});


app.route('/generateTicket')
	.post((req, res) => {
		const name = req.body.name;
		const phone_number = req.body.phone;
		const reg_no = req.body.reg_no;
		const color = req.body.color;
		const model_make = req.body.model_make;
		const ticket_no = `${seq_no}${reg_no}`;
		// convert ticket_no to base64 before building link
		const ticket_link = `baseUrl/user?enc_tic=${ticket_no}`;

		const query = 'INSERT INTO `users`\
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
		const values = [name, phone_number, reg_no, color, model_make, ticket_no, 0, 5];

		pool.getConnection((err, connection) => {
			if(err) {
				throw err;
			}
			connection.query(query, values, queryHandler);
			connection.release();
		});

		const queryHandler = (err, result) => {
			if(err) {
				// query failed
				const errorModel = {
					errorCode: 500,
					errorMessage: 'Error executing the query on db',
					errorObject: err
				};
				console.log(errorModel);
			} else {
				seq_no++;
				res.status(200);
				res.send();
				console.log(`ticket link is: ${ticket_link}`);
				// fix this
				fs.writeFile('sequencer.json', JSON.stringify({
					"start": seq_no
				}, null, 4));
			}
		}
	});