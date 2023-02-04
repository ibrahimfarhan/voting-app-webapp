import { createAction } from "@reduxjs/toolkit";
import { GlobalMessage } from "../../models/global-message";

export const showMessage = createAction<GlobalMessage>('showMessage');
export const hideMessage = createAction('hideMessage');