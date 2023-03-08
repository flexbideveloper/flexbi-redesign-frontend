import { IUser, IVisual } from "src/app/shared/input-suggetion/containers/input-box/input-box.component";

export interface IReport {
  ReportID: string;
  ReportName: string;
  RptID: number;
  WorkSpaceName: string;
  WorkspID: number;
  WorkspaceID: string;
  xeroReport: boolean;
}

export interface IReportPages {
  id: number;
  id_FkReport: number;
  id_FkClientProfile: number;
  PageName: string;
  PageDisplayName: string;
  EmbedPage: number;
  IsActive: 0 | 1;
  CreatedDate: string;
  UpdatedDate: any;
}

export interface IReportPages {
  id: number;
  id_FkReport: number;
  id_FkClientProfile: number;
  PageName: string;
  PageDisplayName: string;
  EmbedPage: number;
  IsActive: 0 | 1;
  CreatedDate: string;
  UpdatedDate: any;
}

export interface IReportVisuals {
  id: number;
  PageName: string;
  PageDisplayName: string;
  VisualName: string;
  VisualDisplayName: string;
  EmbedPage: 0 | 1;
  IsActive: 0 | 1;
  Height: string;
  Width: string;
  CreatedAt: string;
  UpdatedAt: any;
}

export interface IReportListResponse {
  data: IReport;
  isReportPagesPresent: boolean;
  isDbVisualsPresent: boolean;
  reportPages: IReportPages;
  visualSettings: IReportVisuals;
}

interface IEmbededUrl {
  embedUrl: IEmbededUrl;
  reportId: string;
  reportName: string;
  settings: {
    panes: {
      bookmarks: {
        visible: boolean;
      };
      fields: {
        expanded: boolean;
      };
      filters: { expanded: boolean; visible: boolean };
      pageNavigation: {
        visible: boolean;
      };
      selection: {
        visible: boolean;
      };
      syncSlicers: {
        visible: boolean;
      };
      visualizations: {
        visible: boolean;
      };
    };
  };
}

export interface IAuthPowerBI {
  accessToken: string;
  embedUrl: IEmbededUrl[];
}
export interface IReportPageVisuals {
  pages: IReportPages;
  tokenRes: IAuthPowerBI;
  visuals: IReportVisuals[];
}

