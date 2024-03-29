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

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '../../../../environments/environment';

declare var KONG_URL: string;

@Injectable()
export class ApiService {
    public platformUrl: string;

    constructor(private httpClient: HttpClient) {
        if (environment.production) {
            this.platformUrl = KONG_URL;
        } else {
            this.platformUrl = environment.kong;
        }
    }

    public get(path: string): Observable<unknown> {
        return this.httpClient.get(this.platformUrl + path);
    }

    public post<T>(path: string, payload: any): Observable<T> {
        return this.httpClient.post<T>(this.platformUrl + path, payload);
    }

    public put(path: string, payload: any): Observable<unknown> {
        return this.httpClient.put(this.platformUrl + path, payload);
    }

    public delete(path: string, body?: any): Observable<unknown> {
        return this.httpClient.request('DELETE', this.platformUrl + path, {body});
    }

    public patch(path: string, payload: any): Observable<unknown> {
        return this.httpClient.patch(this.platformUrl + path, payload);
    }
}
