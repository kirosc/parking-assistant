import axios from 'axios';
import { Extent, Location, Vehicle } from './interface';
import { readJSON } from './io';
import {
  Image,
  BasicCard,
  Button,
  BrowseCarouselItem
} from 'actions-on-google';

axios.defaults.baseURL = 'https://api.data.gov.hk/v1/carpark-info-vacancy';

// Get all parks that has vacancy of a certain vehicle type within the radius
export async function getAvailableParks(
  vehicleTypes: Vehicle,
  location: Location,
  radius: number = 2
) {
  const { leftLong, botLat, rightLong, topLat } = getExtent(location, radius);
  const extent = `${leftLong},${botLat},${rightLong},${topLat}`;

  let res = await getVacancy(vehicleTypes, extent);
  const parkInfo = readJSON('parks');

  res = res.filter((park: any) => {
    if (park.hasOwnProperty(vehicleTypes)) {
      return park[vehicleTypes][0].vacancy > 0;
    }
  });
  res.sort((a: any, b: any) => {
    let locA: Location = {
        latitude: parkInfo[a.park_Id].latitude,
        longitude: parkInfo[a.park_Id].longitude
      },
      locB: Location = {
        latitude: parkInfo[b.park_Id].latitude,
        longitude: parkInfo[b.park_Id].longitude
      };

    let disA = getDistance(location, locA),
      disB = getDistance(location, locB);

    if (disA < disB) {
      return -1;
    } else if (disA === disB) {
      return 0;
    } else {
      return 1;
    }
  });

  return res;
}

// RichResponse Item for devices don't have browser
export function buildItem(park: any, parkInfo: any, vehicle: Vehicle) {
  return {
    title: parkInfo.name,
    description: toString(park[vehicle as string][0]),
    image: new Image({
      url: getImage(parkInfo),
      alt: parkInfo.name
    })
  };
}

// Return a Basic Card
export function buildCard(
  park: any,
  parkInfo: any,
  vehicle: Vehicle
): BasicCard {
  const { name, latitude, longitude } = parkInfo;
  return new BasicCard({
    text: toString(park[vehicle as string][0]),
    title: name,
    buttons: new Button({
      title: '導航',
      url: getDirectionLink({ latitude, longitude })
    }),
    image: new Image({
      url: getImage(parkInfo),
      alt: name
    }),
    display: 'CROPPED'
  });
}

// For devices that support browser for navigation
export function buildeBrowsingCarouselItem(
  park: any,
  parkInfo: any,
  vehicle: Vehicle
): BrowseCarouselItem {
  const { name, latitude, longitude } = parkInfo;
  return new BrowseCarouselItem({
    title: name,
    url: getDirectionLink({ latitude, longitude }),
    description: toString(park[vehicle as string][0]),
    image: new Image({
      url: getImage(parkInfo),
      alt: name
    })
  });
}

// Generate the description of a car park vacancy
function toString(park: any): string {
  let str = '';

  switch (park.vacancy_type) {
    case 'A':
      const { vacancy, vacancyEV, vacancyDIS } = park;
      const parseVacancy = (vacancy: number) => {
        if (vacancy > 0) {
          return vacancy;
        } else if (vacancy === 0) {
          return '0';
        } else {
          return '❓停車場未能提供數據';
        }
      };

      str += '🚗空置車位: ';
      str += parseVacancy(vacancy);

      // Electronic vehicle
      if (vacancyEV) {
        str += '\n🔌電動車車位: ';
        str += parseVacancy(vacancyEV);
      }

      // Disabled persons
      if (vacancyDIS) {
        str += '\n♿傷殘車位: ';
        str += parseVacancy(vacancyDIS);
      }
      break;
    case 'B':
      if (park.vacancy > 0) {
        str += '🈳有空置泊車位';
      } else if (park.vacancy === 0) {
        str += '🈵沒有空置泊車位';
      } else {
        str += '❓停車場未能提供數據';
      }
      break;
    case 'C':
      str += '⛔關閉';
      break;
  }

  return str;
}

function getDirectionLink({ latitude, longitude }: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
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

// Get distance between two locations in km
function getDistance(loc1: Location, loc2: Location): number {
  let { latitude: lat1, longitude: lon1 } = loc1;
  let { latitude: lat2, longitude: lon2 } = loc2;
  let earthRadiusKm = 6371;

  let dLat = toRadians(lat2 - lat1);
  let dLon = toRadians(lon2 - lon1);

  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}

function getImage(parkInfo: any): string {
  return (
    parkInfo.renditionUrls?.thumbnail ||
    parkInfo.renditionUrls?.carpark_photo ||
    'https://img.icons8.com/officel/120/000000/parking.png'
  );
}
