import axios from 'axios';

interface Extent {
  readonly topLat: number;
  readonly botLat: number;
  readonly leftLong: number;
  readonly rightLong: number;
}

axios.defaults.baseURL = 'https://api.data.gov.hk/v1/carpark-info-vacancy';

async function getVacancy(vehicleTypes: string) {
  const res = await axios.get('', {
    params: {
      vehicleTypes,
      lang: 'zh_TW'
    }
  });
}

function getExtent(
  latitude: number,
  longtitude: number,
  radius: number
): Extent {
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
