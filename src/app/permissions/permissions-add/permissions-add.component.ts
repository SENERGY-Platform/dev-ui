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

import { Component, OnInit, Inject } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management/user-management.service';
import { ActivatedRoute } from '@angular/router';
import {KongService} from '../../services/kong/kong.service';
import {LadonService} from '../../services/ladon/ladon.service';
import {MatDialogRef, MatTableDataSource} from '@angular/material';
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
  selector: 'app-permissions-add',
  templateUrl: './permissions-add.component.html',
  styleUrls: ['./permissions-add.component.css']
})
export class PermissionsAddComponent implements OnInit {
  myControl = new FormControl();
  userIsAdmin: boolean;
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

  public form = this.fb.group({
    role: this.route.snapshot.paramMap.get('subject'),
    user: this.route.snapshot.paramMap.get('subject'),
    actions: this.fb.array([])
  });

  constructor(
      public dialogRef: MatDialogRef<PermissionsAddComponent>,
      private kongService: KongService,
      private fb: FormBuilder,
      private userManagementService: UserManagementService,
      private route: ActivatedRoute,
      private ladonService: LadonService,
      private router: Router,
      private authService: AuthService) {
    try {
      this.userManagementService.loadRoles().then((roles: Model) => {
        this.roles = roles;
        this.intbtnDisable();
      });
      this.userManagementService.loadUsers().then(users => this.users = users);
    } catch (e) {
      console.error('Could not load users or roles from Keycloak.\nWill assume entry is for roles.\nMessage was : ' + e);
      this.btnDisable = true;
    }
  }
  private methods = new FormGroup({
    get: new FormControl(),
    post: new FormControl(),
    patch: new FormControl(),
    delete: new FormControl(),
    put: new FormControl()
  });

  ngOnInit() {
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

    // autocomplete filter
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );
  }

  yes() {
    try {
      this.pushPolicy();
      this.dialogRef.close('yes');
    } catch (e) {
      this.dialogRef.close('error');
    }
  }
  no() {
    this.dialogRef.close('no');
  }

  pushPolicy() {
    const policy = {
      'Subjects': [this.subject],
      'Actions': [],
      'Resources': ['<^(endpoints:' + this.resource.substring(1) + ').*>'],
      'Effect': 'allow',
      'id':  this.subject + '-' + this.resource
    };
    if (this.methods.get('get').value === true) {
      policy['Actions'].push('GET');
    }
    if (this.methods.get('post').value === true) {
      policy['Actions'].push('POST');
    }
    if (this.methods.get('patch').value === true) {
      policy['Actions'].push('PATCH');
    }
    if (this.methods.get('delete').value === true) {
      policy['Actions'].push('DELETE');
    }
    if (this.methods.get('put').value === true) {
      policy['Actions'].push('PUT');
    }

    this.ladonService.deletePolicy(policy).then(response => {
      this.ladonService.postPolicy(policy).then(res => {
        console.log(policy);
      }, error => {
        throw error;
      });
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
