import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {TranslateService} from '@ngx-translate/core';
import {TranslateServiceMock} from '../../../core/services/translate.service.mock';

import {PermissionsDialogDeleteComponent} from './permissions-dialog-delete.component';

describe('PermissionsDialogDeleteComponent', () => {
    let component: PermissionsDialogDeleteComponent;
    let fixture: ComponentFixture<PermissionsDialogDeleteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionsDialogDeleteComponent],
            providers: [
                {provide: TranslateService, useClass: TranslateServiceMock},
                {provide: MatDialogRef, useValue: {}},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionsDialogDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
