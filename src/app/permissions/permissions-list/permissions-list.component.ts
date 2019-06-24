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
    Component, OnInit, AfterViewInit
} from '@angular/core';
import {
  DatePipe
} from '@angular/common';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  Router
} from '@angular/router';
import {
    MatDialog,
    MatTableDataSource
} from '@angular/material';
import {
  LadonService
} from '../../services/ladon/ladon.service';
import {
  AuthService
} from '../../services/auth/auth.service';
import {Sort} from '@angular/material';
import { PermissionsDialogDeleteComponent} from '../permissions-dialog-delete/permissions-dialog-delete.component';
import { PermissionsEditComponent } from '../permissions-edit/permissions-edit.component';
import { PermissionsAddComponent } from '../permissions-add/permissions-add.component';

@Component({
  selector: 'list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.css']
})
export class PermissionsListComponent implements OnInit {
  displayedColumns = ['subject', 'actions', 'resource', 'delete', 'edit'];
  policies: any;
  userIsAdmin: false;

  sortedData: any[];
  mat_policies: any;


    constructor(private authService: AuthService,
                private ladonService: LadonService,
                private router: Router,
                public dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        this.loadPolicies();
        this.userIsAdmin = this.authService.userHasRole('admin');
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

            // for sorting algorithm
            this.sortedData = this.policies.slice();

            // data for mata table
            this.mat_policies = new MatTableDataSource(this.sortedData);
        });
    }

  createPolicy() {
      const dialogRef = this.dialog.open(PermissionsAddComponent,
          {width: '38.2%'});

      dialogRef.afterClosed().subscribe(result => {
          if (result === 'yes') {
              this.loadPolicies();
          } else if (result === 'error') {
              window.alert('Could not create policy!');
          }
      });
  }

  editPolicy(policy) {
      const dialogRef = this.dialog.open(PermissionsEditComponent,
          {data: {id: policy['id'], actions: policy['actions'], subject: policy['subject'], resource: policy['resource']}, width: '38.2%'});

      dialogRef.afterClosed().subscribe(result => {
          if (result === 'yes') {
              this.loadPolicies();
          } else if (result === 'error') {
              window.alert('Could not edit policy!');
          }
      });
  }

  deletePolicy(policy) {
    this.ladonService.deletePolicy(policy).then(response => {
      this.loadPolicies();
    });
  }

  sortData(sort: Sort) {
        const data = this.policies.slice();

        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }
        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'subject': return compare(a.subject, b.subject, isAsc);
                case 'actions': return compare(a.actions, b.actions, isAsc);
                case 'resource': return compare(a.resource, b.resource, isAsc);

                default: return 0;
            }
        });
    }

    askfordelete(policy) {
            // user does not have developer role but wants to use developer portal -> give him developer role
            const dialogRef = this.dialog.open(PermissionsDialogDeleteComponent, {
                width: '450px'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    console.log('The dialog was closed');
                    this.deletePolicy(policy);
                }
            });
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
