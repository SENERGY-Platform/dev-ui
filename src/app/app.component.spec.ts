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

import {async, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogHarness} from '@angular/material/dialog/testing';
import {RouterModule} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {KeycloakService} from 'keycloak-angular';
import {AppComponent} from './app.component';
import {StartComponent} from './core/components/start/start.component';
import {CoreModule} from './core/core.module';
import {ApiService} from './core/services/api/api.service';
import {ApiServiceMock} from './core/services/api/api.service.mock';
import {AuthService} from './core/services/auth/auth.service';
import {AuthServiceMock} from './core/services/auth/auth.service.mock';
import {SwaggerService} from './core/services/swagger/swagger.service';
import {SwaggerServiceMock} from './core/services/swagger/swagger.service.mock';
import {TranslateServiceMock} from './core/services/translate.service.mock';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      providers: [
        {provide: MatDialog, useClass: MatDialogHarness},
        {provide: TranslateService, useClass: TranslateServiceMock},
        {provide: AuthService, useClass: AuthServiceMock},
        {provide: ApiService, useClass: ApiServiceMock},
        {provide: SwaggerService, useClass: SwaggerServiceMock},
        KeycloakService,
      ],
      imports: [
        MatCardModule,
        CoreModule,
        RouterModule.forRoot([
          {
            component: StartComponent,
            path: '',
          },
        ]),
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
