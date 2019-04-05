/*
 *
 *     Copyright 2018 InfAI (CC SES)
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
 *
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';

import { SettingsModule } from './settings/settings.module';
import { PlatformDocModule } from './platform-doc/platform-doc.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ClientsModule } from './clients/clients.module';
import { ApiDocModule } from './api-doc/api-doc.module';
import { MaterialModule } from './material/material.module';
import { PlaygroundModule } from './playground/playground.module';
import { CoreModule } from './core/core.module';

import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';
import { ValidTokenGuard } from './services/auth/guard.service';
import { SwaggerService } from './services/swagger/swagger.service';
import { LadonService } from './services/ladon/ladon.service';
import { DeviceSimService } from './services/devicesim/device-sim.service';
import { UserManagementService } from './services/user-management/user-management.service';

import { AppComponent } from './app.component';
import { Dialog } from './dev-role-dialog/dialog.component';
import { StartComponent } from './start/start.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {PermissionsDialogDeleteComponent} from './permissions/permissions-dialog-delete/permissions-dialog-delete.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  {
    path: '',
    component: StartComponent,
    canActivate: [ValidTokenGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    Dialog,

  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    MaterialModule,
    PlatformDocModule,
    SettingsModule,
    PermissionsModule,
    ClientsModule,
    PlaygroundModule,
    ApiDocModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  entryComponents: [Dialog, PermissionsDialogDeleteComponent],
  providers: [ApiService, AuthService, ValidTokenGuard, SwaggerService, LadonService, UserManagementService, DeviceSimService],
  bootstrap: [AppComponent]
})
export class AppModule { }
