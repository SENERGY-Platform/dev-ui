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

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleServiceDocComponent } from './single-service-doc/single-service-doc.component';

import { RouterModule, Routes } from '@angular/router';
import { ValidTokenGuard } from '../services/auth/guard.service';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {}

const routes: Routes = [
  { 
    path: 'api',
    component: RoutingComponent,
    canActivate: [ValidTokenGuard],
    children: [{
      path: ':id',
      component: SingleServiceDocComponent,
      canActivate: [ValidTokenGuard]
    },
    {
      path: '',
      component: ApiDocsComponent,
      canActivate: [ValidTokenGuard]
    }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    FormsModule,
    TranslateModule.forRoot(),
  ],
  declarations: [
   SingleServiceDocComponent,
   ApiDocsComponent,
   RoutingComponent
  ]
})
export class ApiDocModule { }
