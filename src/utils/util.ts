import fs from 'fs';

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const fileExists = (path: string): boolean => {
  return fs.existsSync(path);
};
