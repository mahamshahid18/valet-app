# Valet Ticket Automation Application

This application aims to automate the general flow of valet parking systems by handling the ticket generation, payment, and verification of payment digitally.

> [**This is the item to be reviewed in this repository**](https://github.com/mahamshahid18/valet-app/blob/master/app.js) 

## How It Works

There are 2 parts of the application. A user-facing application. And a version for the valets/parking attendants.
Upon arrival, the user simply has to provide his/her name, phone number and the car's details to the valet. The valet will generate a ticket for them using the application. And the user will get a link through SMS, to view the ticket and associated details. The user can also pay for the ticket. However, the payment system has not been integrated in the current version of the application.
When the user wants to leave, instead of handing over the ticket physically to the valet & waiting for the car to arrive, he/she can simply pay for the ticket online and then "Call Car" beforehand. They will receive a QR Code at this point, from the application. This has to be shown to the valet. And the car will be waiting to be picked up - without any wait.

## API Design

The application uses 4 endpoints. They have been documented below:

-------------------------------------------

#### POST {baseurl}/generateTicket

##### _Params_
  *  name
  *  phone_number
  *  reg_no
  *  color
  *  model_make

##### _Returns_
  *  200 OK

-------------------------------------------

#### POST {baseurl}/updatePaymentStatus

##### _Params_
  *  ticket_no (body param)

##### _Returns_
  *  200 OK

-------------------------------------------

#### GET {baseurl}/user

##### _Params_
  *  ticket (query param)

##### _Returns_
  *  ticket_no
  * name
  * amount_to_be_paid

-------------------------------------------

#### GET {baseurl}/user/validation

##### _Params_
  *  ticket (query param)

##### _Returns_
  *  segments (json data containing info for QR Code)

-------------------------------------------


## API Implementation

Please see the [complete implementation of the API backend here.](https://github.com/mahamshahid18/valet-app/blob/master/app.js)

## API Testing

The API's endpoints have been tested with [Postman](https://www.getpostman.com/). Please find the tests [here](https://github.com/mahamshahid18/valet-app/blob/master/Valet%20App.postman_collection.json)


## Usage Instructions

If you want to run the backend server (the REST API), please follow the following steps

* Install [Node.js](https://nodejs.org/en/download/) if you don't already have it installed
* Run `npm install` to install all dependencies
* Make changes in the `config.json` file to set IP Address and port accordingly
* Run `npm start` to start the server
* `app.js` code conforms to the [Node Style Guide](https://github.com/felixge/node-style-guide). Run `npm run lint` to lint the code


#### Extra Information

_This information is just to get the app working. For the app-developers only_

1. Add receiving number to verified list of numbers on Twilio to be able to send sms
    + Login with Twilio Account Credentials
    + Navigate to https://www.twilio.com/console/phone-numbers/verified
    + Click on the Add New Number button
    + Add the new number (+[country code][phone number]) => follow this format
    + Add in the verification code sent to that number
    + Number is verified. Now sms can be sent to this number

2. Find out IP address of the machine you're using
    + Click Start and type "PowerShell". Open it up
    + Now type `ipconfig`
    + Under the `Wireless LAN adapter Wi-Fi` heading, find the number listed with 'IPv4 address' (for example, it can be 192.168.1.7)
    + Copy this IP address

3. Change IP address in configuration file
    + Open up the `config.json` file in the main folder (of the project)
    + Replace the number listed against `baseUrl` field with the IP address you copied
    + Save changes

4. Start backend server
    + While within the main folder of the project (for example C:/users/user/Valet/), hold down the `Shift` key and right click with the mouse simultaneously inside the folder window.
    + Click on `Open PowerShell window here`
    + Now type in the following command to start the server: `node app`

And that's it. Now you can start using the application. Navigate to `http://{your_ip_address}/valet/app/templates/#!/` to open up the main page
