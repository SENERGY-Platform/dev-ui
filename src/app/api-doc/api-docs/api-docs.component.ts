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
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import {
  NgModule
} from '@angular/core';
import {
  MatTableDataSource,
  MatSort
} from '@angular/material';
import {
  Observable
} from 'rxjs';
import {
  Router
} from '@angular/router';
import {
  SwaggerService
} from '../../services/swagger/swagger.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-docs',
  templateUrl: './api-docs.component.html',
  styleUrls: ['./api-docs.component.css']
})
export class ApiDocsComponent implements OnInit {
  title = 'SEPL API Documentation';
  swaggerList: any;
  swaggerListShown: any;
  query: any;
  searchPlaceholder: any;


  constructor(private translateService: TranslateService,private router: Router, private swaggerService: SwaggerService) {}

  ngOnInit(): void {
    this.translateService.get("SEARCH").subscribe(name => this.searchPlaceholder = name);
    this.swaggerService.getSwagger().then(swaggerList => {
      this.swaggerList = swaggerList;
      this.swaggerListShown = swaggerList;
    });
  }

  search() {
    const insensitiveQuery = new RegExp(this.query, 'gi')
    this.swaggerListShown = this.swaggerList.filter(api => {
      return insensitiveQuery.test(api['info']['description']) || insensitiveQuery.test(api['info']['title']);
    });
  }
}
