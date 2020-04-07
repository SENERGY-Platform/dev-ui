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
  Component, OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  DeviceSimService,
} from '../../services/devicesim/device-sim.service';

@Component({
  selector: 'app-edit-actuator',
  templateUrl: './edit-actuator.component.html',
  styleUrls: ['./edit-actuator.component.css'],
})
export class EditActuatorComponent implements OnInit, OnDestroy {
  public form = this.fb.group({
    displayName: ['', Validators.required],
    id: ['', Validators.required],
    parser: ['', Validators.required],
    active: [true],
    states: this.fb.array([]),
  });
  public sub: any;
  public device: any;
  public formIsValid = false;

  constructor(private fb: FormBuilder, private devicesimService: DeviceSimService, private router: Router, private route: ActivatedRoute) {
    this.form.statusChanges.subscribe((status) => {
      this.formIsValid = status === 'VALID';
    });

  }

  public ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
          this.devicesimService.getDevice(params.id, params.type).then((device) => {
            this.device = device;
            this.form.get('displayName').setValue(device.displayName);
            this.form.get('id').setValue(device.id);
            this.form.get('parser').setValue(device.parser);
            this.form.get('active').setValue(device.active);
          });
        });
  }

  public addState() {
    const states = this.form.get('states') as FormArray;
    states.push(this.fb.group({
      adopt: [false],
      regex: [''],
      response: [''],
    }));
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public update() {
    if (this.form.valid) {
      this.devicesimService.updateActuator(this.form.value).then(() => {
        this.router.navigate(['/devicesim']);
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
