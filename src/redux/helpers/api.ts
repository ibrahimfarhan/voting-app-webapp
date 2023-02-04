import { showAlert } from './../../utils/utils';
import { showMessage } from './../actions/global';
import { ActionCreatorWithPayload, Dispatch } from '@reduxjs/toolkit';
import { getResponseBody } from '../../api/call-api';

export interface CreateThunkParams<T> {
  path: string
  successActionCreator?: ActionCreatorWithPayload<T, string>
  failureActionCreator?: ActionCreatorWithPayload<any, string>
  additionalReqOptions?: RequestInit
  successActionPayload?: any,
  onSuccess?: (dispatch: Dispatch, data: any) => void
  onFailure?: (dispatch: Dispatch, data: any) => void
}
export const createThunk = <T>({
  path,
  successActionCreator,
  failureActionCreator,
  additionalReqOptions,
  successActionPayload,
  onSuccess,
  onFailure
}: CreateThunkParams<T>) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch(path, stdRequestOptions(additionalReqOptions || {}));
      const resBody = await getResponseBody(response);

      if (!response.ok) {
        if (onFailure) onFailure(dispatch, resBody.message);
        else if (failureActionCreator) dispatch(failureActionCreator(resBody.message))
        else showAlert(dispatch, { content: resBody.message, type: 'error' });
        return;
      }

      if (onSuccess) onSuccess(dispatch, resBody);
      else if (successActionCreator) dispatch(successActionCreator(successActionPayload || resBody));
    }

    catch (e) {
      const defaultMsg = 'Connection Error';
      if (onFailure) onFailure(dispatch, defaultMsg);
      else if (failureActionCreator) dispatch(failureActionCreator(defaultMsg))
      else showAlert(dispatch, { content: defaultMsg, type: 'error' });
    }
  }
};

export const stdRequestOptions = (reqOptions: RequestInit): RequestInit => Object.assign({
  headers: { 'content-type': 'application/json' },
  credentials: 'include',
}, reqOptions);