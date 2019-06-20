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
import { PermissionsAddComponent } from './permissions-add/permissions-add.component';
import { PermissionsListComponent } from './permissions-list/permissions-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ValidTokenGuard } from '../services/auth/guard.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionsEditComponent } from './permissions-edit/permissions-edit.component';
import { PermissionsDialogDeleteComponent } from './permissions-dialog-delete/permissions-dialog-delete.component';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {}

const routes: Routes = [
  {
    path: 'permissions',
    component: RoutingComponent,
    canActivate: [ValidTokenGuard],
    children: [
      {
        path: 'add',
        component: PermissionsAddComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: '',
        component: PermissionsListComponent,
        canActivate: [ValidTokenGuard]
      },
      {
          path: 'edit',
          component: PermissionsEditComponent,
          canActivate: [ValidTokenGuard]
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
  ],
  declarations: [
    PermissionsAddComponent,
    PermissionsListComponent,
    PermissionsEditComponent,
    RoutingComponent,
    PermissionsEditComponent,
    PermissionsDialogDeleteComponent
  ]
})
export class PermissionsModule { }
