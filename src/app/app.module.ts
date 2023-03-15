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

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ApplicationRef, DoBootstrap, NgModule} from '@angular/core';

import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {MarkdownModule} from 'ngx-markdown';
import {AppComponent} from './app.component';
import {DialogComponent} from './core/components/dev-role-dialog/dialog.component';
import {SettingsModule} from './core/components/settings/settings.module';
import {StartComponent} from './core/components/start/start.component';
import {CoreModule} from './core/core.module';

import {ApiService} from './core/services/api/api.service';
import {init} from './core/services/auth/auth-init';
import {AuthService} from './core/services/auth/auth.service';
import {SwaggerService} from './core/services/swagger/swagger.service';

import {ApiDocModule} from './modules/api-doc/api-doc.module';
import {ClientsModule} from './modules/clients/clients.module';
import {PermissionsModule} from './modules/permissions/permissions.module';
import {PlatformDocModule} from './modules/platform-doc/platform-doc.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
    {
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
    imports: [
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
        BrowserModule,
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
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MarkdownModule.forRoot({loader: HttpClient}),
    ],
    providers: [
        ApiService,
        AuthService,
        SwaggerService,
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
