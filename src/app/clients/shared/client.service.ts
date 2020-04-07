import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {AddClientComponent} from '../add-client/add-client.component';
import {ViewClientComponent} from '../view-client/view-client.component';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    constructor(private dialog: MatDialog) {
    }

    public openAddClientDialog(): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = '500px';
        const editDialogRef = this.dialog.open(AddClientComponent, dialogConfig);

        return new Observable<boolean>((obs) => {
            editDialogRef.afterClosed().subscribe((b) => {
                obs.next(b);
                obs.complete();
            });
        });
    }

    public openViewClientDialog(id): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = '500px';
        dialogConfig.data = {id};
        const editDialogRef = this.dialog.open(ViewClientComponent, dialogConfig);

        return new Observable<boolean>((obs) => {
            editDialogRef.afterClosed().subscribe((b) => {
                obs.next(b);
                obs.complete();
            });
        });
    }
}
