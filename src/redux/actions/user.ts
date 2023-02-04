import { createAction } from '@reduxjs/toolkit';
import { LoginData, RegisterData, User } from '../../models/user';
import userApi from '../../api/user';
import { createThunk } from '../helpers/api';

export const receiveUser = createAction<User>('receiveUser');
export const clearUserState = createAction('clearUserState');

export const login = (data: LoginData) => createThunk({
  path: userApi.login,
  successActionCreator: receiveUser,
  additionalReqOptions: {
    method: 'post',
    body: JSON.stringify(data),
  }
});

export const register = (data: RegisterData) => createThunk({
  path: userApi.register,
  successActionCreator: receiveUser,
  additionalReqOptions: {
    method: 'post',
    body: JSON.stringify(data)
  }
});

export const logout = () => createThunk({
  path: userApi.logout,
  successActionCreator: clearUserState,
  additionalReqOptions: {
    method: 'POST',
  }
});

export const getCurrentUser = () => createThunk({
  path: userApi.current,
  successActionCreator: receiveUser,
  failureActionCreator: clearUserState
});