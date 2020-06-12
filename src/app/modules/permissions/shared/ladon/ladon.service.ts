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

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../../../../core/services/api/api.service';
import {PermissionApiModel, permissionApiToPermission, PermissionModel, permissionToPermissionApi} from '../permission.model';

@Injectable({
    providedIn: 'root',
})
export class LadonService {

    constructor(private apiService: ApiService) {
        this.baseUrl = '/ladon';
    }
    public baseUrl: string;

    private static handlePolicies(policies: PermissionModel[]): PermissionApiModel[] {
        const apiPolicies: PermissionApiModel[] = [];
        for (const policy of policies) {
            if (!policy.id) {
                policy.id = policy.subject + '-' + policy.resource;
            }
            apiPolicies.push(permissionToPermissionApi(policy));
        }
        return apiPolicies;
    }

    public postPolicies(policies: PermissionModel[]): Observable<unknown> {
        return this.apiService.post(this.baseUrl + '/policies', LadonService.handlePolicies(policies));
    }

    public putPolicies(policies: PermissionModel[]): Observable<unknown> {
        return this.apiService.put(this.baseUrl + '/policies', LadonService.handlePolicies(policies));
    }

    public getAllPolicies(): Observable<PermissionModel[]> {
        return new Observable<PermissionModel[]>((obs) => {
            this.apiService.get(this.baseUrl + '/policies').subscribe((policies) => {
                const apiModels = policies as PermissionApiModel[];
                const models: PermissionModel[] = [];
                apiModels.forEach((policy) => models.push(permissionApiToPermission(policy)));
                obs.next(models);
                obs.complete();
            });
        });
    }

    public deletePolicies(policies: PermissionModel[]): Observable<unknown> {
        const ids: string[] = [];
        policies.forEach((p) => ids.push(p.id));
        return this.apiService.delete(this.baseUrl + '/policies?ids=' + ids.join(','));
    }
}
