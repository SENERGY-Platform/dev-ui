/*
 *
 *     Copyright 2020 InfAI (CC SES)
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

import {Component, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from "@angular/forms";
import {PermissionImportModel} from "./permissions-dialog-import.model";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-permissions-dialog-import',
    templateUrl: './permissions-dialog-import.component.html',
    styleUrls: ['./permissions-dialog-import.component.css']
})
export class PermissionsDialogImportComponent {

    constructor(public dialogRef: MatDialogRef<PermissionsDialogImportComponent>,
                private snackBar: MatSnackBar) {
    }

    @ViewChild('fileInput') fileInput: HTMLInputElement;
    overwrite = new FormControl(undefined, Validators.required);
    policies: any[] = [];
    fileValid = false;
    selections: boolean[] = [];
    isAllSelected = true;

    yes() {
        const imports: any[] = [];
        this.policies.forEach((policy, index) => {
            if (this.selections[index]) {
                imports.push(policy);
            }
        });
        const result: PermissionImportModel = {
            policies: imports,
            overwrite: this.overwrite.value === "true"
        };
        this.dialogRef.close(result);
    }

    no() {
        const result: PermissionImportModel = {
            policies: [],
            overwrite: false
        };
        this.dialogRef.close(result);
    }

    onFileSelected() {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                this.policies = JSON.parse(reader.result as string);
                this.selections = [];
                this.policies.forEach(policy => {
                    policy.actions = policy.actions.split(', ');
                    this.selections.push(true);
                });
                this.fileValid = true;
            } catch (e) {
                this.snackBar.open("Could not import permissions: Invalid JSON", undefined, {
                    duration: 3 * 1000,
                });
                this.fileValid = false;
                return;
            }
        };
        try {
            // @ts-ignore
            reader.readAsText(this.fileInput.nativeElement.files[0])
        } catch (e) {
            console.error("fileInput undefined: Could not read file")
        }
    }


    hasValidFileSelected() {
        try {
            // @ts-ignore
            return this.fileInput.nativeElement.files.length !== 0 && this.fileValid;
        } catch (e) {
            return false;
        }
    }

    appendSelected() {
        const value = this.overwrite.value;
        return value === "false";
    }

    masterToggle(checked: boolean) {
        if (checked) {
            this.selections.forEach((_, index) => this.selections[index] = true);
            this.isAllSelected = true;
        } else {
            this.selections.forEach((_, index) => this.selections[index] = false);
            this.isAllSelected = false;
        }
    }


    indeterminate() {
        if (!this.isAllSelected) {
            for (let i in this.selections) {
                if (this.selections[i] === true) {
                    return true;
                }
            }
        } else {
            for (let i in this.selections) {
                if (this.selections[i] === false) {
                    return true;
                }
            }
        }
    }
}

