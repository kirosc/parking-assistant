import axios from 'axios';
import { Extent, Location, Vehicle } from './interface';

axios.defaults.baseURL = 'https://api.data.gov.hk/v1/carpark-info-vacancy';

getAvailableParks('privateCar', {
  latitude: 22.458203,
  longitude: 113.995683
});

// Get all parks that has vacancy of a certain vehicle type within the radius
export async function getAvailableParks(
  vehicleTypes: Vehicle,
  location: Location,
  radius: number = 2
) {
  const { leftLong, botLat, rightLong, topLat } = getExtent(location, radius);
  const extent = `${leftLong},${botLat},${rightLong},${topLat}`;

  let res = await getVacancy(vehicleTypes, extent);
  return res.filter((park: any) => park[vehicleTypes][0].vacancy > 0);
}

// Get vacancy of parks
async function getVacancy(vehicleTypes: Vehicle, extent?: string) {
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
function getExtent({ latitude, longitude }: Location, radius: number): Extent {
  let topLat, botLat, leftLong, rightLong: number;

  topLat = latitude + radius / 110.574;
  botLat = latitude - radius / 110.574;
  leftLong = longitude - radius / (111.32 * Math.cos(toRadians(latitude)));
  rightLong = longitude + radius / (111.32 * Math.cos(toRadians(latitude)));

  return { topLat, botLat, leftLong, rightLong };
}

function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}
