import React, { useReducer } from "react";

export default function useCombinedState<T>(initialState: T): [T, React.Dispatch<T>] {

  const [state, setState] = useReducer((prevState: T, nextState: T) => Object.assign({}, prevState, nextState), initialState);
  
  return [state, setState];
}

