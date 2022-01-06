const initialState = {
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    }
    case "REGISTER": {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    }
    case "KEEP_PASSWORD": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "LOGOUT": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
