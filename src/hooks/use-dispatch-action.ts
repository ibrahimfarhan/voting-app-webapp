import { useDispatch } from "react-redux";

export default function useDispatchAction(action: any): void {

  const dispatch = useDispatch();
  dispatch(action);
}