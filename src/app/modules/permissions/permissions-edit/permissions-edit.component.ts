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

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AuthService} from '../../../core/services/auth/auth.service';
import {KongService} from '../shared/kong/kong.service';
import {LadonService} from '../shared/ladon/ladon.service';
import {PermissionModel} from '../shared/permission.model';
import {UserManagementService} from '../shared/user-management/user-management.service';

export interface Model {
    id: string;
    name: string;
}

@Component({
    selector: 'app-permissions-edit',
    templateUrl: './permissions-edit.component.html',
    styleUrls: ['./permissions-edit.component.css'],
})
export class PermissionsEditComponent implements OnInit {
    public isEditMode = false;
    public myControl = new FormControl();
    public userIsAdmin: boolean;
    public title: string;
    // all roles and uris and users
    public roles: any;
    public uris: any;
    public users: any;
    // options for autocomplete filter
    public filteredOptions: Observable<string[]>;
    public btnDisable: boolean;

    public form = this.fb.group({
        role: this.route.snapshot.paramMap.get('subject'),
        user: this.route.snapshot.paramMap.get('subject'),
        actions: this.fb.array([]),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public permission: PermissionModel,
        public dialogRef: MatDialogRef<PermissionsEditComponent>,
        private kongService: KongService,
        private fb: FormBuilder,
        private userManagementService: UserManagementService,
        private route: ActivatedRoute,
        private ladonService: LadonService,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {
        try {
            this.userManagementService.loadRoles().then((roles: Model) => {
                this.roles = roles;
                this.intbtnDisable();
            });
            this.userManagementService.loadUsers().then((users) => this.users = users);
        } catch (e) {
            console.error('Could not load users or roles from Keycloak.\nWill assume entry is for roles.\nMessage was : ' + e);
            this.btnDisable = true;
        }
        this.isEditMode = !(Object.entries(this.permission).length === 0 && this.permission.constructor === Object);
        if (this.isEditMode) {
            this.title = 'Edit Permission';
        } else {
            this.title = 'Add Permission';
        }
    }

    public methods = new FormGroup({
        get: new FormControl(),
        post: new FormControl(),
        patch: new FormControl(),
        delete: new FormControl(),
        put: new FormControl(),
        head: new FormControl(),
    });

    public ngOnInit() {
        try {
            this.userIsAdmin = this.authService.userHasRole('admin');
        } catch (e) {
            console.error('Could not check if user is admin: ' + e);
            this.userIsAdmin = false;
        }
        try {
            this.uris = this.kongService.loadUris();
        } catch (e) {
            console.error('Could not load Uris from kong: ' + e);
        }
        if (this.isEditMode) {
            this.checkactiveActions();
        }

        // autocomplete filter
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filter(value)),
            );
    }

    public checkactiveActions() {
        this.methods.patchValue({
            get: this.permission.actions.includes('GET'),
            post: this.permission.actions.includes('POST'),
            patch: this.permission.actions.includes('PATCH'),
            delete: this.permission.actions.includes('DELETE'),
            put: this.permission.actions.includes('PUT'),
            head: this.permission.actions.includes('HEAD'),
        });
    }

    public yes() {
        this.pushPolicy().subscribe(() => this.dialogRef.close('yes'),
            () => {
                this.snackBar.open('Could not update policy', undefined, {
                    duration: 3 * 1000,
                });
            });
    }

    public no() {
        this.dialogRef.close();
    }

    public pushPolicy(): Observable<unknown> {
        const policy: PermissionModel = {
            subject: this.permission.subject,
            actions: [],
            resource: this.myControl.value,
            id: this.permission.id,
        };
        if (this.methods.get('get').value === true) {
            policy.actions.push('GET');
        }
        if (this.methods.get('post').value === true) {
            policy.actions.push('POST');
        }
        if (this.methods.get('patch').value === true) {
            policy.actions.push('PATCH');
        }
        if (this.methods.get('delete').value === true) {
            policy.actions.push('DELETE');
        }
        if (this.methods.get('put').value === true) {
            policy.actions.push('PUT');
        }
        if (this.methods.get('head').value === true) {
            policy.actions.push('HEAD');
        }

        if (this.isEditMode) {
            return this.ladonService.putPolicies([policy]);
        } else {
            return this.ladonService.postPolicies([policy]);
        }
    }

    // autocomplete filter
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.uris.filter((option) => option.toLowerCase().includes(filterValue));
    }

    public onChange(event) {
        this.btnDisable = event !== 'subject';
    }

    public intbtnDisable() {
        const persons = this.roles.find((x) => x.name === this.permission.subject);
        this.btnDisable = persons === undefined;
    }
}
