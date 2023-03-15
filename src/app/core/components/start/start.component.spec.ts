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

import {Pipe, PipeTransform} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth/auth.service';
import {AuthServiceMock} from '../../services/auth/auth.service.mock';
import {TranslateServiceMock} from '../../services/translate.service.mock';

import {StartComponent} from './start.component';

@Pipe({
    name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';

    public transform(query: string, ...args: any[]): any {
        return query;
    }
}

describe('StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [StartComponent, TranslatePipeMock],
            providers: [
                {provide: AuthService, useClass: AuthServiceMock},
                {provide: TranslateService, useClass: TranslateServiceMock},
                {provide: TranslatePipe, useClass: TranslatePipeMock},
            ],
            imports: [
                MatCardModule,
                RouterTestingModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
