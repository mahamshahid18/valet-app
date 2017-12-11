_The git remote for the repo is named *valet*_


Usage Instructions
==================
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

_The sections below are technical documentation_

user perspective
================
- gives details upon arrival
- receives text message and opens up the link
- clicks on call car and is taken to payment gateway
now on payment gateway, after he presses send, on the frontend, a call is made to the banking api which may accept or refuse payment. if the payment is accepted, in the callback success function => call the backend and let it know that the ticket no blah blah has been paid
- user is taken to thank you screen which will contain a qr code having information about the ticket number, amount to be paid and payment status


valet perspective
=================
- takes details upon arrival and clicks on generate ticket
this makes a call to the backend which will generate a ticket number using a random number generator merged with the license plate of the car. OR it can be a sequential number merged with the license plate
- backend gives a notification to the frontend when a car has been requested. valet can just go ahead and bring the car and when the owner arrives, scan a QR code which is available on their thank you screen to validate if the ticket has already been paid. [for this, there can be a requests drop down menu which will have all the requested car's list and every valet using the application will be able to see this list]


Database Design
===============

table: users

|

|---- full_name

|---- phone_number

|---- car_reg_no

|---- car_color

|---- car_model_make

|---- ticket_no

|---- payment_status

|---- amount_to_be_paid


API Design
==========
-------------------------------------------
POST {baseurl}/generateTicket

 -- params
  +  name
  +  phone_number
  +  reg_no
  +  color
  +  model_make

 -- returns
  +  none [calls api to send sms]

 -- description
  + to generate ticket, store
    all data into the db, create
    link for ticket & send sms
-------------------------------------------

-------------------------------------------
GET {baseurl}/updatePaymentStatus

 -- params
  +  ticket_no (body param)

 -- returns
  +  none

 -- description
  + to update the payment status
    of the ticket number received
    (after decoding of course)
-------------------------------------------

-------------------------------------------
GET {baseurl}/user?ticket=

 -- params
  +  ticket (query param)

 -- returns
  +  ticket_no (not encrypted one)
  + name
  + fee to be paid

 -- description
  + to get the base page on the client side
    which has options for calling car,
    making payment etc
-------------------------------------------

-------------------------------------------
GET {baseurl}/user/validation?ticket=

 -- params
  +  ticket (query param) [the encrpted
                            ticket number]

 -- returns
  +  qr_code containing info: car_reg_no,
     payment status, amount paid

 -- description
  + to create qr_code for verification of a 
    specific ticket
-------------------------------------------


stuff to be used
================
https://github.com/soldair/node-qrcode [create qrcode]
https://cdnjs.com/libraries/socket.io   [in the future]