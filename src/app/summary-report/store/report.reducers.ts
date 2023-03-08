import { createReducer, on } from '@ngrx/store';

import * as a from './report.actions';
import { initialState } from './report.state';

export const reportReducer = createReducer(
  initialState,
  on(a.init, () => ({
    ...initialState,
  })),

  on(a.setOrgId, (state, { orgId }) => ({
    ...state,
    orgId,
    isLoading :true,
    data : null
  })),

  on(a.load, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(a.loadSuccess, (state, { data }) => {
    return {
      ...state,
      data,
      isLoading: false,
    };
  }),

  on(a.loadMessage, (state) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        loading: true,
      },
    };
  }),

  on(a.loadMessageSuccess, (state, { data }) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        data,
        loading: false,
      },
    };
  }),

  on(a.loadUsersSuccess, (state, { data }) => {
    return {
      ...state,
      users: {
        ...state.users,
        data,
        loading: false,
      },
    };
  }),
  on(a.loadVisualsSuccess, (state, { data }) => {
    return {
      ...state,
      visuals: {
        ...state.visuals,
        data,
        loading: false,
      },
    };
  }),

  on(a.clearState, () => ({
    ...initialState,
  }))
);
