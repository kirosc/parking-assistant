import axios from 'axios';

interface Extent {
  readonly topLat: number;
  readonly botLat: number;
  readonly leftLong: number;
  readonly rightLong: number;
}

interface Location {
  readonly latitude: number;
  readonly longtitude: number;
}

axios.defaults.baseURL = 'https://api.data.gov.hk/v1/carpark-info-vacancy';

getAvailableParks('privateCar', { latitude: 22.458203, longtitude: 113.995683 });

async function getAvailableParks(
  vehicleTypes: string,
  location: Location,
  radius: number = 2
) {
  const { leftLong, botLat, rightLong, topLat } = getExtent(location, radius);
  const extent = `${leftLong},${botLat},${rightLong},${topLat}`;

  let res = await getVacancy(vehicleTypes, extent);
  res = res.filter((park: any) => park[vehicleTypes][0].vacancy > 0);
  
}

// Get vacancy of parks
async function getVacancy(vehicleTypes: string, extent?: string) {
  const res = await axios.get('', {
    params: {
      data: 'vacancy',
      vehicleTypes,
      extent,
      lang: 'zh_TW'
    }
  });

  return res.data.results;
}

// Transfer a radius to a bounding rectangle box
function getExtent({ latitude, longtitude }: Location, radius: number): Extent {
  let topLat, botLat, leftLong, rightLong: number;

  topLat = latitude + radius / 110.574;
  botLat = latitude - radius / 110.574;
  leftLong = longtitude - radius / (111.32 * Math.cos(toRadians(latitude)));
  rightLong = longtitude + radius / (111.32 * Math.cos(toRadians(latitude)));

  return { topLat, botLat, leftLong, rightLong };
}

function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}
