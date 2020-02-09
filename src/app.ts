import express from 'express';
import bodyParser from 'body-parser';
import {
  dialogflow,
  Permission,
  DialogflowConversation,
  Suggestions
} from 'actions-on-google';

const port = process.env.PORT || 3000;
// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', conv => {
  conv.ask(
    new Permission({
      context: '繼續',
      permissions: ['NAME', 'DEVICE_PRECISE_LOCATION']
    })
  );
});

app.intent('actions_intent_PERMISSION', (conv, _, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask('拜拜!');
  } else {
    (<any>conv.data).userName = conv.user.name.given;
    conv.ask(`唔該晒, ${(<any>conv.data).userName}. 請問你揸緊咩車?`);
  }
});

app.intent('vehicle_type', async (conv, { vehicle }) => {
  // Respond with the user's lucky number and end the conversation.
  conv.ask(vehicle as Response);
});

const server = express().use(bodyParser.json());

server.post('/fulfillment', app);

server.listen(port);
console.log(`Express listening on port ${port}!`);
