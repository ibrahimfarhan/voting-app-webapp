import { useEffect } from 'react';
import callApi from '../api/call-api';
import EntityState from '../models/state-types';
import useCombinedState from './use-combined-state';

const useFetch = <T>(path: string, reqOptions: RequestInit, effectDeps?: any[]): EntityState<T> => {

  const [state, setState] = useCombinedState<EntityState<T>>({ loading: true });

  useEffect(() => {
    callApi(path, reqOptions)
      .then(value => setState({ data: value as T, loading: false }))
      .catch(err => setState({ error: err.message, loading: false }));
  }, effectDeps || []);

  return state;
}

export default useFetch;