import { combineReducers } from "@reduxjs/toolkit";
import user from "./user";
import teams from './team';
import global from './global';

const rootReducer = combineReducers({
  user,
  teams,
  global
})

export default rootReducer;