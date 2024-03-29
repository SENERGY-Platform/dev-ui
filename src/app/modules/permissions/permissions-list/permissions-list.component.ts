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

import {SelectionModel} from '@angular/cdk/collections';
import {Component, isDevMode, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer} from '@angular/platform-browser';
import {interval, Observable} from 'rxjs';
import {debounce, map, startWith} from 'rxjs/operators';
import {AuthService} from '../../../core/services/auth/auth.service';
import {PermissionsDialogDeleteComponent} from '../permissions-dialog-delete/permissions-dialog-delete.component';
import {PermissionsDialogImportComponent} from '../permissions-dialog-import/permissions-dialog-import.component';
import {PermissionImportModel} from '../permissions-dialog-import/permissions-dialog-import.model';
import {PermissionsEditComponent} from '../permissions-edit/permissions-edit.component';
import {KongService} from '../shared/kong/kong.service';
import {LadonService} from '../shared/ladon/ladon.service';
import {PermissionModel} from '../shared/permission.model';
import {UserManagementService} from '../shared/user-management/user-management.service';

@Component({
    selector: 'app-permissions-list',
    templateUrl: './permissions-list.component.html',
    styleUrls: ['./permissions-list.component.css'],
})
export class PermissionsListComponent implements OnInit {

    public displayedColumns = ['select', 'mode', 'subject', 'resource', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'edit', 'delete'];
    public policies: PermissionModel[] = [];
    public userIsAdmin = false;
    public sortedData: PermissionModel[];
    selection = new SelectionModel<PermissionModel>(true, []);
    public matPolicies: MatTableDataSource<PermissionModel> = new MatTableDataSource<PermissionModel>([]);
    public query = '';
    public sort: Sort = undefined;
    public ready = false;
    public importing = false;
    public roles: any[];
    public users: any[];
    public clients: any[];
    public endpointControl = new FormControl();
    public filteredOptions: Observable<string[]>;
    public uris: string[] = [];
    public test: { clientID: string, userId: string, roles: string[], username: string, target_method: string, target_uri: string } = {
        clientID: '',
        userId: '',
        roles: [],
        username: '',
        target_method: '',
        target_uri: ''
    };
    public testResult: { GET: boolean, POST: boolean, PUT: boolean, PATCH: boolean, DELETE: boolean, HEAD: boolean } = {
        GET: false,
        POST: false,
        PUT: false,
        PATCH: false,
        DELETE: false,
        HEAD: false
    };

    constructor(private authService: AuthService,
                private ladonService: LadonService,
                public dialog: MatDialog,
                private sanitizer: DomSanitizer,
                private userManagementService: UserManagementService,
                private kongService: KongService,
    ) {
        this.userManagementService.loadRoles().then((roles) => {
            this.roles = roles as any[];
        }).catch((r) => {
            console.error('Could not load roles from Keycloak. Reason was : ', r);
        });
        this.userManagementService.loadUsers().then((users) => this.users = users as any[]).catch((r) => {
            console.error('Could not load users from Keycloak. Reason was : ', r);
        });
        this.userManagementService.loadClients().then((clients) => this.clients = clients as any[]).catch((r) => {
            console.error('Could not load clients from Keycloak. Reason was : ', r);
        });
    }

