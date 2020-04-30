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
import {
    FormArray,
    FormBuilder,
    FormControl, FormGroup, Validators,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {ApiService} from '../../../core/services/api/api.service';
import {ClientModel} from '../shared/client.model';

@Component({
    selector: 'app-add-edit-client',
    templateUrl: './add-edit-client.component.html',
    styleUrls: ['./add-edit-client.component.css'],
})
export class AddEditClientComponent implements OnInit {
    private client: ClientModel = {} as ClientModel;
    public isEditMode = false;
    public form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        redirectUris: this.fb.array([]),
        webOrigins: this.fb.array([]),
    });
    public title: string;

    constructor(private fb: FormBuilder, private apiService: ApiService,
                private dialogRef: MatDialogRef<AddEditClientComponent>, @Inject(MAT_DIALOG_DATA) data, private snackBar: MatSnackBar) {
        this.client = data as ClientModel;
        this.isEditMode = !(Object.entries(this.client).length === 0 && this.client.constructor === Object);
    }

    public ngOnInit() {
        if (this.isEditMode) {
            this.loadClientInformations();
            this.title = 'Edit Client ' + this.client.name;
        } else {
            this.title = 'Add Client';
        }
    }

    public addWebOrigins() {
        (this.form.get('webOrigins') as FormArray).push(new FormControl(undefined, Validators.required));
    }

    public addRedirectUri() {
        (this.form.get('redirectUris') as FormArray).push(new FormControl(undefined, Validators.required));
    }

    public loadClientInformations() {
        (this.form.get('name') as FormControl).setValue(this.client.name);
        for (const redirectUri of this.client.redirectUris) {
            (this.form.get('redirectUris') as FormArray).push(new FormControl(redirectUri, Validators.required));
        }
        for (const webOrigin of this.client.webOrigins) {
            (this.form.get('webOrigins') as FormArray).push(new FormControl(webOrigin, Validators.required));
        }
    }

    public submit() {
        if (this.form.valid) {
            let action: Observable<unknown>;
            if (this.isEditMode) {
                action = this.apiService.patch('/clients/client/' + this.client.id, this.form.value);
            } else {
                action = this.apiService.post('/clients/clients', this.form.value);
            }
            action.subscribe(() => {
                this.dialogRef.close(true);
                this.snackBar.open((this.isEditMode ? 'Updated' : 'Added') + ' client', undefined, {
                    duration: 1000,
                });
            }, () => this.snackBar.open('Could not add client', undefined, {
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
