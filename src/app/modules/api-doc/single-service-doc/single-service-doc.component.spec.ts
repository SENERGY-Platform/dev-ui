import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {CoreModule} from '../../../core/core.module';
import {AuthService} from '../../../core/services/auth/auth.service';
import {AuthServiceMock} from '../../../core/services/auth/auth.service.mock';
import {SwaggerService} from '../../../core/services/swagger/swagger.service';
import {SwaggerServiceMock} from '../../../core/services/swagger/swagger.service.mock';

import {SingleServiceDocComponent} from './single-service-doc.component';

describe('SingleServiceDocComponent', () => {
    let component: SingleServiceDocComponent;
    let fixture: ComponentFixture<SingleServiceDocComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [SingleServiceDocComponent],
            providers: [
                {provide: AuthService, useClass: AuthServiceMock},
                {
                    provide: ActivatedRoute, useValue: {
                        params: of([{id: 0}]),
                    },
                },
                {provide: SwaggerService, useClass: SwaggerServiceMock},
            ],
            imports: [
                CoreModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleServiceDocComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
