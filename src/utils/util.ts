import fs from 'fs';

// tslint:disable-next-line: no-empty
export const noop = (...params: any) => {};

export const isNotSet = (value: any): boolean => {
  return value != null;
};

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const fileExists = (path: string): boolean => {
  return fs.existsSync(path);
};
