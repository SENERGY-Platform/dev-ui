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
import { AuthService } from '../../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {

  constructor(private authService: AuthService) { }

  public loadUsers() {
    return this.authService.get('/admin/realms/master/users');
  }

  public loadRoles() {
    return this.authService.get('/admin/realms/master/roles');
  }
}
