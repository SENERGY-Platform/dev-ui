/*
 *
 *       2018 InfAI (CC SES)
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
 * /
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogHarness} from '@angular/material/dialog/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {CoreModule} from '../../../core/core.module';
import {AuthService} from '../../../core/services/auth/auth.service';
import {AuthServiceMock} from '../../../core/services/auth/auth.service.mock';
import {LadonService} from '../shared/ladon/ladon.service';
import {LadonServiceMock} from '../shared/ladon/ladon.service.mock';
import {PermissionsListComponent} from './permissions-list.component';

describe('PermissionsListComponent', () => {
    let component: PermissionsListComponent;
    let fixture: ComponentFixture<PermissionsListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionsListComponent],
            providers: [
                {provide: AuthService, useClass: AuthServiceMock},
                {provide: LadonService, useClass: LadonServiceMock},
                {provide: MatDialog, useClass: MatDialogHarness},
            ],
            imports: [
                MatCardModule,
                MatCheckboxModule,
                MatIconModule,
                MatTableModule,
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
