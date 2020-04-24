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
    Component, isDevMode, OnInit,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer} from '@angular/platform-browser';
import {
    Router,
} from '@angular/router';
import {PermissionModel} from '../../models/permission.model';
import {
    AuthService,
} from '../../services/auth/auth.service';
import {
    LadonService,
} from '../../services/ladon/ladon.service';
import {PermissionsDialogDeleteComponent} from '../permissions-dialog-delete/permissions-dialog-delete.component';
import {PermissionsDialogImportComponent} from '../permissions-dialog-import/permissions-dialog-import.component';
import {PermissionImportModel} from '../permissions-dialog-import/permissions-dialog-import.model';
import {PermissionsEditComponent} from '../permissions-edit/permissions-edit.component';

@Component({
    selector: 'app-permissions-list',
    templateUrl: './permissions-list.component.html',
    styleUrls: ['./permissions-list.component.css'],
})
export class PermissionsListComponent implements OnInit {

    constructor(private authService: AuthService,
                private ladonService: LadonService,
                private router: Router,
                public dialog: MatDialog,
                private sanitizer: DomSanitizer,
    ) {
    }

    public displayedColumns = ['subject', 'resource', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'edit', 'delete'];
    public policies: PermissionModel[] = [];
    public userIsAdmin = false;

    public sortedData: PermissionModel[];
    public matPolicies: MatTableDataSource<PermissionModel>;
    public query = '';
    public sort: Sort = undefined;

    private static compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public ngOnInit() {
        this.loadPolicies();
        this.userIsAdmin = this.authService.userHasRole('admin');
    }

    public loadPolicies() {
        this.ladonService.getAllPolicies().subscribe((response) => {
            this.policies = response;

            this.sort == null ?
                this.sortedData = this.policies.sort((a, b) => PermissionsListComponent.compare(a.subject, b.subject, true))
                : this.sortData(this.sort);

            // data for mata table
            this.matPolicies = new MatTableDataSource<PermissionModel>(this.sortedData);
        });
    }

    public createPolicy() {
        const dialogRef = this.dialog.open(PermissionsEditComponent,
            {
                data: {} as PermissionModel,
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
                data: {
                    id: policy.id,
                    actions: policy.actions,
                    subject: policy.subject,
                    resource: policy.resource,
                }, width: '38.2%',
            });

        dialogRef.afterClosed().subscribe((res) => {
            if (res != null) {
                this.loadPolicies();
            }
        });
    }

    public deletePolicy(policy) {
        this.ladonService.deletePolicy(policy).subscribe(() => {
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
        this.sortedData = data.sort((a, b) => {
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
        const theJSON = JSON.stringify(this.sortedData);
        return this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    }

    public import() {
        const dialogRef = this.dialog.open(PermissionsDialogImportComponent,
            {minWidth: '850px', minHeight: '200px'});

        dialogRef.afterClosed().subscribe(async (result: PermissionImportModel) => {
            if (result != null) {
                if (result.overwrite) {
                    this.policies.forEach((policy) => {
                        if (policy.id !== 'admin-all') { // Don't ever delete this policy
                            this.ladonService.deletePolicy(policy);
                        }
                    });
                }
                console.log(result);
                for (const policy of result.policies) {
                    if (policy.id !== 'admin-all') {
                        await this.ladonService.deletePolicy(policy).toPromise();
                        await this.ladonService.postPolicy(policy).toPromise();
                    }
                }
                this.loadPolicies();
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
}
