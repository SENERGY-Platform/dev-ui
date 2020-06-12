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

import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {DialogComponent} from './core/components/dev-role-dialog/dialog.component';
import {ApiService} from './core/services/api/api.service';
import {AuthService} from './core/services/auth/auth.service';
import {ResponsiveService} from './core/services/responsive.service';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

    public title = 'app';
    public userIsAdmin = false;
    public userIsDev = false ;

    constructor(
      public dialog: MatDialog,
      translate: TranslateService,
      private authService: AuthService,
      private responsiveService: ResponsiveService,
      private apiService: ApiService) {

      translate.setDefaultLang('en');

      const userProfile = this.authService.getUserProfile();
      if (userProfile) {
          translate.use(userProfile.attributes.locale[0]);
      }

  }

    public ngOnInit() {
    this.responsiveService.observeMqAlias().subscribe(() => {});
    this.userIsAdmin = this.authService.userHasRole('admin');
    this.userIsDev = this.authService.userHasRole('developer');
    this.checkDeveloperRole();

    }

    public checkDeveloperRole() {
        if (!this.userIsDev) {
            // user does not have developer role but wants to use developer portal -> give him developer role
            const dialogRef = this.dialog.open(DialogComponent, {
                width: '450px',
            });

            dialogRef.afterClosed().subscribe(() => {
                console.log('The dialog was closed');
                this.apiService.patch('/role', '').subscribe(() => {
                    location.reload();
                });
            });
        }
    }
}
