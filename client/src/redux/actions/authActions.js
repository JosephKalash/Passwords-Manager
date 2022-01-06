import { history } from "helpers/history";

export const keepPassword = (password) => {
  return (dispatch) => {
    dispatch({
      type: "KEEP_PASSWORD",
      payload: {
        password,
      },
    });
  };
};

export const login = (user) => {
  return (dispatch) => {
    dispatch({
      type: "LOGIN",
      payload: { ...user },
    });
    history.push("/");
  };
};

export const register = (user) => {
  return (dispatch) => {
    dispatch({
      type: "REGISTER",
      payload: { ...user },
    });
    history.push("/");
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };
};
