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

import {EventEmitter, Injectable, Output} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

import {SidenavPageModel} from './sidenav-page.model';
import {SidenavSectionModel} from './sidenav-section.model';

@Injectable({
    providedIn: 'root',
})
export class SidenavService {
    @Output() public toggleChanged: EventEmitter<boolean> = new EventEmitter();
    @Output() public sectionChanged: EventEmitter<string> = new EventEmitter();

    private isToggled = false;
    private section = '';

    constructor(private keycloakService: KeycloakService) {
    }

    public toggle(sidenavOpen: boolean): void {
        this.isToggled = sidenavOpen;
        this.toggleChanged.emit(this.isToggled);
    }

    public reset(): void {
        this.sectionChanged.emit(this.section);
    }

    public getSections(): SidenavSectionModel[] {
        const sections: SidenavSectionModel[] = [];

        sections.push(new SidenavSectionModel('API', 'link', 'code', '/api', []));

        sections.push(new SidenavSectionModel('Documentation', 'toggle', 'library_books', '/doc', [
            new SidenavPageModel('Getting Started', 'link', 'play_arrow', '/doc/start'),
            new SidenavPageModel('Prozesse', 'link', 'ballot', '/doc/process'),
            new SidenavPageModel('Analytics', 'link', 'insert_chart', '/doc/analytics'),
            new SidenavPageModel('IoT Repository', 'link', 'storage', '/doc/iot'),
            // new SidenavPageModel('Dashboard', 'link', 'dashboard', '/doc/dashboard'),
            // new SidenavPageModel('Marketplace', 'link', 'add_shopping_cart', '/doc/marketplace'),
            new SidenavPageModel('Security', 'link', 'security', '/doc/security'),
        ]));

        if (this.keycloakService.isUserInRole('developer')) {
            sections.push(new SidenavSectionModel('Clients', 'link', 'computer', '/clients', []));
        }

        if (this.keycloakService.isUserInRole('admin')) {
            sections.push(new SidenavSectionModel('Permissions', 'link', 'security', '/permissions', []));
        }

        return sections;
    }
}
