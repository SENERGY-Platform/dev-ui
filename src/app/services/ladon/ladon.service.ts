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
  Injectable,
} from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable()
export class LadonService {
  public baseUrl: string;
  constructor(private apiService: ApiService) {
    this.baseUrl = '/ladon';
  }

  public postPolicy(policy) {
    return this.apiService.post(this.baseUrl + '/policies', policy);
  }

  public getAllPolicies() {
    return this.apiService.get(this.baseUrl + '/policies');
  }

  public deletePolicy(policy) {
    return this.apiService.delete(this.baseUrl + '/policies?id=' + policy.id);
  }

  public putPolicy(policy) {
    return this.apiService.put(this.baseUrl + '/policies?id=' + policy.id, policy);
    }

  public patchPolicy(policy) {
      return this.apiService.patch(this.baseUrl + '/policies?id=' + policy.id, policy);
  }

}
