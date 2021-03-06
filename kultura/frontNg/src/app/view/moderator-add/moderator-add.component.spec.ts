import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ModeratorAddComponent} from './moderator-add.component';
import {Router} from '@angular/router';
import {ModeratorService} from '../../core/services/moderator/moderator.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {Moderator} from '../../core/models/moderator';
import {of, throwError} from 'rxjs';
import {DialogModule} from 'primeng/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';

describe('ModeratorAddComponent', () => {
  let component: ModeratorAddComponent;
  let fixture: ComponentFixture<ModeratorAddComponent>;
  let router: Router;
  let moderatorService: ModeratorService;
  let messageService: MessageService;
  let dialogService: DialogService;

  beforeEach(async () => {
    const moderator: Moderator = {
      id: '1',
      email: 'test1@mail.com',
      firstName: 'Firstname1',
      lastName: 'Lastname1'
    };

    const moderatorServiceMocked = {
      createModerator: jasmine.createSpy('createModerator').and.returnValue(of(moderator))
    };

    const messageServiceMocked = jasmine.createSpyObj(
      'MessageService',
      ['add'],
      ['messages']
    );
    const dialogServiceMocked = {
      open: jasmine.createSpy('open').and.returnValue(of({}))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };


    await TestBed.configureTestingModule({
      declarations: [ModeratorAddComponent],
      providers:    [
        {provide: ModeratorService, useValue: moderatorServiceMocked },
        { provide: MessageService, useValue: messageServiceMocked },
        { provide: DialogService, useValue: dialogServiceMocked},
        {provide: ConfirmationService, useValue: ConfirmationService},
        {provide: Router, useValue: routerMock}],
      imports: [DialogModule, ReactiveFormsModule, FormsModule, CardModule, PasswordModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorAddComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    moderatorService = TestBed.inject(ModeratorService);
    messageService =  TestBed.inject(MessageService);
    dialogService =  TestBed.inject(DialogService);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create add moderator', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid form when submitted and last name is empty', () => {

    component.moderatorForm.controls.firstName.setValue('Miar');
    component.moderatorForm.controls.lastName.setValue('');
    component.moderatorForm.controls.email.setValue('test@mail.com');
    component.moderatorForm.controls.password.setValue('miratMiric123');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeTruthy();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(0);

  });

  it('should be initialized  add moderator', () => {

    expect(component.moderatorForm).toBeDefined();
    expect(component.moderatorForm.invalid).toBeTruthy();
  });

  it('should be invalid form when submitted and first name is empty', () => {

    component.moderatorForm.controls.firstName.setValue('');
    component.moderatorForm.controls.lastName.setValue('Miric');
    component.moderatorForm.controls.email.setValue('test@mail.com');
    component.moderatorForm.controls.password.setValue('miratMiric123');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeTruthy();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(0);
  });

  it('should add moderator successfully when submitted', fakeAsync(() => {

    component.moderatorForm.controls.firstName.setValue('Mitar');
    component.moderatorForm.controls.lastName.setValue('Miric');
    component.moderatorForm.controls.email.setValue('test@mail.com');
    component.moderatorForm.controls.password.setValue('miratMiric123');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeFalse();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(1);
  }));

  it('should be invalid form when submitted and passwords incorrect', fakeAsync(() => {

    component.moderatorForm.controls.firstName.setValue('Mitar');
    component.moderatorForm.controls.lastName.setValue('Miric');
    component.moderatorForm.controls.email.setValue('test@mail.com');
    component.moderatorForm.controls.password.setValue('');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeTruthy();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(0);
  }));

  it('should be invalid form when submitted and mail incorrect', fakeAsync(() => {

    component.moderatorForm.controls.firstName.setValue('Mitar');
    component.moderatorForm.controls.lastName.setValue('Miric');
    component.moderatorForm.controls.email.setValue('test');
    component.moderatorForm.controls.password.setValue('');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeTruthy();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(0);
  }));

  it('should be invalid form when submitted and mail exist and wrong password', fakeAsync(() => {
    const moderatorServiceMailExists = {
      add: jasmine.createSpy('add').and.returnValue(throwError({
        status: 409,
        error: 'Email already exists.',
        message: 'Email already exists.',
      }))
    };

    component.ngOnInit();

    component.moderatorForm.controls.firstName.setValue('Mitar');
    component.moderatorForm.controls.lastName.setValue('Miric');
    component.moderatorForm.controls.email.setValue('test');
    component.moderatorForm.controls.password.setValue('');
    component.moderatorForm.controls.repeatPassword.setValue('miratMiric123');
    component.onSubmit();

    expect(component.moderatorForm.invalid).toBeTruthy();
    expect(moderatorService.createModerator).toHaveBeenCalledTimes(0);
    expect(messageService.add).toHaveBeenCalledTimes(2);
  }));


});
