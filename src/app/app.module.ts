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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {ApplicationRef, DoBootstrap, NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ApiDocModule } from './api-doc/api-doc.module';
import { ClientsModule } from './clients/clients.module';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './material/material.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PlatformDocModule } from './platform-doc/platform-doc.module';
import { SettingsModule } from './settings/settings.module';

import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { ValidTokenGuard } from './services/auth/guard.service';
import { DeviceSimService } from './services/devicesim/device-sim.service';
import { LadonService } from './services/ladon/ladon.service';
import { SwaggerService } from './services/swagger/swagger.service';
import { UserManagementService } from './services/user-management/user-management.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import { AppComponent } from './app.component';
import { DialogComponent } from './dev-role-dialog/dialog.component';
import {PermissionsDialogDeleteComponent} from './permissions/permissions-dialog-delete/permissions-dialog-delete.component';
import {init} from './services/auth/auth-init';
import { StartComponent } from './start/start.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  {
    canActivate: [ValidTokenGuard],
    component: StartComponent,
    path: '',
  },
];

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    DialogComponent,

  ],
  entryComponents: [DialogComponent, PermissionsDialogDeleteComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    MaterialModule,
    PlatformDocModule,
    SettingsModule,
    PermissionsModule,
    ClientsModule,
    ApiDocModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      },
    }),
    BrowserAnimationsModule,
    KeycloakAngularModule,
  ],
  providers: [
    ApiService,
    AuthService,
    ValidTokenGuard,
    SwaggerService,
    LadonService,
    UserManagementService,
    DeviceSimService,
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
  ],
})
export class AppModule implements DoBootstrap {
  public ngDoBootstrap(appRef: ApplicationRef) {
    init(keycloakService)
        .then(() => {
          appRef.bootstrap(AppComponent);
        })
        .catch((error) => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
