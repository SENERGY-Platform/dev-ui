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
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { DeviceSimService } from '../../services/devicesim/device-sim.service';

@Component({
  selector: 'app-devicesim-list',
  templateUrl: './devicesim-list.component.html',
  styleUrls: ['./devicesim-list.component.css'],
})
export class DevicesimListComponent implements OnInit {
  public devices: any = [];
  public displayedColumns: any;
  public loading = true;

  constructor(private devicesimService: DeviceSimService, private router: Router, private apiService: ApiService) { }

  public ngOnInit() {
    this.load();
  }

  public load() {
    this.devices = [];
    this.displayedColumns = ['name', 'class', 'id', 'status', 'actions'];

    this.devicesimService.loadDevices().then((devices) => {
      (devices as any).actuators.forEach((actuator) => {
        actuator.class = 'Actuator';
        this.devices.push(actuator);
      });

      (devices as any).sensors.forEach((sensor) => {
        sensor.class = 'Sensor';
        this.devices.push(sensor);

      });
      this.devices = new MatTableDataSource(this.devices);
      this.loading = false;
    });
  }

  public deleteDevice(device) {
    this.devicesimService.deleteDevice(device).then(() => this.load());
  }

  public openEdit(device) {
    if (device.class === 'Sensor') {
      this.router.navigate(['/devicesim/sensor/edit'], { queryParams: { id: device.id , type: device.class} });
    } else {
      this.router.navigate(['/devicesim/actuator/edit'], { queryParams: { id: device.id, type: device.class} });
    }
  }

  public export() {
    const valuePath = 'value.reading.value';
    const timePath = 'value.reading.time';
    const exportData = {
      sd: valuePath,
      sdd: timePath,
    };
    this.apiService.post('/serving-service', exportData).then(() => {});
  }

  public toggleStatus(device) {
    device.active = !device.active;

    if (device.class === 'Sensor') {
      this.devicesimService.updateSensor(device);
    } else {
      this.devicesimService.updateActuator(device);
    }
  }

}
