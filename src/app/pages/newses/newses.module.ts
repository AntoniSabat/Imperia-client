import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsesPageRoutingModule } from './newses-routing.module';

import { NewsesPage } from './newses.page';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsesPageRoutingModule,
    SharedModule
  ],
  declarations: [NewsesPage]
})
export class NewsesPageModule {}
