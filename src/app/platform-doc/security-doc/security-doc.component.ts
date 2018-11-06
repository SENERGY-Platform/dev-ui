/*
 *
 *       2018 InfAI (CC SES)
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
 * /
 */

import { Component, OnInit, ElementRef } from '@angular/core';
import { SwaggerService } from '../../services/swagger/swagger.service';
import { AuthService } from '../../services/auth/auth.service';
import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-security-doc',
  templateUrl: './security-doc.component.html',
  styleUrls: ['./security-doc.component.css']
})
export class SecurityDocComponent implements OnInit {
  swagger: any
  ui: any 
  path: string 

  constructor(private translate: TranslateService, private swaggerService: SwaggerService, private authService: AuthService) { 
    var lang = this.translate.currentLang || 'de'
    this.path = "assets/docs/" + lang + "/security.md"

    this.swaggerService.getSwagger().then(swaggerFiles => {
      (<any>swaggerFiles).forEach(api => {
        if(api.basePath == "/auth") {
          this.swagger = api
        }
      });

      this.authService.getToken().then(token => {
        this.ui = SwaggerUIBundle({
          spec: this.swagger,
          dom_id: '#swagger',
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          configs: {
            preFetch: function(req) {
                    req.headers["Authorization"] = "Bearer " + token;
                    return req;
            }
          },
          layout: "StandaloneLayout"
        })
      })
     
    })
  }

  ngOnInit() {
  }

}
