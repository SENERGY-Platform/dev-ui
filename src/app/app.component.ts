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
import { AuthService } from './services/auth/auth.service';
import { ResponsiveService } from './core/services/responsive.service';
import { ApiService } from './services/api/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from './dev-role-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

    title = 'app';
    userIsAdmin = false;
    userIsDev = false ;

    constructor(
      public dialog: MatDialog,
      translate: TranslateService,
      private authService: AuthService,
      private responsiveService: ResponsiveService,
      private apiService: ApiService){

      translate.setDefaultLang('en')

      const userProfile = this.authService.getUserProfile()
      if(userProfile) {
          translate.use(userProfile["attributes"]["locale"][0]);
      }

  }



    ngOnInit(){
    this.responsiveService.observeMqAlias().subscribe((resp) => {});
    this.userIsAdmin = this.authService.userHasRole("admin")
    this.userIsDev = this.authService.userHasRole("developer")
    this.checkDeveloperRole();

    }

    checkDeveloperRole() {
        if(!this.userIsDev) {
            // user does not have developer role but wants to use developer portal -> give him developer role
            const dialogRef = this.dialog.open(Dialog, {
                width: '450px'
            });

            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
                this.apiService.patch("/role", "").then(result => {
                    location.reload();
                });

            });
        }
    }
}






