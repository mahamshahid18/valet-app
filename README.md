Name, mobile number, license plate



and then you get an sms 


help with efficeincy, make it convenient


call the car and then make a payment


generating random ticket no ==> HAS TO WORK
the ticket number will be linked 


how the ticket is generated (click of a button generates a ticket)  (how the system generates a random and unique code)
how does the code is sent to the sms
how can the ticket be validated




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


database
========

table: users
|
|---- s.no  [not needed]
|---- full_name
|---- phone_number
|---- car_reg_no
|---- car_color
|---- car_model_make
|---- ticket_no
|---- payment_status
|---- amount_to_be_paid


api
===
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
GET {baseurl}/updatePaymentStatus?enc_tic=

 -- params
  +  enc_tic (query param)

 -- returns
  +  none

 -- description
  + to update the payment status
    of the ticket number received
    (after decoding of course)
-------------------------------------------

-------------------------------------------
GET {baseurl}/user?enc_tic=

 -- params
  +  enc_tic (query param)

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
GET {baseurl}/user/validation?enc_tic=

 -- params
  +  enc_tic (query param) [the encrpted
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
https://cdnjs.com/libraries/socket.io
base64encode/decode from helper files already written :')
https://www.npmjs.com/package/qrcode-npm [create qrcode]
https://github.com/soldair/node-qrcode [create qrcode]
https://github.com/schmich/instascan [scan qrcode]
http://www.spryng.nl/ [for sending sms]