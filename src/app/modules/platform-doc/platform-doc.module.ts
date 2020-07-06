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

import {CommonModule} from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {MarkdownModule} from 'ngx-markdown';
import {AnalyticsDocComponent} from './analytics-doc/analytics-doc.component';
import {DashboardDocComponent} from './dashboard-doc/dashboard-doc.component';
import {GettingStartedComponent} from './getting-started/getting-started.component';
import {IotRepoDocComponent} from './iot-repo-doc/iot-repo-doc.component';
import {MarketplaceDocComponent} from './marketplace-doc/marketplace-doc.component';
import {ProcessDocComponent} from './process-doc/process-doc.component';
import {SecurityDocComponent} from './security-doc/security-doc.component';

@Component({
    templateUrl: './routing.component.html',
})
export class RoutingComponent {
}

const routes: Routes = [
    {
        path: 'doc',
        component: RoutingComponent,
        children: [
            {
                path: '',
                redirectTo: 'start',
                pathMatch: 'full',
            },
            {
                path: 'start',
                component: GettingStartedComponent,
            },
            {
                path: 'security',
                component: SecurityDocComponent,
            },
            {
                path: 'iot',
                component: IotRepoDocComponent,
            },
            {
                path: 'dashboard',
                component: DashboardDocComponent,
            },
            {
                path: 'process',
                component: ProcessDocComponent,
            },
            {
                path: 'analytics',
                component: AnalyticsDocComponent,
            },
            {
                path: 'marketplace',
                component: MarketplaceDocComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        MarkdownModule.forChild(),
        HttpClientModule,
    ],
    declarations: [
        AnalyticsDocComponent,
        IotRepoDocComponent,
        MarketplaceDocComponent,
        ProcessDocComponent,
        SecurityDocComponent,
        GettingStartedComponent,
        RoutingComponent,
        DashboardDocComponent,
    ],
})
export class PlatformDocModule {
}
