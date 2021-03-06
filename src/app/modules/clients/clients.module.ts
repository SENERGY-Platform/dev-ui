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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../../core/core.module';
import {AddEditClientComponent} from './add-edit-client/add-edit-client.component';
import {ViewClientsComponent} from './view-clients/view-clients.component';

@Component({
    template: '<router-outlet></router-outlet>',
})
export class RoutingComponent {
}

const routes: Routes = [
    {
        path: 'clients',
        component: RoutingComponent,
        children: [
            {
                path: ':id',
                component: AddEditClientComponent,
            },
            {
                path: '',
                component: ViewClientsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        TranslateModule.forChild(),
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        CoreModule,
    ],
    declarations: [
        AddEditClientComponent,
        RoutingComponent,
        ViewClientsComponent,
    ],
})
export class ClientsModule {
}
