'use strict';

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const Twilio = require('twilio');
const helmet = require('helmet');

// global configuration settings
const dbConnectConfig = {
	host: '',
	port: '',
	user: 'root',
	password: '',
	database: '',
	connectionLimit: 0
};

const setConfigSettings = () => {
	let configData = fs.readFileSync('config.json');
	configData = JSON.parse(configData);

	dbConnectConfig.host = configData.baseUrl;
	dbConnectConfig.port= configData.dbPort;
	dbConnectConfig.user = configData.dbUserName;
	dbConnectConfig.password = configData.dbPassword;
	dbConnectConfig.database = configData.dbName;
	dbConnectConfig.connectionLimit = configData.dbConnLimit;
};

setConfigSettings();

// start of the sequence number for generating tickets
let seqNo = JSON.parse(fs.readFileSync('sequencer.json')).start;
const pool = mysql.createPool(dbConnectConfig);

const app = express();
// support encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
	res.send('Greetings, young one!');
});

app.listen(3000, () => {
	console.log('Server started; listening on port 3000');
});

/**
 * Endpoint to generate an e-ticket
 *
 * @name POST/generateTicket
 *
 * @param {string} name - Name of user
 * @param {string} phone - User's cellphone number
 * @param {string} reg_no - Car's registration number
 * @param {string} color - Car color
 * @param {string} model_make - Car's model & make
 *
 * Returns HTTP 200 OK status code
 */
app.route('/generateTicket')
	.post((req, res) => {
		const name = req.body.name;
		const phoneNumber = req.body.phone;
		const regNo = req.body.reg_no;
		const color = req.body.color;
		const modelMake = req.body.model_make;
		const ticketNum = `${seqNo}${regNo}`;
		// TODO: convert ticketNum to base64 before building link
		// TODO: convert base-url before shipping code
		const ticketLink =
			`http://${dbConnectConfig.host}/valet/app/templates/#!/user?ticket=${ticketNum}`;

		const query = 'INSERT INTO `users`\
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
		const values = [name,
			phoneNumber,
			regNo,
			color,
			modelMake,
			ticketNum,
			0,
			5
		];

		const queryHandler = (err) => {
			if (err) {
				// query failed, handle exception
				const errorModel = {
					errorCode: 500,
					errorMessage: 'Error executing the query on db',
					errorObject: err
				};
				console.log(errorModel);
			} else {
				seqNo++;

				// add twilio app credentials
				const accountSid = 'ACe95761f79c6402d49380108bdba3be0c';
				const authToken = '73cd5dd816f8ccbe3bde5ec5c21a6e35';
				const twilioPhoneNumber = '+18589430166';

				const client = new Twilio(accountSid, authToken);

				// send ticket link to user via sms
				client.messages.create({
					body: `Open up this link to view your valet ticket: ${ticketLink}`,
					to: phoneNumber,
					from: twilioPhoneNumber
				});

				console.log('Ticket generated!');
				console.log(ticketLink);

				res.status(200);
				res.send();

				fs.writeFile('sequencer.json', JSON.stringify({
					'start': seqNo
				}, null, 4));
			}
		};

		// db manipulation
		pool.getConnection((err, connection) => {
			if (err) {
				throw err;
			}
			connection.query(query, values, queryHandler);
			connection.release();
		});

	});


/**
 * Endpoint to get user details
 *
 * @name GET/user
 *
 * @param {string} ticket - Ticket number generated for user
 *
 * Returns HTTP 200 OK status code
 * Returns a JSON object containing user details
 */
app.route('/user')
	.get((req, res) => {
		// TODO: decode from base64 first
		const ticketNum = req.query.ticket;
		const query = 'SELECT * FROM `users` WHERE ticket_no = ?';

		const queryHandler = (err, result) => {
			if (err) {
				// query failed, handle exception
				const errorModel = {
					errorCode: 500,
					errorMessage: 'Error executing the query on db',
					errorObject: err
				};
				console.log(errorModel);
			} else {
				console.log('user data sent');
				
				res.status(200);
				res.send(result[0]);
			}
		};

		pool.getConnection((err, connection) => {
			if (err) {
				throw err;
			}
			connection.query(query, ticketNum, queryHandler);
			connection.release();
		});

	});


/**
 * Endpoint which returns data needed for QR Code
 * verificaton - to check if payment has been made
 *
 * @name GET/user/validation
 *
 * @param {string} ticket - Ticket number generated for user
 *
 * Returns HTTP 200 OK status code
 * Returns a JSON object containing user data for validation
 */
app.route('/user/validation')
	.get((req, res) => {
		// TODO: base64 decoding first
		const ticketNum = req.query.ticket;

		const query = 'SELECT full_name,\
				ticket_no,\
				car_reg_no,\
				payment_status,\
				amount_to_be_paid\
			FROM `users` WHERE ticket_no = ?';

		const queryHandler = (err, result) => {
			if (err) {
				// query failed, handle exception
				const errorModel = {
					errorCode: 500,
					errorMessage: 'Error executing the query on db',
					errorObject: err
				};
				console.log(errorModel);
			} else {
				const segments = [
					{'data': `${result[0].car_reg_no}\n`, mode: 'byte'},
					{'data': `${result[0].amount_to_be_paid}\n`, mode: 'byte'},
					{
						'data': result[0].payment_status === 0
							? 'UNPAID'
							: 'PAID',
						mode: 'alphanumeric'
					},
				];
				console.log('data sent');

				res.status(200);
				res.send(segments);
			}
		};

		pool.getConnection((err, connection) => {
			if (err) {
				throw err;
			}
			connection.query(query, ticketNum, queryHandler);
			connection.release();
		});

	});


/**
 * Endpoint which updates payment status when amount is paid
 *
 * @name POST/user/updatePaymentStatus
 *
 * @param {string} ticket - Ticket number generated for user
 *
 * Returns HTTP 200 OK status code on success
 */
app.route('/user/updatePaymentStatus')
	.post((req, res) => {
		// TODO: decode from base64 first
		console.log(req.body.ticket);
		const ticketNum = req.body.ticket;
		const query = 'UPDATE `users` SET payment_status = 1 WHERE ticket_no = ?';

		const queryHandler = (err) => {
			if (err) {
				// query failed, handle exception
				const errorModel = {
					errorCode: 500,
					errorMessage: 'Error executing the query on db',
					errorObject: err
				};
				console.log(errorModel);
			} else {
				console.log(`payment status updated for ticket no: ${ticketNum}`);
				res.status(200);
				res.send();
			}
		};

		pool.getConnection((err, connection) => {
			if (err) {
				throw err;
			}
			connection.query(query, ticketNum, queryHandler);
			connection.release();
		});

	});
