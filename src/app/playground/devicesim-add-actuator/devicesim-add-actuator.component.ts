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
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { DeviceSimService } from '../../services/devicesim/device-sim.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-devicesim-add-actuator',
  templateUrl: './devicesim-add-actuator.component.html',
  styleUrls: ['./devicesim-add-actuator.component.css']
})
export class DevicesimAddActuatorComponent implements OnInit {
  formIsValid: boolean = false
  form = this.fb.group({
    displayName: ["", Validators.required],
    id: ["", Validators.required],
    parser: ["module.exports = function(msg){return msg;}", Validators.required],
    active: [true],
    states: this.fb.array([])
  });
  deviceLabel: string 

  constructor(private translateService: TranslateService,private fb: FormBuilder, private devicesimService: DeviceSimService, private router: Router) { 
    this.translateService.get("DEVICE").subscribe(name => this.deviceLabel = name)
    this.form.statusChanges.subscribe(status => {
      this.formIsValid = status == "VALID"
    })

    this.addState()
  }

  ngOnInit() {
  }

  addState() { 
    var states= <FormArray>this.form.get('states')
    states.push(this.fb.group({
      adopt: [false],
      regex: [""],
      response: [""]
    })); 
  }

  createActuator() {
    console.log(this.form)
    if(this.form.valid) {
      this.devicesimService.createActuator(this.form.value).then(result => {
        this.router.navigate(['/devicesim'])
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
