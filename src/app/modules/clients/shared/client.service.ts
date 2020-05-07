import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {AddEditClientComponent} from '../add-edit-client/add-edit-client.component';
import {ClientModel} from './client.model';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    constructor(private dialog: MatDialog) {
    }

    public openAddClientDialog(): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {} as ClientModel;
        return this.openDialog(dialogConfig);
    }

    public openViewClientDialog(client: ClientModel): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = client;
        return this.openDialog(dialogConfig);
    }

    private openDialog(dialogConfig: MatDialogConfig): Observable<boolean> {
        dialogConfig.minWidth = '500px';
        const editDialogRef = this.dialog.open(AddEditClientComponent, dialogConfig);
        return editDialogRef.afterClosed();
    }
}
