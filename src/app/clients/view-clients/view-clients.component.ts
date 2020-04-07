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
  Router,
} from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {ClientModel} from '../shared/client.model';
import {ClientService} from '../shared/client.service';
@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.css'],
})

export class ViewClientsComponent implements OnInit {
  public clients: ClientModel[];

  constructor(private router: Router, private apiService: ApiService, private clientService: ClientService) {
  }

  public ngOnInit() {
    this.loadClients();
  }

  public loadClients() {
    this.apiService.get('/clients/clients').subscribe((clients) => {
      this.clients = clients as ClientModel[];
    });
  }

  public deleteClient(clientId) {
    this.apiService.delete('/clients/client/' + clientId).subscribe(() => {
      this.loadClients();
    });
  }

  public addClient() {
    this.clientService.openAddClientDialog().subscribe((b) => {
      if (b) {
        this.loadClients();
      }
    });
  }

  public viewClient(client: ClientModel) {
    this.clientService.openViewClientDialog(client);
  }
}
