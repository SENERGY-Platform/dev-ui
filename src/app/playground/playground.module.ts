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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { ValidTokenGuard } from '../services/auth/guard.service';
import { DevicesimAddActuatorComponent } from './devicesim-add-actuator/devicesim-add-actuator.component';
import { DevicesimAddComponent } from './devicesim-add/devicesim-add.component';
import { DevicesimListComponent } from './devicesim-list/devicesim-list.component';
import { EditActuatorComponent } from './edit-actuator/edit-actuator.component';
import { EditSensorComponent } from './edit-sensor/edit-sensor.component';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {}

const routes: Routes = [
  {
    path: 'devicesim',
    component: RoutingComponent,
    canActivate: [ValidTokenGuard],
    children: [
      {
        path: 'sensor',
        component: RoutingComponent,
        canActivate: [ValidTokenGuard],
        children: [
          {
            component: EditSensorComponent,
            path: 'edit',
          },
          {
            component: DevicesimAddComponent,
            path: 'add',
          },
        ],
      },
      {
        path: 'actuator',
        component: RoutingComponent,
        canActivate: [ValidTokenGuard],
        children: [
          {
            component: EditActuatorComponent,
            path: 'edit',
          },
          {
            component: DevicesimAddActuatorComponent,
            path: 'add',
          },
        ],
      },
      {
        path: '',
        component: DevicesimListComponent,
        canActivate: [ValidTokenGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    DevicesimListComponent,
    DevicesimAddComponent,
    RoutingComponent,
    DevicesimAddActuatorComponent,
    EditActuatorComponent,
    EditSensorComponent,
  ],
})
export class PlaygroundModule { }
