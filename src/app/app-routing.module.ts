import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';

import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';
import { RedirectToDashboardCanActivate } from './gaurd/redirect-to-dashboard-guard';
import { AuthGuard } from './gaurd/auth.gaurd';
import { FLEX_BI_ROUTES } from './shared/routes/flexbi-layout.routes';
import { AccessGuard } from './gaurd/access.gaurd';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    data: { title: 'full Views' },
    canActivate: [AccessGuard],
    children: FLEX_BI_ROUTES,
  },
  {
    path: '',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
