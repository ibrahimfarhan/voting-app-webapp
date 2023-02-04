import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { RootState } from '../models/state-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export interface UseReduxActionParams<T> {
  action: Function
  selector: (rootState: RootState) => T
  effectDeps?: Array<any>
  actionParams?: any[]
  useCache?: boolean
  cachedValueSelector?: (state: T) => any
  precedingAction?: ActionCreatorWithPayload<any, string>
  precedingActionParams?: any
}

export default function useReduxAction<T>({
  action,
  selector, 
  effectDeps = [], 
  actionParams = [], 
  useCache = false,
  cachedValueSelector = state => state,
  precedingAction,
  precedingActionParams
}: UseReduxActionParams<T>): T {

  const dispatch = useDispatch();
  const state = useSelector<RootState, T>(selector);

  useEffect(() => {
    if (useCache && cachedValueSelector(state)) return;
    if (precedingAction) dispatch(precedingAction(precedingActionParams));
    dispatch(action(...actionParams));
  }, effectDeps);

  return state;
};
