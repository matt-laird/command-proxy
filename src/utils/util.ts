import fs from 'fs';

// tslint:disable-next-line: one-variable-per-declaration
export const envValue = <T = string>(key: string): T => {
  return process.env[key] as unknown as T;
};

// tslint:disable-next-line: no-empty
export const noop = (...params: any) => {};

export const isValueSet = (value: any): boolean => {
  return value != null;
};

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const fileExists = (path: string): boolean => {
  return fs.existsSync(path);
};
