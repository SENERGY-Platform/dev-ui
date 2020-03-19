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
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {
  FormBuilder,
  Validators,
  FormArray, FormControl, Form
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {
  id: any;
  client: any = {'name': '', 'webOrigins': [], 'redirectUris':[]};
  form: any = this.fb.group({
    name: [Validators.required],
    redirectUris: this.fb.array([]),
    webOrigins: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, private apiService: ApiService,
              private dialogRef: MatDialogRef<ViewClientComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.id = data.id;
  }

  ngOnInit() {
    this.loadClientInformations();
  }

  addWebOrigins(){
    (this.form.get("webOrigins") as FormArray).push(new FormControl(undefined, Validators.required))
  }


  addRedirectUri() {
    (this.form.get("redirectUris") as FormArray).push(new FormControl(undefined, Validators.required))
  }

  loadClientInformations() {
    this.apiService.get("/clients/client/" + this.id).then(response => {
      this.client = response;
      (this.form.get("name") as FormControl).setValue(this.client.name);
      for (let redirectUri of this.client.redirectUris) {
        (this.form.get("redirectUris") as FormArray).push(new FormControl(redirectUri, Validators.required));
      }
      for (let webOrigin of this.client.webOrigins) {
        (this.form.get("webOrigins") as FormArray).push(new FormControl(webOrigin, Validators.required))
      }
    })
  }

  submit() {
    console.log(this.form.value);
    if(this.form.valid) {
      this.apiService.patch("/clients/client/" + this.id, this.form.value).then(response => {
        this.dialogRef.close(true);
      })
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
