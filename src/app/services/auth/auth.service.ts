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

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {KeycloakService} from "keycloak-angular";

declare var KEYCLOAK_URL: any;

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient, private keycloakService: KeycloakService) {}

  userHasRole(role) {
    if (!environment.loginRequired) {
      return true
    }
    return this.keycloakService.isUserInRole(role);
  }

  getUserProfile() {
    const id_token = sessionStorage.getItem("id_token");
    return JSON.parse(id_token)
  }

  logout() {
    this.keycloakService.logout();
  }

  userIsAuthenticated() {
    if (!environment.loginRequired) {
      return true;
    }
    return this.keycloakService.isLoggedIn();
  }

  getToken(): Promise<string> {
    return this.keycloakService.getToken().then((resp) => {
      return 'bearer ' + resp;
    });
  }

  get(path) {
    return new Promise(resolve => {
      this.getToken().then(token => {
        var headers = new HttpHeaders({
          "Authorization": "Bearer " + token
        });
    
        this.httpClient.get(KEYCLOAK_URL + "/auth" + path, {'headers': headers}).subscribe(result => resolve(result))
      })
    })
  }
}