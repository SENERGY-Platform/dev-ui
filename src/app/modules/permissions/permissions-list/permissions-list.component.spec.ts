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

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {MatLegacyDialogHarness as MatDialogHarness} from '@angular/material/legacy-dialog/testing';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
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
