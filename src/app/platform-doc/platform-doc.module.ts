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

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDocComponent } from '../platform-doc/analytics-doc/analytics-doc.component';
import { IotRepoDocComponent } from '../platform-doc/iot-repo-doc/iot-repo-doc.component';
import { MarketplaceDocComponent } from '../platform-doc/marketplace-doc/marketplace-doc.component';
import { ProcessDocComponent } from '../platform-doc/process-doc/process-doc.component';
import { SecurityDocComponent } from '../platform-doc/security-doc/security-doc.component';
import { RouterModule, Routes } from '@angular/router';
import { ValidTokenGuard } from '../services/auth/guard.service';

import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule} from '@angular/common/http';
import { HttpClient} from '@angular/common/http';


import { GettingStartedComponent } from './getting-started/getting-started.component';
import { TranslateModule } from '@ngx-translate/core';
import {DashboardDocComponent} from './dashboard-doc/dashboard-doc.component';

@Component({
  templateUrl: './routing.component.html',
})
export class RoutingComponent {}

const routes: Routes = [
  {
    path: "doc",
    component: RoutingComponent,
    canActivate: [ValidTokenGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'start', 
        pathMatch: 'full' },
      {
        path: 'start',
        component: GettingStartedComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'security',
        component: SecurityDocComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'iot',
        component: IotRepoDocComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'dashboard',
        component: DashboardDocComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'process',
        component: ProcessDocComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'analytics',
        component: AnalyticsDocComponent,
        canActivate: [ValidTokenGuard]
      },
      {
        path: 'marketplace',
        component: MarketplaceDocComponent,
        canActivate: [ValidTokenGuard]
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),    
    TranslateModule.forRoot(),
     MarkdownModule.forRoot(),
      HttpClientModule,
      MarkdownModule.forRoot({ loader: HttpClient }),
  ],
  declarations: [
    AnalyticsDocComponent,
    IotRepoDocComponent,
    MarketplaceDocComponent,
    ProcessDocComponent,
    SecurityDocComponent,
    GettingStartedComponent,
    RoutingComponent,
    DashboardDocComponent
  ]
})
export class PlatformDocModule { }
