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

import {KeycloakService} from "keycloak-angular";
import {environment} from "../../../environments/environment";

export function init(keycloak: KeycloakService): () => Promise<any> {
    if (!environment.loginRequired) {
        return () => {
            return new Promise<any>(resolve => {
                resolve()
            })
        }
    }

    const url = environment["keycloak"];
    const clientId = environment["client"];


    return (): Promise<any> => keycloak.init({
        config: {
            url: url,
            realm: 'master',
            clientId: clientId
        },
        initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false,
            // token: token,
        },
        bearerPrefix: 'Bearer',
    });
}

