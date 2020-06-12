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

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../../../environments/environment';

declare var KEYCLOAK_URL: any;

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient, private keycloakService: KeycloakService) {
  }

  public userHasRole(role) {
    if (!environment.loginRequired) {
      return true;
    }
    return this.keycloakService.isUserInRole(role);
  }

  public getUserProfile() {
    const idToken = sessionStorage.getItem('id_token');
    return JSON.parse(idToken);
  }

  public logout() {
    this.keycloakService.logout();
  }

  public userIsAuthenticated() {
    if (!environment.loginRequired) {
      return true;
    }
    return this.keycloakService.isLoggedIn();
  }

  public getToken(): Promise<string> {
    return this.keycloakService.getToken().then((resp) => {
      return 'bearer ' + resp;
    });
  }

  public get(path) {
    return new Promise((resolve) => {
      this.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,
        });

        this.httpClient.get(KEYCLOAK_URL + '/auth' + path, {headers}).subscribe((result) => resolve(result));
      });
    });
  }
}
