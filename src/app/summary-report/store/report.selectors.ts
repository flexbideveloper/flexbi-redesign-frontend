import { createSelector } from '@ngrx/store';

import {
  selectFeature,
} from './report.state';

export const getOrgId = createSelector(
  selectFeature,
  (state) => state.orgId
);


export const selectSummaryLoading = createSelector(
  selectFeature,
  (state) => state.isLoading
);

export const selectSummaryData = createSelector(
  selectFeature,
  (state) => state.data
);

export const selectMSGLoading = createSelector(
  selectFeature,
  (state) => state.messages.loading
);

export const selectMSGData = createSelector(
  selectFeature,
  (state) => {
    if(!state.messages.data){
      return []
    }else{
      let keysData = Object.keys(state.messages.data);
      let arrData = keysData.map((key: string) => ({
        title: key,
        data: state.messages.data[key],
      }));
      return arrData;
    }
  }
  );


  export const selectVisuals = createSelector(
    selectFeature,
    (state) => state.visuals.data
  );

  export const selectUsers = createSelector(
    selectFeature,
    (state) => state.users.data
  );

