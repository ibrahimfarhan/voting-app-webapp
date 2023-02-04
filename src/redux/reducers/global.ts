import { hideMessage, showMessage } from './../actions/global';
import { createReducer } from "@reduxjs/toolkit";
import { GlobalMessage } from "../../models/global-message";

const global = createReducer<{ message: GlobalMessage }>({ message: {} }, builder => {
  builder.addCase(showMessage, (state, action) => {
    state.message = action.payload
  });

  builder.addCase(hideMessage, state => {
    state.message = {};
  });
});

export default global;