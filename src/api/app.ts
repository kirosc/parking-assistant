import express from 'express';
import bodyParser from 'body-parser';
import {
  dialogflow,
  Permission,
  Suggestions,
  Response,
  BrowseCarousel,
  BrowseCarouselItem,
  Carousel,
  CarouselOptionItem
} from 'actions-on-google';
import { Location, Vehicle } from '../lib/interface';
import {
  getAvailableParks,
  buildCard,
  buildeBrowsingCarouselItem,
  buildItem
} from '../lib/helper';
import { readJSON } from '../lib/io';
import { OptionItems } from 'actions-on-google/dist/service/actionssdk';

require('dotenv').config();

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
    conv.ask(new Suggestions(['私家車', '貨van', '電單車']));
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
    return;
  }
  
  const hasWebBrowser = conv.surface.capabilities.has(
    'actions.capability.WEB_BROWSER'
  );
  const location: Location = { latitude, longitude };
  const parks = await getAvailableParks(vehicle as Vehicle, location);

  if (parks.length === 0) {
    conv.ask('現時附近未有空置車位！');
  } else {
    const info = readJSON('parks');
    let items: BrowseCarouselItem[] | OptionItems<CarouselOptionItem>;
    let prompt: string, response: Response;

    if (parks.length === 1) {
      const park = parks[0];
      const parkInfo = info[park.park_Id];

      prompt = '以下係附近唯一有空位嘅停車場。';
      response = buildCard(park, parkInfo, vehicle as Vehicle);
    } else {
      if (hasWebBrowser) {
        items = [];
        for (let i = 0; i < parks.length && i < 10; i++) {
          const park = parks[i];
          const parkInfo = info[park.park_Id];
          items.push(
            buildeBrowsingCarouselItem(park, parkInfo, vehicle as Vehicle)
          );
        }

        prompt = '以下係附近2公里內有空位嘅停車場。選擇其中一個嚟開始導航！';
        response = new BrowseCarousel({ items });
      } else {
        items = {};
        for (let i = 0; i < parks.length && i < 10; i++) {
          const park = parks[i];
          const parkInfo = info[park.park_Id];
          items[park.park_Id] = buildItem(park, parkInfo, vehicle as Vehicle);
        }

        prompt = '以下係附近2公里內有空位嘅停車場。';
        response = new Carousel({ items });
      }
    }

    conv.ask(prompt);
    conv.ask(response);
    conv.ask(new Suggestions(['私家車', '貨van', '電單車']));
  }
});

const server = express().use(bodyParser.json());

server.post('/fulfillment', app);

server.listen(port);
console.log(`Express listening on port ${port}!`);
