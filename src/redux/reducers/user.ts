import { receiveUser, clearUserState } from './../actions/user';
import { createReducer } from '@reduxjs/toolkit';
import { UserState } from '../../models/state-types';

const initialUserState: UserState = {
  loading: true,
  isLoggedIn: false
};

const user = createReducer(initialUserState, (builder) => {

  builder.addCase(receiveUser, (state, action) => { 
    state.data = action.payload;
    if (!state.data.username) state.data.username = state.data.name || '';
    state.loading = false;
    state.isLoggedIn = true;
  });

  builder.addCase(clearUserState, (state) => { 
    state.loading = false;
    delete state.error;
    delete state.data;
    state.isLoggedIn = false;
  });

  builder.addDefaultCase((state) => { state = initialUserState });
});

export default user;