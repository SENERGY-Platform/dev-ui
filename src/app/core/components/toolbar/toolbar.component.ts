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

import {AfterViewInit, Component, OnInit, Output, ViewChild} from '@angular/core';
import {forkJoin} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SwaggerService} from '../../../services/swagger/swagger.service';
import { AuthService } from '../../../services/auth/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {SidenavService} from '../sidenav/shared/sidenav.service';
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {SidenavSectionModel} from '../sidenav/shared/sidenav-section.model';
import {MatSidenav} from '@angular/material';

// import markdownfiles
import * as analytics from '!raw-loader!../../../../assets/docs/de/analytics.md';
import * as getting from '!raw-loader!../../../../assets/docs/de/gettingstarted.md';
import * as iot from '!raw-loader!../../../../assets/docs/de/iot.md';
import * as process from '!raw-loader!../../../../assets/docs/de/process.md';
import * as security from '!raw-loader!../../../../assets/docs/de/security.md';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit{

    @ViewChild('sidenav') sidenav!: MatSidenav;
    @Output() sections: SidenavSectionModel[] = [];
    @Output() openSection: null | string = null;
    @Output() zIndex = -1;


    inputFocused: boolean = false;
    searchQuery: string;
    docsSearchresult: any = [];
    swaggerSearchresult: any = [];
    blockSwagger: boolean = false;
    blockDoc: boolean = false;
    userIsAdmin = false;
    mobileSearchPageIsHidden: boolean = true;
    Act: boolean = true;

    constructor(private httpClient: HttpClient,
                private swaggerService: SwaggerService,
                private authService: AuthService,
                private responsiveService: ResponsiveService,
                private sidenavService: SidenavService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

  ngOnInit() {
      this.userIsAdmin = this.authService.userHasRole("admin");
      this.checkIfDocIsActive();
      this.getHeadersOfMarkdown();
  }

    ngAfterViewInit() {
    }

    search() {
        if (this.searchQuery === '') {
            this.inputFocused = false;
        } else {
            this.inputFocused = true;
        }

        this.swaggerSearchresult = [];
        this.docsSearchresult = [];

        const query = this.searchQuery;

        if(!this.blockSwagger) {
            this.blockSwagger = true;
            this.loadSwagger().then(swagger => {
                (<any>swagger).forEach(api => {
                    if (this.queryOccursInContent(query, api.info.title) || this.queryOccursInContent(query, api.info.description)) {
                        this.swaggerSearchresult.push({
                            "title": api.info.title,
                            "url": "/api/" + api.info.title,
                            "content": api.info.description
                        })
                    }
                });
                this.blockSwagger = false;
            });
        }
        if (!this.blockDoc) {
            this.blockDoc = true;
            this.getHeadersOfMarkdown().then(docs => {
                (<any>docs).forEach(doc => {
                    let matches1 = [];
                    let matches2 = [];
                    let matches3 = [];
                    [matches1, matches2, matches3] = this.queryOccursInMarkdownHeaders(query, doc['headers1'], doc['headers2'], doc['headers3']);
                    matches1.forEach(((value) => {
                        const result = [];
                        result['title'] = doc['title'];
                        result['content'] = value;
                        result['url'] = '/doc/' + doc['redirectUrl'];
                        this.docsSearchresult.push(result);
                    }));
                    matches2.forEach(((value) => {
                        const result = [];
                        result['title'] = doc['title'];
                        result['content'] = value;
                        result['url'] = '/doc/' + doc['redirectUrl'];
                        this.docsSearchresult.push(result);
                    }));
                    matches3.forEach(((value) => {
                        const result = [];
                        result['title'] = doc['title'];
                        result['content'] = value;
                        result['url'] = '/doc/' + doc['redirectUrl'];
                        this.docsSearchresult.push(result);
                    }));
                });
                this.blockDoc = false;
            });
        }
    }

    loadSwagger() {
        return this.swaggerService.getSwagger()
    }

    queryOccursInMarkdownHeaders(query, header1, header2, header3) {
        const regex = new RegExp(query, 'gi');
        let matches1 = [];
        let matches2 = [];
        let matches3 = [];
        matches1 = header1.filter(value => value.match(regex));
        matches2 = header2.filter(value => value.match(regex));
        matches3 = header3.filter(value => value.match(regex));
        return [matches1, matches2, matches3];
    }

    queryOccursInContent(query, content) {
        var regex = new RegExp(query, 'gi');
        var regexMatch = regex.exec(content);
        if(regexMatch) {
            return true
        }
        return false
    }

    getIndexOfSearchResultInContent(query, content) {
        var regex = new RegExp(query, 'gi');
        var regexMatch = regex.exec(content);
        if(regexMatch) {
            return regexMatch["index"]
        }
        return false
    }

    removeMarkdownChars(text) {
        return text.replace(/#/g, '')
            .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
            .replace(/```/g, '')
    }

    toggle(sidenavOpen: boolean): void {
        this.sidenavService.toggle(sidenavOpen);
    }

    openSearchResult(url) {
        this.inputFocused = false;
        this.mobileSearchPageIsHidden = true;
        this.router.navigateByUrl(url);
    }

    logout() {
        this.authService.logout()
    }

    private checkIfDocIsActive() {
        this.router.events.subscribe(event => {
            if (event instanceof RoutesRecognized ) {
                const url = event['url'];
                if(url === '/doc'){
                    this.Act = false;
                } else {
                    this.Act = true;
                }
            }
        });
    }

    private getHeadersOfMarkdown() {
        return new Promise(resolve => {
            const markdowns = [getting, process, analytics, iot, security];
            const docs = [
                { headers1: [], headers2: [], headers3: [], redirectUrl: 'start', title: 'Getting Started'},
                { headers1: [], headers2: [], headers3: [], redirectUrl: 'process', title: 'Prozesse'},
                { headers1: [], headers2: [], headers3: [], redirectUrl: 'analytics', title: 'Analytics'},
                { headers1: [], headers2: [], headers3: [], redirectUrl: 'iot', title: 'IoT Repository'},
                { headers1: [], headers2: [], headers3: [], redirectUrl: 'security', title: 'Security'}
                ];

            const regex1 = new RegExp('^# [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');
            const regex2 = new RegExp('^## [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');
            const regex3 = new RegExp('^### [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');

            let header1;
            let header2;
            let header3;

            for (let index = 0; index < markdowns.length; index++) {

                header1 =  markdowns[index].match(regex1);
                header2 =  markdowns[index].match(regex2);
                header3 =  markdowns[index].match(regex3);

                header1.forEach(function (value) {
                    value = value.toString().replace(/#/g,'').replace(/^ /g,'');
                    docs[index]['headers1'].push(value);
                });

                header2.forEach(function (value) {
                    value = value.toString().replace(/#/g,'').replace(/^ /g,'');
                    docs[index]['headers2'].push(value);
                });

                header3.forEach(function (value) {
                    value = value.toString().replace(/#/g,'').replace(/^ /g,'');
                    docs[index]['headers3'].push(value);
                });
            }
            resolve(docs);
        });
    }

}
