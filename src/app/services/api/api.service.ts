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

import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import {
  Injectable,
} from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  AuthService,
} from '../auth/auth.service';

declare var KONG_URL: string;

@Injectable()
export class ApiService {
  public platformUrl: string;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    if (environment.production) {
      this.platformUrl = KONG_URL;
    } else {
      this.platformUrl = environment.kong;
    }
  }

  public get(path) {
    return new Promise((resolve, reject) => {
      this.authService.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,

        });

        this.httpClient.get(this.platformUrl + path, {headers}).subscribe((result) => resolve(result), (error) => reject(error));
      });
    });
  }

  public post(path, payload) {
    return new Promise((resolve, reject) => {
      this.authService.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,

        });
        this.httpClient.post(this.platformUrl + path, payload, {headers}).subscribe(
            (result) => resolve(result),
            (error) => reject(error));
      });
    });
  }

  public put(path, payload) {
    return new Promise((resolve, reject) => {
      this.authService.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,

        });
        this.httpClient.put(this.platformUrl + path, payload, {headers}).subscribe((result) => {
            resolve(result);
        }, (error) => reject(error));

      });
    });
  }

  public delete(path) {
    return new Promise((resolve, reject) => {
      this.authService.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,

        });
        this.httpClient.delete(this.platformUrl  + path, {headers}).subscribe((result) => resolve(result), (error) => reject(error));
      });
    });
  }

  public patch(path, payload) {
    return new Promise((resolve, reject) => {
      this.authService.getToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,

        });
        this.httpClient.patch(this.platformUrl + path, payload, {headers}).subscribe(
            (result) => resolve(result),
            (error) => reject(error),
        );
      });
    });
  }
}
