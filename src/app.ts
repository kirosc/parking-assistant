import express from 'express';
import bodyParser from 'body-parser';
import { dialogflow } from 'actions-on-google';

const port = process.env.PORT || 3000;
// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, { color }) => {
    const luckyNumber = color.length;
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is ' + luckyNumber);
});

const server = express().use(bodyParser.json());

server.post('/fulfillment', app);

server.listen(port);
console.log(`Express listening on port ${port}!`);