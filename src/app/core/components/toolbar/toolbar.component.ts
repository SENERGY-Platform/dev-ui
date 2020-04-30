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
import {AfterViewInit, Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router, RoutesRecognized} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {SwaggerService} from '../../services/swagger/swagger.service';
import {SidenavSectionModel} from '../sidenav/shared/sidenav-section.model';
import {SidenavService} from '../sidenav/shared/sidenav.service';

// import markdownfiles
import * as analytics from '!raw-loader!../../../../assets/docs/de/analytics.md';
import * as getting from '!raw-loader!../../../../assets/docs/de/gettingstarted.md';
import * as iot from '!raw-loader!../../../../assets/docs/de/iot.md';
import * as process from '!raw-loader!../../../../assets/docs/de/process.md';
import * as security from '!raw-loader!../../../../assets/docs/de/security.md';

interface ResultModel {
    title: string;
    content: string;
    url: string;
}

interface MarkdownModel {
    default: string;
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, AfterViewInit {

    @ViewChild('sidenav', {static: false}) public sidenav!: MatSidenav;
    @Output() public sections: SidenavSectionModel[] = [];
    @Output() public openSection: null | string = null;
    @Output() public zIndex = -1;

    public inputFocused = false;
    public searchQuery = '';
    public docsSearchresult: any = [];
    public swaggerSearchresult: any = [];
    public blockSwagger = false;
    public blockDoc = false;
    public userIsAdmin = false;
    public mobileSearchPageIsHidden = true;
    public Act = true;

    constructor(private httpClient: HttpClient,
                private swaggerService: SwaggerService,
                private authService: AuthService,
                private responsiveService: ResponsiveService,
                private sidenavService: SidenavService,
                private router: Router) {
    }

    public ngOnInit() {
        this.userIsAdmin = this.authService.userHasRole('admin');
        this.checkIfDocIsActive();
        this.getHeadersOfMarkdown();
    }

    public ngAfterViewInit() {
    }

    public search() {
        this.inputFocused = this.searchQuery !== '';

        this.swaggerSearchresult = [];
        this.docsSearchresult = [];

        const query = this.searchQuery;

        if (!this.blockSwagger) {
            this.blockSwagger = true;
            this.loadSwagger().subscribe((swagger) => {
                swagger.forEach((api) => {
                    if (this.queryOccursInContent(query, api.info.title) || this.queryOccursInContent(query, api.info.description)) {
                        this.swaggerSearchresult.push({
                            title: api.info.title,
                            url: '/api/' + api.info.title,
                            content: api.info.description,
                        });
                    }
                });
                this.blockSwagger = false;
            });
        }
        if (!this.blockDoc) {
            this.blockDoc = true;
            this.getHeadersOfMarkdown().then((docs) => {
                (docs as any).forEach((doc) => {
                    let matches1: any[];
                    let matches2: any[];
                    let matches3: any[];
                    [matches1, matches2, matches3] = this.queryOccursInMarkdownHeaders(query, doc.headers1, doc.headers2, doc.headers3);
                    matches1.forEach(((value) => {
                        const result: ResultModel = {} as ResultModel;
                        result.title = doc.title;
                        result.content = value;
                        result.url = '/doc/' + doc.redirectUrl;
                        this.docsSearchresult.push(result);
                    }));
                    matches2.forEach(((value) => {
                        const result: ResultModel = {} as ResultModel;
                        result.title = doc.title;
                        result.content = value;
                        result.url = '/doc/' + doc.redirectUrl;
                        this.docsSearchresult.push(result);
                    }));
                    matches3.forEach(((value) => {
                        const result: ResultModel = {} as ResultModel;
                        result.title = doc.title;
                        result.content = value;
                        result.url = '/doc/' + doc.redirectUrl;
                        this.docsSearchresult.push(result);
                    }));
                });
                this.blockDoc = false;
            });
        }
    }

    public loadSwagger() {
        return this.swaggerService.getSwagger();
    }

    public queryOccursInMarkdownHeaders(query, header1, header2, header3): [any[], any[], any[]] {
        const regex = new RegExp(query, 'gi');
        let matches1: any[];
        let matches2: any[];
        let matches3: any[];
        matches1 = header1.filter((value) => value.match(regex));
        matches2 = header2.filter((value) => value.match(regex));
        matches3 = header3.filter((value) => value.match(regex));
        return [matches1, matches2, matches3];
    }

    public queryOccursInContent(query, content) {
        const regex = new RegExp(query, 'gi');
        const regexMatch = regex.exec(content);
        return !!regexMatch;
    }

    public getIndexOfSearchResultInContent(query, content) {
        const regex = new RegExp(query, 'gi');
        const regexMatch = regex.exec(content);
        if (regexMatch) {
            return regexMatch.index;
        }
        return false;
    }

    public removeMarkdownChars(text) {
        return text.replace(/#/g, '')
            .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
            .replace(/```/g, '');
    }

    public toggle(sidenavOpen: boolean): void {
        this.sidenavService.toggle(sidenavOpen);
    }

    public openSearchResult(url) {
        this.searchQuery = '';
        this.inputFocused = false;
        this.mobileSearchPageIsHidden = true;
        this.router.navigateByUrl(url);
    }

    public logout() {
        this.authService.logout();
    }

    public resetSidenav(): void {
        this.sidenavService.reset();
    }

    public resetSearchText() {
        this.searchQuery = '';
        this.search();
    }

    private checkIfDocIsActive() {
        this.router.events.subscribe((event) => {
            if (event instanceof RoutesRecognized) {
                const url = event.url;
                this.Act = url !== '/doc';
            }
        });
    }

    private getHeadersOfMarkdown() {
        return new Promise((resolve) => {
            const markdowns: MarkdownModel[] = [getting as unknown as MarkdownModel, process as unknown as MarkdownModel,
                analytics as unknown as MarkdownModel, iot as unknown as MarkdownModel, security as unknown as MarkdownModel];
            const docs = [
                {headers1: [], headers2: [], headers3: [], redirectUrl: 'start', title: 'Getting Started'},
                {headers1: [], headers2: [], headers3: [], redirectUrl: 'process', title: 'Prozesse'},
                {headers1: [], headers2: [], headers3: [], redirectUrl: 'analytics', title: 'Analytics'},
                {headers1: [], headers2: [], headers3: [], redirectUrl: 'iot', title: 'IoT Repository'},
                {headers1: [], headers2: [], headers3: [], redirectUrl: 'security', title: 'Security'},
            ];

            const regex1 = new RegExp('^# [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');
            const regex2 = new RegExp('^## [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');
            const regex3 = new RegExp('^### [a-zA-ZäöüÄÖÜß0-9 ]*', 'gm');

            let header1;
            let header2;
            let header3;

            for (let index = 0; index < markdowns.length; index++) {
                header1 = markdowns[index].default.match(regex1);
                header2 = markdowns[index].default.match(regex2);
                header3 = markdowns[index].default.match(regex3);

                header1.forEach((value) => {
                    value = value.toString().replace(/#/g, '').replace(/^ /g, '');
                    docs[index].headers1.push(value);
                });

                header2.forEach((value) => {
                    value = value.toString().replace(/#/g, '').replace(/^ /g, '');
                    docs[index].headers2.push(value);
                });

                header3.forEach((value) => {
                    value = value.toString().replace(/#/g, '').replace(/^ /g, '');
                    docs[index].headers3.push(value);
                });
            }
            resolve(docs);
        });
    }
}
