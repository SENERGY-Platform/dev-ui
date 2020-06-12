import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {CoreModule} from '../../../core/core.module';
import {SwaggerService} from '../../../core/services/swagger/swagger.service';
import {SwaggerServiceMock} from '../../../core/services/swagger/swagger.service.mock';
import {TranslateServiceMock} from '../../../core/services/translate.service.mock';

import {ApiDocsComponent} from './api-docs.component';

describe('ApiDocsComponent', () => {
    let component: ApiDocsComponent;
    let fixture: ComponentFixture<ApiDocsComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [ApiDocsComponent],
            providers: [
                {provide: TranslateService, useClass: TranslateServiceMock},
                {provide: SwaggerService, useClass: SwaggerServiceMock},
            ],
            imports: [
                MatCardModule,
                MatIconModule,
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                RouterTestingModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiDocsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
