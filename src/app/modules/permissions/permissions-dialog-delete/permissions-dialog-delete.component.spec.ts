import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {TranslateServiceMock} from '../../../core/services/translate.service.mock';

import {PermissionsDialogDeleteComponent} from './permissions-dialog-delete.component';

describe('PermissionsDialogDeleteComponent', () => {
    let component: PermissionsDialogDeleteComponent;
    let fixture: ComponentFixture<PermissionsDialogDeleteComponent>;

    beforeEach(async(() => {
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
