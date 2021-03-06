import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {LoginService} from '../../../../core/services/login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {relativeFrom} from '@angular/compiler-cli/src/ngtsc/file_system';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {MessageService} from 'primeng/api';
import {User} from '../../../../core/models/user';
import {tokenize} from '@angular/compiler/src/ml_parser/lexer';
import {useAnimation} from '@angular/animations';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.scss']
})
export class EnterPasswordComponent implements OnInit, OnDestroy {

  private subscription?: Subscription;

  passwordControl: FormControl;
  loading = false;

  constructor(private loginService: LoginService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private messageService: MessageService) {
    this.passwordControl = new FormControl(null, [Validators.minLength(8)]);
  }

  ngOnInit(): void {
    if (!this.loginService.email) {
      this.router.navigate(['..'], {relativeTo: this.activatedRoute});
    }
  }

  onClickLogin(): void {
    if (!this.passwordControl.valid) {
      this.messageService.add({id: 'toast-container', severity: 'error', detail: 'Passwords are at least eight characters long.'});
      return;
    }
    this.loginService.password = this.passwordControl.value;
    this.loading = true;
    this.subscription = this.loginService.login()
      .subscribe(
        (data: {token: string, user: User}) => {
          this.loading = false;

          if (!data.user.verified) {
            this.messageService.add({id: 'toast-container', severity: 'error', detail: 'Your account is not verified.'});
            return;
          }
          this.authService.login(data.token, data.user);
          this.router.navigateByUrl('/');
        },
        () => {
          this.loading = false;
          this.messageService.add({id: 'toast-container', severity: 'error', detail: 'Your password is incorrect'});
          this.passwordControl.reset();
        }
      );
  }

  onSwitchAccount(): void {
    this.loginService.reset();
    this.router.navigate(['..'], {relativeTo: this.activatedRoute});
  }

  get name(): string {
    return this.loginService.name;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
