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

import {CommonModule} from '@angular/common';
import {Component, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../../core/core.module';
import {PermissionsDialogDeleteComponent} from './permissions-dialog-delete/permissions-dialog-delete.component';
import {PermissionsDialogImportComponent} from './permissions-dialog-import/permissions-dialog-import.component';
import {PermissionsEditComponent} from './permissions-edit/permissions-edit.component';
import {PermissionsListComponent} from './permissions-list/permissions-list.component';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {
}

const routes: Routes = [
  {
    path: 'permissions',
    component: RoutingComponent,
    children: [
      {
        path: '',
        component: PermissionsListComponent,
      },
      {
          path: 'edit',
          component: PermissionsEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatAutocompleteModule,
    MatSelectModule,
    MatRadioModule,
    MatSortModule,
    MatSnackBarModule,
    CoreModule,
    FlexLayoutModule,
  ],
  declarations: [
    PermissionsListComponent,
    PermissionsEditComponent,
    RoutingComponent,
    PermissionsEditComponent,
    PermissionsDialogDeleteComponent,
    PermissionsDialogImportComponent,
  ],
})
export class PermissionsModule { }
