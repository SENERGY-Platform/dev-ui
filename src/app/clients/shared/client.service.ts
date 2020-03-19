import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddClientComponent} from "../add-client/add-client.component";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";


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
}