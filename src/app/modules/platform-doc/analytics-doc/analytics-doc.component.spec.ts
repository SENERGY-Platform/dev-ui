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

import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {MarkdownModule, MarkdownService, MarkedOptions} from 'ngx-markdown';
import {HttpLoaderFactory} from '../../../app.module';
import {AuthService} from '../../../core/services/auth/auth.service';
import {AuthServiceMock} from '../../../core/services/auth/auth.service.mock';
import {SwaggerService} from '../../../core/services/swagger/swagger.service';
import {SwaggerServiceMock} from '../../../core/services/swagger/swagger.service.mock';

import {AnalyticsDocComponent} from './analytics-doc.component';

describe('AnalyticsDocComponent', () => {
    let component: AnalyticsDocComponent;
    let fixture: ComponentFixture<AnalyticsDocComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AnalyticsDocComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        deps: [HttpClient],
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                    },
                }),
                MarkdownModule,
            ],
            providers: [
                {provide: TranslateService, useClass: TranslateService},
                {provide: AuthService, useClass: AuthServiceMock},
                {provide: SwaggerService, useClass: SwaggerServiceMock},
                MarkdownService,
                MarkedOptions,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
