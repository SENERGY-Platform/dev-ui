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
import {HttpLoaderFactory} from '../../../app.module';
import {TranslateServiceMock} from '../../../core/services/translate.service.mock';

import {MarketplaceDocComponent} from './marketplace-doc.component';

describe('MarketplaceDocComponent', () => {
    let component: MarketplaceDocComponent;
    let fixture: ComponentFixture<MarketplaceDocComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MarketplaceDocComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        deps: [HttpClient],
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                    },
                })],
            providers: [
                {provide: TranslateService, useClass: TranslateServiceMock},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarketplaceDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
