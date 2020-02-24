import fs from 'fs';

export function saveToJSON(fileName: string, obj: any) {
  const dir = `${__dirname}/../data`;
  const filePath = `${dir}/${fileName}.json`;

  if (!fs.existsSync(dir)) {
    fs.mkdir(`${__dirname}/../data`, null, err => {
      if (err) console.error(err);
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(obj), 'utf-8');
}

export function readJSON(file: string) {
  try {
    const json = fs.readFileSync(`${__dirname}/../data/${file}.json`, 'utf8');
    return JSON.parse(json);
  } catch (err) {
    console.error('File read failed:', err);
  }
}
