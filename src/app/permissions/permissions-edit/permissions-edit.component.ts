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
import {FormArray, FormBuilder, Validators} from '@angular/forms';
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

  // all actions
  get = false;
  post = false;
  patch = false;
  delete = false;
  put = false;

  // all roles and uris and users
  roles: any;
  uris: any;
  users: any;
  policies: any;

  // options for autocomplete filter
  options: string[] = this.uris;
  filteredOptions: Observable<string[]>;


    array_of_actions: string[];

    public form = this.fb.group({
      subject: ["", Validators.pattern("\w+")],
      actions: this.fb.array([])
  });

  constructor(
      private kongService: KongService,
      private fb: FormBuilder,
      private userManagementService: UserManagementService,
      private route: ActivatedRoute,
      private ladonService: LadonService,
      private router: Router,
      private authService: AuthService){
  }

  ngOnInit() {
      this.userIsAdmin = this.authService.userHasRole("admin");


      this.userManagementService.loadRoles().then(roles => this.roles = roles);
      this.userManagementService.loadUsers().then(users => this.users = users);

      this.uris = this.kongService.loadUris()

      this.subject = this.route.snapshot.paramMap.get('subject'); // Subject
      this.actions = this.route.snapshot.paramMap.get('actions'); // Actions
      this.id = this.route.snapshot.paramMap.get('id'); // id
      this.resource = this.route.snapshot.paramMap.get(('resource')); // Resource

      this.addAction();
      this.checkactiveActions();

      // autocomplete filter

      console.log(this.options);


      this.filteredOptions = this.myControl.valueChanges
          .pipe(
              startWith(''),
              map(value => this._filter(value))
          );

  }


    addAction() {
        var control = < FormArray > this.form.controls['actions'];
        var addrCtrl = this.fb.group({
            endpoint: ["", Validators.pattern("\w+")],
            get: [""],
            post: [""],
            delete: [""],
            patch: [""],
            put: [""]
        });
        control.push(addrCtrl);
    }

    checkactiveActions(){

        this.array_of_actions = this.actions.split(",");

        for (let i = 0; i < this.array_of_actions.length; i++) {
            if (this.array_of_actions[i] === 'GET') {
                this.get = true;
            } else if (this.array_of_actions[i] === 'POST') {
                this.post = true;
            } else if (this.array_of_actions[i] === 'PATCH') {
                this.patch = true;
            } else if (this.array_of_actions[i] === 'DELETE') {
                this.delete = true;
            } else if (this.array_of_actions[i] === 'PUT') {
               this.put = true;
            }
        }
    }

    submit() {
        // Send list of policies to Ladon
        // Each Triple of Subject, Action and Resource become one policy
        const form_value = this.form.value;

        form_value["actions"].forEach(action => {
            const policy = {
                "Subjects": [this.subject],
                "Actions": [],
                "Resources": ["<^(endpoints:" + this.resource.substring(1) + ").*>"],
                "Effect": "allow",
                "id": this.id
            }

            if (this.get) policy["Actions"].push("GET")
            if (this.post) policy["Actions"].push("POST")
            if (this.patch) policy["Actions"].push("PATCH")
            if (this.delete) policy["Actions"].push("DELETE")
            if (this.put) policy["Actions"].push("PUT")

            this.ladonService.deletePolicy(policy).then(response => {

                this.ladonService.postPolicy(policy).then(res => {
                    console.log(policy)
                    this.submit_failed = res["Error"] != ""
                }, error => {
                    this.submit_failed = true
                })
                this.loadPolicies();
            })

        });
    }



    loadPolicies() {
        this.ladonService.getAllPolicies().then(response => {
            this.policies = (<any>response).map(policy => {
                policy["subject"] = policy["subjects"][0]
                if (policy["resources"][0] == "<.*>") {
                    policy["resource"] = policy["resources"][0]
                } else {
                    policy["resource"] = policy["resources"][0].split("(")[1].split(")")[0].replace(/:/g, "/").replace("endpoints", "")
                }
                policy["actions"] = policy["actions"].toString()
                return policy
            })

            this.policies = new MatTableDataSource(this.policies)
        })
    }

    showAll() {
        this.router.navigate(["/permissions"])
    }

    // autocomplete filter
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
}
