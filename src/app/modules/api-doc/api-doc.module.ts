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
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {CoreModule} from '../../core/core.module';
import { SingleServiceDocComponent } from './single-service-doc/single-service-doc.component';

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiDocsComponent } from './api-docs/api-docs.component';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {}

const routes: Routes = [
  {
    path: 'api',
    component: RoutingComponent,
    children: [{
      path: ':id',
      component: SingleServiceDocComponent,
    },
    {
      path: '',
      component: ApiDocsComponent,
    },
    ],
  },
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule.forChild(),
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        CoreModule,
        FlexLayoutModule,
        MatIconModule,
    ],
  declarations: [
   SingleServiceDocComponent,
   ApiDocsComponent,
   RoutingComponent,
  ],
})
export class ApiDocModule { }
