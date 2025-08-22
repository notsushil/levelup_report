// Optional reducer if you later migrate complex state here.
export const initialState = {
  rows: [],
  roster: {},
  logs: { gaming:[], bar:[], incidents:[] },
  jackpots: {},
};

export function reportReducer(state, action){
  switch(action.type){
    default:
      return state;
  }
}
