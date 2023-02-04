import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../models/state-types";

export default function useDispatchAndSelector<T>(selector: (state: RootState) => T): [Dispatch<any>, T] {

  const dispatch = useDispatch();
  const state = useSelector<RootState, T>(selector);

  return [dispatch, state];
};
