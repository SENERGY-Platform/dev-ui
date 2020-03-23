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
import { ApiService } from '../../services/api/api.service';
import {
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

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
              private dialogRef: MatDialogRef<ViewClientComponent>, @Inject(MAT_DIALOG_DATA) data, private snackBar: MatSnackBar) {
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
    if(this.form.valid) {
      this.apiService.patch("/clients/client/" + this.id, this.form.value).then(() => {
        this.dialogRef.close(true);
        this.snackBar.open("Updated client", undefined, {
          duration: 1 * 1000,
        })
      }).catch(() => this.snackBar.open("Could not update client!", undefined, {duration: 3 * 1000}))
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  redirectUrisLenght(): number {
    return this.getRedirectUrisArray().length;
  }

  webOriginsLenght(): number {
    return this.getWebOriginsArray().length
  }

  getRedirectUrisArray(): FormArray {
    return (this.form.get("redirectUris") as FormArray)
  }

  getWebOriginsArray(): FormArray {
    return (this.form.get("webOrigins") as FormArray)
  }

  removeWebOrigin(i: number) {
    if (this.webOriginsLenght() > 1) {
      this.getWebOriginsArray().controls.splice(i, 1);
    }
  }

  removeRedirectUri(i: number) {
    if (this.redirectUrisLenght() > 1) {
      this.getRedirectUrisArray().controls.splice(i, 1);
    }
  }
}
