const express = require('express')
const bodyParser = require('body-parser')
const {dialogflow} = require('actions-on-google');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {color}) => {
    const luckyNumber = color.length;
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is ' + luckyNumber);
});
 
const server = express().use(bodyParser.json())
 
server.post('/fulfillment', app)
 
server.listen(3000)
console.log('Express listening on port 3000!')