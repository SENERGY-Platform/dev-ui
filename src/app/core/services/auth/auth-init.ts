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

import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../../../environments/environment';

declare let KEYCLOAK_URL: any;
declare let CLIENT_ID: any;

export function init(keycloak: KeycloakService): Promise<boolean> {
    if (!environment.loginRequired) {
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }

    let url: string;
    let clientId: string;
    if (!environment.production) {
        url = environment.keycloak;
        clientId = environment.client;
    } else {
        url = KEYCLOAK_URL + '/auth';
        clientId = CLIENT_ID;
    }

    return keycloak.init({
        config: {
            url,
            realm: 'master',
            clientId,
        },
        initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false,
            // token: token,
        },
        bearerPrefix: 'Bearer',
    });
}