    private static compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public ngOnInit() {
        this.loadPolicies();
        this.userIsAdmin = this.authService.userHasRole('admin');
        // autocomplete filter
        this.filteredOptions = this.endpointControl.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filter(value)),
            );
        this.filteredOptions.pipe(debounce(() => interval(300))).subscribe(() => this.testAccess());
        try {
            this.uris = this.kongService.loadUris();
        } catch (e) {
            console.error('Could not load Uris from kong: ' + e);
        }
    }

    public loadPolicies() {
        this.ready = false;
        this.policies = [];
        this.sortedData = [];
        this.selection.clear();
        this.ladonService.getAllPolicies().subscribe((response) => {
            this.policies = response;
            this.sortedData = this.policies;

            if (this.sort == null) {
                this.sortData({active: 'subject', direction: 'asc'});
            } else {
                this.sortData(this.sort);
            }
            this.addModes();
        });
    }

    private addModes() {
        if (this.roles == null || this.clients == null || this.users == null) {
            setTimeout(() => this.addModes(), 100);
            return;
        }
        this.sortedData.forEach(policy => {
            if (this.roles.some((e) => e.name === policy.subject)) {
                policy.mode = 'role';
            } else if (this.users.some((e) => e.username === policy.subject)) {
                policy.mode = 'user';
            } else if (this.clients.some((e) => e.clientId === policy.subject)) {
                policy.mode = 'client';
            }
        });
        // data for mata table
        this.matPolicies.data = this.sortedData;
        this.ready = true;
    }

    public createPolicy() {
        const dialogRef = this.dialog.open(PermissionsEditComponent,
            {
                data: {permission: {} as PermissionModel, roles: this.roles, users: this.users, clients: this.clients},
                width: '38.2%',
            });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.loadPolicies();
            } else if (result === 'error') {
                window.alert('Could not create policy!');
            }
        });
    }

    public editPolicy(policy) {
        const dialogRef = this.dialog.open(PermissionsEditComponent,
            {
                data:
                    {permission: policy, roles: this.roles, users: this.users, clients: this.clients},
                width: '38.2%',
            });

        dialogRef.afterClosed().subscribe((res) => {
            if (res != null) {
                this.loadPolicies();
            }
        });
    }

    public deletePolicy(policy) {
        this.ladonService.deletePolicies([policy]).subscribe(() => {
            this.loadPolicies();
        });
    }

    public sortData(sort: Sort) {
        this.sort = sort;
        if (sort == null) {
            return;
        }
        const data = this.sortedData.slice();

        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }
        data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'subject':
                    return PermissionsListComponent.compare(a.subject, b.subject, isAsc);
                case 'GET':
                    return PermissionsListComponent.compare(a.actions.includes('GET'), b.actions.includes('GET'), isAsc);
                case 'POST':
                    return PermissionsListComponent.compare(a.actions.includes('POST'), b.actions.includes('POST'), isAsc);
                case 'PUT':
                    return PermissionsListComponent.compare(a.actions.includes('PUT'), b.actions.includes('PUT'), isAsc);
                case 'PATCH':
                    return PermissionsListComponent.compare(a.actions.includes('PATCH'), b.actions.includes('PATCH'), isAsc);
                case 'DELETE':
                    return PermissionsListComponent.compare(a.actions.includes('DELETE'), b.actions.includes('DELETE'), isAsc);
                case 'HEAD':
                    return PermissionsListComponent.compare(a.actions.includes('HEAD'), b.actions.includes('HEAD'), isAsc);
                case 'resource':
                    return PermissionsListComponent.compare(a.resource, b.resource, isAsc);

                default:
                    return 0;
            }
        });
        this.sortedData = data;
    }

    public askfordelete(policy) {
        // user does not have developer role but wants to use developer portal -> give him developer role
        const dialogRef = this.dialog.open(PermissionsDialogDeleteComponent, {
            width: '450px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.deletePolicy(policy);
            }
        });
    }

    public export() {
        if (this.sortedData && this.sortedData.length > 0) {
            const theJSON = JSON.stringify(this.sortedData.filter((p) => p.id !== 'admin-all'));
            return this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
        }
    }

    public import() {
        const dialogRef = this.dialog.open(PermissionsDialogImportComponent,
            {minWidth: '850px', minHeight: '200px'});

        dialogRef.afterClosed().subscribe((result: PermissionImportModel) => {
            if (result != null) {
                this.ready = false;
                this.importing = true;
                const filteredPolicies = result.policies.filter((p) => p.id !== 'admin-all');
                if (result.overwrite) {
                    const currentPolicies = this.policies.filter((p) => p.id !== 'admin-all');
                    this.ladonService.deletePolicies(currentPolicies).subscribe(() => this.ladonService.postPolicies(filteredPolicies)
                        .subscribe(() => {
                            this.importing = false;
                            this.loadPolicies();
                        }));
                } else {
                    this.ladonService.putPolicies(filteredPolicies).subscribe(() => {
                        this.importing = false;
                        this.loadPolicies();
                    });
                }

            }
        });
    }

    public search() {
        const filtered = [];
        const query = new RegExp(this.query, 'i');
        this.policies.forEach((policy) => {
            try {
                if (query.test(policy.subject)
                    || query.test(policy.actions.join())
                    || query.test(policy.resource)) {
                    filtered.push(policy);
                }
            } catch (e) {
                // Probably invalid regex, ignore in prod mode
                if (isDevMode()) {
                    console.error('Error filtering policies',
                        'This is most likely due to an invalid regex and you can ignore this error', e);
                }
            }
        });
        this.sortedData = filtered;
        this.sortData(this.sort);
    }

    public clearSearch() {
        this.query = '';
        this.sortedData = this.policies;
        this.sortData(this.sort);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length + 1; // admin-all won't be selected
        const currentViewed = this.matPolicies.connect().value.length;
        return numSelected === currentViewed;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selectionClear();
        } else {
            this.matPolicies.connect().value.forEach((row) => {
                if (row.id !== 'admin-all') {
                    this.selection.select(row);
                }
            });
        }
    }

    selectionClear(): void {
        this.selection.clear();
    }

    deleteMultipleItems() {
        const dialogRef = this.dialog.open(PermissionsDialogDeleteComponent, {
            width: '450px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.ladonService.deletePolicies(this.selection.selected).subscribe(() => {
                    this.loadPolicies();
                });
            }
        });
    }

    setTestUser(user) {
        this.test.username = user.username;
        this.test.userId = user.id;
        this.testAccess();
    }

    setTestRole(role) {
        this.test.roles = [role];
        this.testAccess();
    }

    setTestClient(id) {
        this.test.clientID = id;
        this.testAccess();
    }

    // autocomplete filter
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.uris.filter((option) => option.toLowerCase().includes(filterValue));
    }

    public testAccess() {
        this.test.target_uri = this.endpointControl.value || '';
        this.ladonService.test(this.test).subscribe((res) => this.testResult = res);
    }
}
