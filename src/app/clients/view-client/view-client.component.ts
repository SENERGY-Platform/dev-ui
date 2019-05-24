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
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {
  id: any;
  client: any;
  form: any = this.fb.group({
    name: [],
    redirectUris: this.fb.array([]),
    webOrigins: this.fb.array([]),
  });

  constructor(private fb: FormBuilder,private apiService: ApiService,private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = params['id']; 
       this.loadClientInformations();
    });
  }

  addWebOrigins(){
    window.alert('Diese Funktion ist noch nicht implementiert.\nThis function is not yet implemented.');
  }


  addRedirectUri() {
    window.alert('Diese Funktion ist noch nicht implementiert.\nThis function is not yet implemented.');
  }

  loadClientInformations() {
    this.apiService.get("/clients/client/" + this.id).then(response => {
      this.client = response;
    })
  }

  submit() {
    console.log(this.form.value);
    if(this.form.valid) {
      this.apiService.patch("/clients/client/" + this.id, this.form.value).then(response => {
      })
    }
  }

}
