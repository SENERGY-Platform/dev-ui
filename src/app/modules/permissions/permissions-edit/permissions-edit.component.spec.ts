import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionsEditComponent],
            providers: [
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {} as PermissionModel},
                FormBuilder,
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
