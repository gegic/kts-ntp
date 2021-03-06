import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { LoginRegisterComponent } from './login-register.component';
import {By, Title} from '@angular/platform-browser';
import {Router, RouterOutlet} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CardModule} from 'primeng/card';
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe('LoginComponent', () => {
  let component: LoginRegisterComponent;
  let fixture: ComponentFixture<LoginRegisterComponent>;
  let titleService: Title;
  let spySetTitle: Spy;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRegisterComponent ],
      imports: [RouterTestingModule, BrowserAnimationsModule, CardModule],
      providers: [Title]
    })
    .compileComponents();
  });

  beforeEach(() => {
    titleService = TestBed.inject(Title);
    fixture = TestBed.createComponent(LoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spySetTitle = spyOn(titleService, 'setTitle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the title on init', fakeAsync(() => {
    component.ngOnInit();

    tick();
    fixture.detectChanges();

    expect(spySetTitle).toHaveBeenCalledWith('kultura - Log In or Sign up');
  }));

  it('should show animation only if route has data with animations', () => {
    const outlet: RouterOutlet = fixture.debugElement.query(By.css('.outlet')).nativeElement;
    // @ts-ignore mock
    outlet.activatedRouteData = {...outlet.activatedRouteData, animation: 'EnterEmail'};
    expect(component.prepareRoute(outlet));
  });

  it('should set the title back to kultura on destroy', fakeAsync(() => {
    component.ngOnDestroy();

    tick();
    fixture.detectChanges();

    expect(spySetTitle).toHaveBeenCalledWith('kultura');
  }));
});
