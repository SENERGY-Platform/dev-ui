import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder} from '@angular/forms';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {AuthService} from '../../../core/services/auth/auth.service';
import {AuthServiceMock} from '../../../core/services/auth/auth.service.mock';
import {LadonService} from '../shared/ladon/ladon.service';
import {LadonServiceMock} from '../shared/ladon/ladon.service.mock';
import {PermissionModel} from '../shared/permission.model';
import {UserManagementService} from '../shared/user-management/user-management.service';
import {UserManagementServiceMock} from '../shared/user-management/user-management.service.mock';

import {PermissionsEditComponent} from './permissions-edit.component';

describe('PermissionsEditComponent', () => {
    let component: PermissionsEditComponent;
    let fixture: ComponentFixture<PermissionsEditComponent>;

    const snackBarMock = jasmine.createSpyObj(['open']);

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionsEditComponent],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {} as PermissionModel},
                UntypedFormBuilder,
                {provide: AuthService, useClass: AuthServiceMock},
                {provide: UserManagementService, useClass: UserManagementServiceMock},
                {
                    provide: ActivatedRoute, useValue: {
                        params: of([{id: 0}]),
                        snapshot: {
                            paramMap: {
                                get: (s) => '',
                            },
                        },
                    },
                },
                {provide: LadonService, useClass: LadonServiceMock},
                {provide: MatSnackBar, useValue: snackBarMock},
            ],
            imports: [
                MatAutocompleteModule,
                MatCheckboxModule,
                MatRadioModule,
                MatSelectModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
