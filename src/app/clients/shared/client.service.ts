import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddClientComponent} from "../add-client/add-client.component";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ViewClientComponent} from "../view-client/view-client.component";


@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private dialog: MatDialog) {
    }

    openAddClientDialog(): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = '500px';
        const editDialogRef = this.dialog.open(AddClientComponent, dialogConfig);

        return new Observable<boolean>(obs => {
            editDialogRef.afterClosed().subscribe(b => {
                obs.next(b)
                obs.complete();
            });
        });
    }

    openViewClientDialog(id): Observable<boolean> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = '500px';
        dialogConfig.data = {"id": id};
        const editDialogRef = this.dialog.open(ViewClientComponent, dialogConfig);

        return new Observable<boolean>(obs => {
            editDialogRef.afterClosed().subscribe(b => {
                obs.next(b)
                obs.complete();
            });
        });
    }
}