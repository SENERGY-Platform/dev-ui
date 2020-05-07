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
import {ActivatedRoute} from '@angular/router';
import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';
import {AuthService} from '../../../core/services/auth/auth.service';
import {SwaggerService} from '../../../core/services/swagger/swagger.service';

@Component({
    selector: 'app-single-service-doc',
    templateUrl: './single-service-doc.component.html',
    styleUrls: ['./single-service-doc.component.css'],
})
export class SingleServiceDocComponent implements OnInit {
    public id: any;
    public swagger: any;
    public ui: any;
    public ready = false;

    constructor(private authService: AuthService, private route: ActivatedRoute, private swaggerService: SwaggerService) {
    }

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            this.swaggerService.getSwagger().subscribe((swaggerFiles) => {
                swaggerFiles.forEach((api) => {
                    if (api.info.title === decodeURIComponent(params.id)) {
                        this.swagger = api;
                    }
                });

                this.authService.getToken().then((token) => {
                    this.ui = SwaggerUIBundle({
                        spec: this.swagger,
                        dom_id: '#swagger',
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset,
                        ],
                        configs: {
                            preFetch(req) {
                                req.headers.Authorization = 'Bearer ' + token;
                                return req;
                            },
                        },
                        layout: 'StandaloneLayout',
                    });
                    this.ready = true;
                });

            });
        });
    }

}
