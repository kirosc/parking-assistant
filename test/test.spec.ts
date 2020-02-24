import chai from 'chai';
//@ts-ignore
import chaiFiles from 'chai-files';
import fs from 'fs';
import { saveToJSON, readJSON } from '../src/lib/io';
import { getAvailableParks, buildItem } from '../src/lib/helper';
import { Location } from '../src/lib/interface';

chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;
const dir = chaiFiles.dir;

describe('IO', () => {
  const obj: any = { str: 'value', num: 1 };
  const path: string = './dist/src/data/test.json';

  describe('Save to JSON', () => {
    saveToJSON(path, obj);

    it('Should create a new directory', () =>
      expect(dir('./dist/src/data')).to.exist);

    it('Should create a new file', () => expect(file(path)).to.exist);

    it('Should match content', () =>
      expect(file(path)).to.equal('{"str":"value","num":1}'));
  });

  describe('Read JSON', () => {
    const readObj = readJSON('test');
    const nonExistedObj = readJSON('foo');

    it('Should match content', () => expect(readObj).deep.equal(obj));

    it('Should log error on non-existed file', () =>
      expect(nonExistedObj).equal(undefined));
  });

  after(() => {
    fs.unlink(path, err => {
      if (err) console.error(err);
    });
  });
});

describe('Helper', () => {
  describe('Get available parks', () => {
    const loc: Location = {
      latitude: 22.3229743,
      longitude: 114.1654584
    }

    describe('Private car', () => {
      it('Should return an array', async () => {
        const res = await getAvailableParks('privateCar', loc);
        
        expect(res).to.be.an('array');
  
        if (res.length > 0) {
          expect(res[0]).to.be.an('object');
          expect(res[0]).to.have.property('park_Id').that.is.a('string');
          expect(res[0]).to.have.property('privateCar').that.is.an('array');
        }
      });
    });

    describe('Light van', () => {
      it('Should return an array', async () => {
        const res = await getAvailableParks('LGV', loc);
        
        expect(res).to.be.an('array');

        if (res.length > 0) {
          expect(res[0]).to.be.an('object');
          expect(res[0]).to.have.property('park_Id').that.is.a('string');
          expect(res[0]).to.have.property('LGV').that.is.an('array');
        }
      });
    });

    describe('Motor Cycle', () => {
      it('Should return an array', async () => {
        const res = await getAvailableParks('motorCycle', loc);
        
        expect(res).to.be.an('array');

        if (res.length > 0) {
          expect(res[0]).to.be.an('object');
          expect(res[0]).to.have.property('park_Id').that.is.a('string');
          expect(res[0]).to.have.property('motorCycle').that.is.an('array');
        }
      });
    });
  });

  describe('Build Response', () => {
    describe('Item', () => {
      const park = JSON.parse('{"park_Id": "10", "privateCar": [{"vacancy_type": "A", "vacancy": 56, "lastupdate": "2020-02-23 14:50:44"}]}');
      const parkInfo = JSON.parse('{"park_Id": "10", "name": "啟德郵輪碼頭停車場 1", "nature": "commercial", "carpark_Type": "off-street", "address": {"floor": "1", "buildingName": "啟德郵輪碼頭", "streetName": "承豐路", "buildingNo": "33", "subDistrict": "九龍灣", "dcDistrict": "觀塘區", "region": "九龍"}, "displayAddress": "九龍九龍灣承豐路33號啟德郵輪碼頭1樓", "district": "觀塘區", "latitude": 22.3062049, "longitude": 114.21309471, "contactNo": "+852 3465 6888, 09:30-18:00 Mon-Fri, except public holiday", "renditionUrls": {"square": "https://sps-opendata.pilotsmartke.gov.hk/rest/getRendition/fs-1%3A693265207413252869411532657339312395903827562313.JPG/square.png", "thumbnail": "https://sps-opendata.pilotsmartke.gov.hk/rest/getRendition/fs-1%3A693265207413252869411532657339312395903827562313.JPG/thumbnail.png", "banner": "https://sps-opendata.pilotsmartke.gov.hk/rest/getRendition/fs-1%3A693265207413252869411532657339312395903827562313.JPG/banner.png"}, "website": "http://www.kaitakcruiseterminal.com.hk/", "opening_status": "OPEN", "openingHours": [{"weekdays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "PH"], "excludePublicHoliday": false, "periodStart": "07:00", "periodEnd": "23:00"}], "gracePeriods": [{"minutes": 10}], "heightLimits": [{"height": 2}], "facilities": ["disabilities", "evCharger"], "paymentMethods": ["octopus", "visa"], "privateCar": {"hourlyCharges": [{"periodStart": "07:00", "periodEnd": "23:00", "price": 10, "type": "hourly", "covered": "covered", "usageMinimum": 1, "remark": "此停車場不提供通宵停泊 (行政費: 每晚$250，另加時租泊車費用)。", "excludePublicHoliday": true, "weekdays": ["MON", "TUE", "WED", "THU", "FRI"]}, {"periodStart": "07:00", "periodEnd": "23:00", "price": 15, "usageMinimum": 1, "type": "hourly", "covered": "covered", "remark": "此停車場不提供通宵停泊 (行政費: 每晚$250，另加時租泊車費用)。", "excludePublicHoliday": false, "weekdays": ["SAT", "SUN", "PH"]}], "spaceUNL": 0, "spaceEV": 0, "spaceDIS": 0, "space": 114}, "LGV": {"spaceUNL": 0, "spaceEV": 0, "spaceDIS": 0, "space": 0}, "HGV": {"spaceUNL": 0, "spaceEV": 0, "spaceDIS": 0, "space": 0}, "coach": {"spaceUNL": 0, "spaceEV": 0, "spaceDIS": 0, "space": 0}, "motorCycle": {"spaceUNL": 0, "spaceEV": 0, "spaceDIS": 0, "space": 0}, "creationDate": "2016-08-16 10:03:56", "modifiedDate": "2018-12-12 12:22:47", "publishedDate": "2018-12-12 12:22:47", "lang": "zh_TW"}');

      const item = buildItem(park, parkInfo, 'privateCar');
      
      expect(item).to.be.an('object');
      expect(item).to.have.property('title').that.is.a('string');
      expect(item).to.have.property('description').that.is.a('string');
      expect(item).to.have.property('image').that.is.an('object');
      expect(item.image).to.have.property('url').that.is.a('string');
      expect(item.image).to.have.property('accessibilityText').that.is.a('string');
    });
  });
});
