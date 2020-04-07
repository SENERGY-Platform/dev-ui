/*
 *
 *     Copyright 2018 InfAI (CC SES)
 *
 *     Licensed under the Apache License, Version 2.0 (the “License”);
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an “AS IS” BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { ValidTokenGuard } from '../services/auth/guard.service';
import { AddEditClientComponent } from './add-edit-client/add-edit-client.component';
import { ViewClientsComponent } from './view-clients/view-clients.component';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {}

const routes: Routes = [
  {
    path: 'clients',
    component: RoutingComponent,
    canActivate: [ValidTokenGuard],
    children: [
      {
        path: ':id',
        component: AddEditClientComponent,
        canActivate: [ValidTokenGuard],
      },
      {
        path: '',
        component: ViewClientsComponent,
        canActivate: [ValidTokenGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    FormsModule,
  ],
  declarations: [
    AddEditClientComponent,
    RoutingComponent,
    ViewClientsComponent,
  ],
  entryComponents: [

  ],
})
export class ClientsModule { }
