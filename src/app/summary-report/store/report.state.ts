import { createFeatureSelector } from '@ngrx/store';
import { IMessage } from 'src/app/services/message.service';
import { IGetMessages } from 'src/app/shared/conversions/conversions.component';
import {
  IUser,
  IVisual,
} from 'src/app/shared/input-suggetion/containers/input-box/input-box.component';
import { IReportPageVisuals } from '../interfaces/report.interface';
export const featureKey = 'reportModule';

export interface IReportState {
  orgId: string;
  data: IReportPageVisuals;
  isLoading: boolean;
  messages: {
    data: IGetMessages;
    loading: boolean;
  };
  users: {
    data: IUser[];
    loading: boolean;
  };
  visuals: {
    data: IVisual[];
    loading: boolean;
  };
}

export const initialState: IReportState = {
  orgId: '',
  data: null,
  isLoading: false,
  messages: {
    data: null,
    loading: false,
  },
  users: {
    data: [],
    loading: false,
  },
  visuals: {
    data: [],
    loading: false,
  },
};

export const selectFeature = createFeatureSelector<IReportState>(featureKey);
