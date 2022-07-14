export interface SubscriptionPlan {
  PlanName: string;
  id: number;
  PlanDetails: string;
  Amount: number;
  Days: number;
  IsActive: boolean;
  CreatedDate: string;
  CreatedBy: number;
  UpdatedDate: string;
  UpdatedBy: string;
  id_FkPaymentTransaction?: number;
  id_FkSubscriptionPlan?: number;
  planId: number;
}

export interface SubscriptionResponse {
  status: number;
  data: SubscriptionPlan[];
}
