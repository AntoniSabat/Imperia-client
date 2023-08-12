import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {calendar} from "ionicons/icons";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    // children: [
    //   {
    //     path: 'calendar',
    //     children: [
    //       {
    //         path: '',
    //         loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarPageModule)
    //       }
    //     ]
    //   },
    //   {
    //     path: 'payments',
    //     children: [
    //       {
    //         path: '',
    //         loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsPageModule)
    //       }
    //     ]
    //   },
    //   {
    //     path: 'messenger',
    //     children: [
    //       {
    //         path: '',
    //         loadChildren: () => import('../messenger/messenger.module').then(m => m.MessengerPageModule)
    //       }
    //     ]
    //   },
    //   {
    //     path: '',
    //     redirectTo: 'calendar',
    //     pathMatch: 'full'
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
