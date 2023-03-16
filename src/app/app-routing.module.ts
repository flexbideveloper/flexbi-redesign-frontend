import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';

import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

import { FLEX_BI_ROUTES } from './shared/routes/flexbi-layout.routes';
import { AccessGuard } from './gaurd/access.gaurd';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full',
  },
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
  { path: '**', redirectTo: 'auth/sign-in' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
