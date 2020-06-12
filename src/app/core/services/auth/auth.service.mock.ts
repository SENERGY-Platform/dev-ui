/*
 *
 *     Copyright 2020 InfAI (CC SES)
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

import {Injectable} from '@angular/core';

@Injectable()
export class AuthServiceMock {
    constructor() {
    }

    public userHasRole(role) {
        return true;
    }

    public getUserProfile() {
        const idToken = sessionStorage.getItem('id_token');
        return JSON.parse(idToken);
    }

    public logout() {
        return null;
    }

    public userIsAuthenticated() {
        return true;
    }

    public getToken(): Promise<string> {
        return new Promise<string>((resolve) => resolve('bearer ' + 'mockToken'));
    }

    public get(path) {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
}
