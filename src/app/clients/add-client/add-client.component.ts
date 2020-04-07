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
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
})
export class AddClientComponent implements OnInit {
  public form = this.fb.group({
    name: ['', Validators.required],
    redirectUris: this.fb.array([]),
    webOrigins: this.fb.array([]),
  });

  constructor(private dialogRef: MatDialogRef<AddClientComponent>,
              private fb: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar) {
    this.addRedirectUri();
    this.addWebOrigins();
  }

  public ngOnInit() {
  }

  public addRedirectUri() {
    (this.form.get('redirectUris') as FormArray).push(new FormControl(undefined, Validators.required));
  }

  public addWebOrigins() {
    (this.form.get('webOrigins') as FormArray).push(new FormControl(undefined, Validators.required));
  }

  public submit() {
    if (this.form.valid) {
      this.apiService.post('/clients/clients', this.form.value).then(() => {
        this.dialogRef.close(true);
        this.snackBar.open('Added client', undefined, {
          duration: 1000,
        });
      }).catch(() => this.snackBar.open('Could not add client', undefined, {
        duration: 3000,
      }));
    }
  }

  public close() {
    this.dialogRef.close(false);
  }

  public redirectUrisLenght(): number {
    return this.getRedirectUrisArray().length;
  }

  public webOriginsLenght(): number {
    return this.getWebOriginsArray().length;
  }

  public getRedirectUrisArray(): FormArray {
    return (this.form.get('redirectUris') as FormArray);
  }

  public getWebOriginsArray(): FormArray {
    return (this.form.get('webOrigins') as FormArray);
  }

  public removeWebOrigin(i: number) {
    if (this.webOriginsLenght() > 1) {
      this.getWebOriginsArray().controls.splice(i, 1);
    }
  }

  public removeRedirectUri(i: number) {
    if (this.redirectUrisLenght() > 1) {
      this.getRedirectUrisArray().controls.splice(i, 1);
    }
  }
}
