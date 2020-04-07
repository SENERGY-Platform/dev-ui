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

import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

interface Device {
  displayName: string;
  id: string;
  protocolConf: {
    conf: {
      method: string,
      url: string,
      headers: {
        contentType: string,
      },
      topic: string,
      level: string,
      user: string,
      password: string,
      responseTopic: string,
      path: string,
    },
    type: string,
  };
  requestFormat: string;
  contentCreator: string;
  interval: {
    value: string,
    unit: string,
  };
  active: boolean;
  parser: string;
}

@Injectable()
export class DeviceSimService {

  constructor(private apiService: ApiService) { }

  public deleteDevice(device) {
    if (device.class === 'Sensor') {
      return this.apiService.delete('/devicesim/sensors/' + device.id);
    } else {
      return this.apiService.delete('/devicesim/actuators/' + device.id);
    }
  }

  public createSensor(device) {
    return this.apiService.post('/devicesim/sensors', device);
  }

  public createActuator(device) {
    return this.apiService.post('/devicesim/actuators', device);
  }

  public updateSensor(device) {
      return this.apiService.post('/devicesim/sensors/' + device.id, device);
  }

  public updateActuator(device) {
    return this.apiService.post('/devicesim/actuators/' + device.id, device);
  }

  public getDevice(id, type) {
    return new Promise<Device>((resolve) => {
      this.loadDevices().then((devices: any) => {
        if (type === 'Sensor') {
          devices.sensors.forEach((sensor) => {
            if (id === sensor.id) { resolve(sensor); }
          });
        } else {
          devices.actuators.forEach((actuator) => {
            if (id === actuator.id) { resolve(actuator); }
          });
        }
      });
    });

  }

  public loadDevices() {
    return new Promise((resolve) => {
      this.apiService.get('/devicesim/actuators').then((actuators) => {
        this.apiService.get('/devicesim/sensors').then((sensors) => {
          resolve({
            actuators: (actuators as any).devices,
            sensors: (sensors as any).devices,
          });
        });
      });
    });
  }
}
