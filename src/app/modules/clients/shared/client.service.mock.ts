import {Injectable} from '@angular/core';
import {MatLegacyDialogConfig as MatDialogConfig} from '@angular/material/legacy-dialog';
import {Observable, of} from 'rxjs';
import {ClientModel} from './client.model';

@Injectable({
    providedIn: 'root',
})
export class ClientServiceMock {

    constructor() {
    }

    public openAddClientDialog(): Observable<boolean> {
        return of(false);
    }

    public openViewClientDialog(client: ClientModel): Observable<boolean> {
        return of(false);

    }

    private openDialog(dialogConfig: MatDialogConfig): Observable<boolean> {
        return of(false);

    }
}
