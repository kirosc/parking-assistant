import axios from 'axios';
import fs from 'fs';

axios.defaults.baseURL = 'https://api.data.gov.hk/v1/carpark-info-vacancy';

(async () => {
  let res = await transformData();

  fs.mkdir('./dist/data', null, (err) => {
    if (err) throw err;
  });
  saveToJSON('./dist/data/parks.json', res);
})();

// Convert the park info to a key-based data
async function transformData(): Promise<any> {
  let res: any = {};
  let parks = await getInfo('zh_TW');

  for (const park of parks) {
    const { park_Id } = park;

    // Create a new park
    if (!res[park_Id]) {
      // Delete the key property and save it
      delete park.park_Id;
      res[park_Id] = park;
    }
  }

  return res;
}

// Get the info of all car parks
async function getInfo(lang: string) {
  const res = await axios.get('', {
    params: { lang }
  });
  return res.data.results;
}

function saveToJSON(path: string, obj: any) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf-8');
}
