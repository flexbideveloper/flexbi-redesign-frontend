import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const FLEX_BI_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'data-accounts',
    loadChildren: () =>
      import('../../xero-integration/xero-integration.module').then(
        (m) => m.XeroIntegrationModule
      ),
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('../../subscriptions/subscriptions.module').then(
        (m) => m.SubscriptionsModule
      ),
  },
];
