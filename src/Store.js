import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return {
        ...state,
        userInfo: action.payload.user,
        token: action.payload.token,
      };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        token: null,
      };
    case "PROFILE_UPDATE":
      return { ...state, userInfo: action.payload };
    case "SET_FULLBOX_ON":
      return { ...state, fullBox: true };
    case "SET_FULLBOX_OFF":
      return { ...state, fullBox: false };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
