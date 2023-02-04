import { hideMessage } from './../redux/actions/global';
import { GlobalMessage } from './../models/global-message';
import { Dispatch } from '@reduxjs/toolkit';
import { showMessage } from '../redux/actions/global';
export const returnIfLink = (str: string | undefined | null): string | undefined => {
  if (!str) return undefined;
  return ['http://', 'https://'].some(s => str.includes(s)) ? str : undefined;
};

export const getCssClasses = (stylesModule: any, ...classNames: string[]): string => {
  return classNames?.reduce((agg, n) => agg === '' ? stylesModule[n] : `${agg} ${stylesModule[n]}`
    , '');
};

export const isPromise = (value: any): boolean => value && typeof value.then === 'function';

export const arrayToObj = (arr: any[], key?: string) => arr.reduce((agg, el) => Object.assign(agg, { [key ? el[key] : el]: true }), {});

export const relocateElementToStart = (arr: any[], index: number) => {
  if (index < 0 || index >= arr.length) return arr;
  const el = arr.splice(index, 1)[0];
  arr.unshift(el);
  return arr;
};

export const showAlert = (dispatch: Dispatch, message: GlobalMessage) => {
  dispatch(showMessage(message));
  setTimeout(() => dispatch(hideMessage()), message.displayDuration || 5000);
};