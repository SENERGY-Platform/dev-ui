import {Pipe, PipeTransform} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddEditClientComponent, TranslatePipeMock],
            providers: [
                FormBuilder,
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
