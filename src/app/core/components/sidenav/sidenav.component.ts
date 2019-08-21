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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import { AuthService} from '../../../services/auth/auth.service';
import {Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot, RoutesRecognized, GuardsCheckEnd} from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import {filter, map, mergeMap, take} from 'rxjs/operators';

import {SidenavService} from './shared/sidenav.service';
import {SidenavSectionModel} from './shared/sidenav-section.model';
import {ResponsiveService} from '../../services/responsive.service';
import {forkJoin} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {not} from 'rxjs/internal-compatibility';



@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit, AfterViewInit{

    @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
    @Output() mode = '';
    @Output() openSection: null | string = null;
    @Output() sections: SidenavSectionModel[] = [];
    @Output() zIndex = -1;

    mobileSearchPageIsHidden: boolean = true;
    inputFocused: boolean = false;
    userIsAdmin = false;
    private httpClient: HttpClient;


    constructor(private activatedRoute: ActivatedRoute,
                public dialog: MatDialog, translate: TranslateService,
                private authService: AuthService,
                private router: Router,
                private sidenavService: SidenavService,
                private responsiveService: ResponsiveService){

        translate.setDefaultLang('en');

        var userProfile = this.authService.getUserProfile();

        if(userProfile && userProfile["attributes"] && userProfile["attributes"]["locale"]) {
            translate.use(userProfile["attributes"]["locale"][0]);
        }

        this.userIsAdmin = this.authService.userHasRole("admin");
    }

    ngOnInit() {
        this.showOrHideSidenav();
        this.getSections();
        this.getActiveSection();
        this.detectRouterChange();

    }

    ngAfterViewInit() {
        this.sidenavChangeListener();
    }

    openSearchResult(url) {
        this.inputFocused = false;
        this.mobileSearchPageIsHidden = true;
        this.router.navigateByUrl(url);
    }

    private showOrHideSidenav(): void {
        this.responsiveService.observeMqAlias().subscribe((mqAlias) => {
            if (mqAlias === 'sm' || mqAlias === 'xs') {
                this.sidenav.close();
                this.sidenav.mode = 'over';
                this.sidenav.disableClose = false;
                this.sidenav.fixedTopGap = 0;
            } else {
                this.sidenav.mode = 'side';
                this.sidenav.open();
                this.sidenav.disableClose = true;
                this.sidenav.fixedTopGap = 64;
            }
        });
    }

    loadDocs() {
        return new Promise(resolve => {
            var pages = [
                { assetUrl: "iot", title: "IoT Repository", redirectUrl: "iot"},
                { assetUrl: "security", title: "Security", redirectUrl: "security"},
                { assetUrl: "analytics", title: "Analytics", redirectUrl: "analytics"},
                { assetUrl: "gettingstarted", title: "Getting Started", redirectUrl: "start"},
                { assetUrl: "process", title: "Prozesse", redirectUrl: "process"}
            ];
            var async = [];
            var content = [];

            pages.forEach(page => {
                async.push(this.httpClient.get("/assets/docs/" + page["assetUrl"] + ".md", {responseType: "text"}))
            });
            forkJoin(async).subscribe(results => {
                for (let index = 0; index < results.length; index++) {
                    content.push({
                        "content": this.removeMarkdownChars(results[index]),
                        "url": "/doc/" + pages[index]["redirectUrl"],
                        "title": pages[index]["title"]
                    });
                }
                resolve(content)
            })
        })
    }

    removeMarkdownChars(text) {
        return text.replace(/#/g, '')
            .replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '')
            .replace(/```/g, '')
    }

    private getSections(): void {
        this.sections = this.sidenavService.getSections();

        // delete permissions if user is not admin
        if (!this.userIsAdmin){
            const index = this.sections.findIndex(x => x.name === 'Permissions');
            this.sections.splice(index, 1);
        }
    }


    closeSidenav(): void {
        if (this.sidenav.mode === 'over') {
            this.sidenavService.toggle(false);
        }
    }

    isSectionOpen(section: SidenavSectionModel): boolean {
        if (this.openSection === null) {
            return false;
        } else {
            return this.openSection === section.state;
        }
    }

    toggleSection(section: SidenavSectionModel): void {
        this.openSection = (this.openSection === section.state ? null : section.state);
        if (section.type === 'link') {
            this.closeSidenav();
        }
    }

    private sidenavChangeListener(): void {
        this.sidenavService.toggleChanged.subscribe((isToggle: boolean) => {
            if (isToggle) {
                this.zIndex = 0;
            } else {
                this.zIndex = -1;
            }
            this.sidenav.toggle(isToggle);
        });
        this.sidenavService.sectionChanged.subscribe((section: SidenavSectionModel) => {
            this.openSection = section.state;
        });
    }


    private getActiveSection() {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            take(1),
            map(() => {
                return this.activatedRoute.snapshot['_routerState'].url;
            })
        ).subscribe((activeRoute: string) => {
            const index = activeRoute.lastIndexOf('/');
            if (index > 0) {
                this.openSection = activeRoute.substring(0, index);
            } else {
                this.openSection = activeRoute;
            }
        });
    }

    private detectRouterChange() {
        this.router.events.subscribe(event => {


            if (event instanceof NavigationEnd) {



                const url = event['url'];

                if ( url !== '/') {
                    const section = this.sections.find(i => i.state === url);
                    if (typeof section !== 'undefined') {
                        this.toggleSection(section);
                    }
                }
            }
        });
    }


}
