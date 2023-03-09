export interface SignInRequest {
  PassWord: string;
  UserName: string;
  gcmTonken: string;
}

export interface IOrganisation {
  orgId: number;
  CompanyName: string;
}

export interface LoginResponse {
  data: UserDetail;
  message: string;
 
  
  planData: UserPlanData[];
  status: number;
  token: string;

  orgData : IOrganisation[];
  isAdvisor : boolean
}

export interface UserLoginResp {
  data : UserDetail
  planData : UserPlanData[]
}

export interface UserDetail {
  AuthToken: string;
  CompanyName: string;
  CreatedDate: string;
  Email: string;
  ForgetPasswordTime: string;
  IsActive: number;
  LastActivityDate: string;
  Password: {
    type: string;
    data: number[];
  };
  Provider: string;
  UniqueID: string;
  UserName: string;
  gcmToken: string;
  id: number;
  id_FkClientProfile: number;
  orgId:string | number
}

export interface AdminLoginResponse {
  data: AdminUser[];
  email: string;
  UserId: string;
  userName: string;
  token: string;
  message?: string;
}

export interface AdminUser {
  ChildModule: string;
  DisplayName: string;
  DisplayOrder: number;
  MainModuleDN: string;
  MainModuleDO: number;
  ModuleName: string;
  Operation: string;
  Permission: number;
  UserRole: string;
  UserRoleId: number;
}

export interface UserPlanData {
  CompanyName: string;
  Days: number;
  Email: string;
  EndDate: string;
  IsActive: number;
  PlanName: string;
  StartDate: string;
  UserName: string;
  id: number;
  id_FkClientProfile: number;
  id_FkSubscriptionPlan: number;
}

export interface SubscriptionPlan {
  Amount: number;
  CreatedBy: number;
  CreatedDate: string;
  Days: number;
  IsActive: boolean;
  PlanDetails: string;
  PlanName: string;
  UpdatedBy: number;
  UpdatedDate: number;
  id: number;
}

export interface RequestForgetPassword {
  emailId: string;
}

export interface CheckPasswordRequest {
  UniqueID: string;
}

export interface ChangePassword {
  password: string;
  passCode: string;
}
export interface CheckPasswordResponse {
  message: string;
  status: number;
  token?: string;
}

export interface CapchaVerified {
  message: string;
  status: number;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  // companyName: string;
  password: string;
  Provider: string;
  cPassword: string;
}

export interface SignUpResponse {
  message: string;
  status: number;
}

export interface AppSocialUser {
  UserName: string;
  Email: string;
  // CompanyName: string;
  Provider: string;
  UniqueID: string;
  AuthToken: string;
}

export interface AppSocialUserResponse {
  status: number;
  token?: string;
  message?: string;
  data: UserDetail;
}
