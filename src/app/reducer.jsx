import * as fun from "./action";

const initialState = {
  datas: [],
  titles: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case fun.set:
      return {
        ...state,
        datas: action.payload.data,
        titles: action.payload.titles
      };
    default:
      return state;
  }
};
