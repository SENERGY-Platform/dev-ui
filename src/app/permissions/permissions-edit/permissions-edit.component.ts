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

import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management/user-management.service';
import { ActivatedRoute } from '@angular/router';
import {KongService} from '../../services/kong/kong.service';
import {LadonService} from '../../services/ladon/ladon.service';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface Model {
    id: string;
    name: string;
}

@Component({
  selector: 'app-permissions-edit',
  templateUrl: './permissions-edit.component.html',
  styleUrls: ['./permissions-edit.component.css']
})
export class PermissionsEditComponent implements OnInit {
    myControl = new FormControl();
    userIsAdmin: false;
    subject: string;
    actions: string;
    id: string;
    resource: string;
    submit_failed: any = false;
    // all roles and uris and users
    roles: any;
    uris: any;
    users: any;
    policies: any;
    // options for autocomplete filter
    filteredOptions: Observable<string[]>;
    public btnDisable: boolean;
    array_of_actions: string[];
    methods

    public form = this.fb.group({
      role: this.route.snapshot.paramMap.get('subject'),
      user: this.route.snapshot.paramMap.get('subject'),
      actions: this.fb.array([])
    });

    constructor(
        private kongService: KongService,
        private fb: FormBuilder,
        private userManagementService: UserManagementService,
        private route: ActivatedRoute,
        private ladonService: LadonService,
        private router: Router,
        private authService: AuthService) {
        this.userManagementService.loadRoles().then((roles: Model) => {
            this.roles = roles;
            this.intbtnDisable();
        });
        this.userManagementService.loadUsers().then(users => this.users = users);
        this.methods = new FormGroup({
            get: new FormControl(),
            post: new FormControl(),
            patch: new FormControl(),
            delete: new FormControl(),
            put: new FormControl()
        });
    }

    ngOnInit() {
        this.userIsAdmin = this.authService.userHasRole('admin');
        this.uris = this.kongService.loadUris();
        this.subject = this.route.snapshot.paramMap.get('subject'); // Subject
        this.actions = this.route.snapshot.paramMap.get('actions'); // Actions
        this.id = this.route.snapshot.paramMap.get('id'); // id
        this.resource = this.route.snapshot.paramMap.get(('resource')); // Resource

        this.checkactiveActions();

        // autocomplete filter
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
              startWith(''),
              map(value => this._filter(value))
          );
    }

    checkactiveActions() {
        this.array_of_actions = this.actions.split(',');
        console.log(this.array_of_actions);
        for (let i = 0; i < this.array_of_actions.length; i++) {
            if (this.array_of_actions[i] === 'GET') {
                this.methods.set('get', true);
            } else if (this.array_of_actions[i] === 'POST') {
                this.methods.set('post', true);
            } else if (this.array_of_actions[i] === 'PATCH') {
                this.methods.set('patch', true);
            } else if (this.array_of_actions[i] === 'DELETE') {
                this.methods.set('delete', true);
            } else if (this.array_of_actions[i] === 'PUT') {
                this.methods.set('put', true);
            }
        }
    }
    submit() {
        // Send list of policies to Ladon
        // Each Triple of Subject, Action and Resource become one policy
        if (this.methods.get('get').value === true) {this.pushPolicy('GET'); }
        if (this.methods.get('post').value === true) {this.pushPolicy('POST'); }
        if (this.methods.get('patch').value === true) {this.pushPolicy('PATCH'); }
        if (this.methods.get('delete').value === true) {this.pushPolicy('DELETE'); }
        if (this.methods.get('put').value === true) {this.pushPolicy('PUT'); }
    }

    pushPolicy(method) {
        const policy = {
            'Subjects': [this.subject],
            'Actions': [],
            'Resources': ['<^(endpoints:' + this.resource.substring(1) + ').*>'],
            'Effect': 'allow',
            'id': this.id
        };
        policy['Actions'].push(method);

        this.ladonService.deletePolicy(policy).then(response => {
            this.ladonService.postPolicy(policy).then(res => {
                console.log(policy);
                this.submit_failed = res['Error'] !== '';
            }, error => {
                this.submit_failed = true;
            });
            this.loadPolicies();
        });
    }

    loadPolicies() {
        this.ladonService.getAllPolicies().then(response => {
            this.policies = (<any>response).map(policy => {
                policy['subject'] = policy['subjects'][0];
                if (policy['resources'][0] === '<.*>') {
                    policy['resource'] = policy['resources'][0];
                } else {
                    policy['resource'] = policy['resources'][0].split('(')[1].split(')')[0].replace(/:/g, '/').replace('endpoints', '');
                }
                policy['actions'] = policy['actions'].toString();
                return policy;
            });

            this.policies = new MatTableDataSource(this.policies);
        });
    }

    // autocomplete filter
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.uris.filter(option => option.toLowerCase().includes(filterValue));
    }

    onChange(event) {
        if (event === 'subject') {
            this.btnDisable = false;
        } else {
            this.btnDisable = true;
        }
    }

    intbtnDisable() {
        const persons =  this.roles.find(x => x.name === this.subject);
        if (persons === undefined) {
          this.btnDisable = true;
        } else {
          this.btnDisable = false;
        }
    }
}
