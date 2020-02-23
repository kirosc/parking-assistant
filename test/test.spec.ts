import chai from 'chai';
//@ts-ignore
import chaiFiles from 'chai-files';
import { saveToJSON, readJSON } from '../src/lib/io';

chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;
const dir = chaiFiles.dir;

describe('IO', () => {
  describe('Save to JSON', () => {
    const path: string = './dist/src/data/test.json';
    const obj: any = { str: 'value', num: 1 };
    saveToJSON(path, obj);

    it('Should create a new directory', () =>
      expect(dir('./dist/src/data')).to.exist);

    it('Should create a new file', () => expect(file(path)).to.exist);

    it('Should match content', () =>
      expect(file(path)).to.equal('{"str":"value","num":1}'));
  });
});
