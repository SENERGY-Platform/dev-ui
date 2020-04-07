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

import { Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';
import { AuthService } from '../../services/auth/auth.service';
import { SwaggerService } from '../../services/swagger/swagger.service';

@Component({
  selector: 'app-analytics-doc',
  templateUrl: './analytics-doc.component.html',
  styleUrls: ['./analytics-doc.component.css'],
})
export class AnalyticsDocComponent implements OnInit {
  public swagger: any;
  public ui: any;
  public path: string;

  constructor(private translate: TranslateService, private authService: AuthService, private swaggerService: SwaggerService) {
    const lang = this.translate.currentLang || 'de';
    this.path = 'assets/docs/' + lang + '/analytics.md';
    this.swaggerService.getSwagger().then((swaggerFiles) => {
      (swaggerFiles as any).forEach((api) => {
        if (api.basePath === '/db') {
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
      });

    });
  }

  public ngOnInit() {
  }

}
