import express from 'express';
import bodyParser from 'body-parser';
import {
  dialogflow,
  Permission,
  DialogflowConversation,
  Suggestions,
  BrowseCarousel
} from 'actions-on-google';
import { Location, Vehicle } from './lib/interface';
import { getAvailableParks } from './lib/helper';

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
  if (vehicle === 'CV' || vehicle === 'coach') {
    conv.ask('唔好意思，我現時未支持呢個車種嘅車位資訊！');
    return;
  }

  let { latitude, longitude }: any = conv.device.location?.coordinates;

  if (latitude === undefined || longitude === undefined) {
    conv.ask('唔好意思，我未有你嘅GPS位置！');
    return
  }  

  let location: Location = { latitude, longitude };
  let parks = await getAvailableParks(vehicle as Vehicle, location);
  
  if (parks.length === 0) {
    conv.ask('現時附近未有空置車位！')
  } else {
    conv.ask('Testing');
  }
});

const server = express().use(bodyParser.json());

server.post('/fulfillment', app);

server.listen(port);
console.log(`Express listening on port ${port}!`);
