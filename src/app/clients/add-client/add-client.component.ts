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
import {
  FormBuilder,
  Validators,
  FormArray,
  FormControl, FormGroup
} from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import {
  Router
} from '@angular/router';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  form = this.fb.group({
    name: ["", Validators.required],
    redirectUris: this.fb.array([]),
    webOrigins: this.fb.array([]),
  });

  constructor(private dialogRef: MatDialogRef<AddClientComponent>,
              private fb: FormBuilder, private apiService: ApiService) {
    this.addRedirectUri();
    this.addWebOrigins()
  }

  ngOnInit() {
  }

  addRedirectUri() { 
    (this.form.get('redirectUris') as FormArray).push(new FormControl(undefined, Validators.required));
  }

  addWebOrigins() { 
    (this.form.get('webOrigins') as FormArray).push(new FormControl(undefined, Validators.required));
  }

  submit() {
    if(this.form.valid) {
      this.apiService.post("/clients/clients",this.form.value).then(result => {
        this.dialogRef.close(true);
      })
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
