import fs from 'fs';

export function saveToJSON(path: string, obj: any) {
  fs.mkdir(`${__dirname}/../data`, null, (err) => {
    if (err) throw err;
  });
  fs.writeFileSync(path, JSON.stringify(obj), 'utf-8');
}

export function readJSON(file: string) {
  try {
      const json = fs.readFileSync(`${__dirname}/../data/${file}.json`, 'utf8')
      return JSON.parse(json)
  } catch (err) {
      console.error("File read failed:", err)
  }
}