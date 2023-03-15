import {Pipe, PipeTransform} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogModule as MatDialogModule,
    MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslatePipe} from '@ngx-translate/core';
import {ApiService} from '../../../core/services/api/api.service';
import {ApiServiceMock} from '../../../core/services/api/api.service.mock';
import {AddEditClientComponent} from './add-edit-client.component';

@Pipe({
    name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';

    public transform(query: string, ...args: any[]): any {
        return query;
    }
}

describe('AddEditClientComponent', () => {
    let component: AddEditClientComponent;
    let fixture: ComponentFixture<AddEditClientComponent>;

    const snackBarMock = jasmine.createSpyObj(['open']);

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddEditClientComponent, TranslatePipeMock],
            providers: [
                UntypedFormBuilder,
                {provide: ApiService, useClass: ApiServiceMock},
                {provide: MatDialogRef, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatSnackBar, useValue: snackBarMock},
                {provide: TranslatePipe, useClass: TranslatePipeMock},
            ],
            imports: [
                MatIconModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatDialogModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddEditClientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
