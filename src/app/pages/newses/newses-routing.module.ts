import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsesPage } from './newses.page';

const routes: Routes = [
  {
    path: '',
    component: NewsesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsesPageRoutingModule {}
