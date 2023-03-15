import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {UntypedFormBuilder} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {CoreModule} from '../../../core/core.module';
import {ApiService} from '../../../core/services/api/api.service';
import {ApiServiceMock} from '../../../core/services/api/api.service.mock';
import {TranslateServiceMock} from '../../../core/services/translate.service.mock';
import {ClientService} from '../shared/client.service';
import {ClientServiceMock} from '../shared/client.service.mock';

import {ViewClientsComponent} from './view-clients.component';

describe('ViewClientsComponent', () => {
    let component: ViewClientsComponent;
    let fixture: ComponentFixture<ViewClientsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ViewClientsComponent],
            providers: [
                {provide: TranslateService, useClass: TranslateServiceMock},
                UntypedFormBuilder,
                {provide: ApiService, useClass: ApiServiceMock},
                {provide: ClientService, useClass: ClientServiceMock},
            ],
            imports: [
                MatCardModule,
                MatIconModule,
                CoreModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewClientsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
