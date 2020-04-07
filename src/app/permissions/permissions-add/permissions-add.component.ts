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

import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import {KongService} from '../../services/kong/kong.service';
import {LadonService} from '../../services/ladon/ladon.service';
import {UserManagementService} from '../../services/user-management/user-management.service';

export interface Model {
  id: string;
  name: string;
}

@Component({
  selector: 'app-permissions-add',
  templateUrl: './permissions-add.component.html',
  styleUrls: ['./permissions-add.component.css'],
})
export class PermissionsAddComponent implements OnInit {
  public myControl = new FormControl();
  public userIsAdmin: boolean;
  public subject: string;
  public actions: string;
  public id: string;
  // all roles and uris and users
  public roles: any;
  public uris: any;
  public users: any;
  public policies: any;
  // options for autocomplete filter
  public filteredOptions: Observable<string[]>;
  public btnDisable: boolean;

  public form = this.fb.group({
    role: this.route.snapshot.paramMap.get('subject'),
    user: this.route.snapshot.paramMap.get('subject'),
    actions: this.fb.array([]),
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
      this.userManagementService.loadUsers().then((users) => this.users = users);
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

    // autocomplete filter
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
            startWith(''),
            map((value) => this._filter(value)),
        );
  }

  public yes() {
    try {
      this.pushPolicy().then(() => this.dialogRef.close('yes'));
    } catch (e) {
      this.dialogRef.close('error');
    }
  }
  public no() {
    this.dialogRef.close('no');
  }

  public pushPolicy() {
    let resource = this.myControl.value;
    if (resource.startsWith('/')) {
      resource = resource.substring(1);
    }
    resource = resource.split('/').join(':');
    const policy = {
      Subjects: [this.subject],
      Actions: [],
      Resources: ['<^(endpoints:' + resource + ').*>'],
      Effect: 'allow',
      id:  this.subject + '-' + this.myControl.value,
    };
    if (this.methods.get('get').value === true) {
      policy.Actions.push('GET');
    }
    if (this.methods.get('post').value === true) {
      policy.Actions.push('POST');
    }
    if (this.methods.get('patch').value === true) {
      policy.Actions.push('PATCH');
    }
    if (this.methods.get('delete').value === true) {
      policy.Actions.push('DELETE');
    }
    if (this.methods.get('put').value === true) {
      policy.Actions.push('PUT');
    }
    if (this.methods.get('head').value === true) {
      policy.Actions.push('HEAD');
    }

    return this.ladonService.postPolicy(policy);
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
    const persons =  this.roles.find((x) => x.name === this.subject);
    this.btnDisable = persons === undefined;
  }
}
