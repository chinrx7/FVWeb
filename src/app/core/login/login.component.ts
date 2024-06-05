import { Component, OnInit,Input, ChangeDetectorRef  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('loginState', [
        state('true', style({
            opacity: 0
        })),
        state('false', style({
            opacity: 1,

        })),
        transition('true => false', animate(500, keyframes([
            style({ opacity: 1, offset: .1 }),
            style({ transform: 'translateX(10px)', offset: .15 }),
            style({ transform: 'translateX(-10px)', offset: .30 }),
            style({ transform: 'translateX(10px)', offset: .45 }),
            style({ transform: 'translateX(-10px)', offset: .60 }),
            style({ transform: 'none', offset: 1 }),
        ]))),

    ])
]
})
export class LoginComponent implements OnInit {

    @Input() loginValid = true;
    loginForm: FormGroup;
    
    constructor(public authService: AuthService,
        public router: Router, private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
        this.createForm();
    }

    ngOnInit() {

    }

    createForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }


    async onSubmit() {

        let res = await this.authService.login(this.loginForm.get('username').value,
            this.loginForm.get('password').value)
     
        if (res) {
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
            this.router.navigate([redirect]);
        } else {
            this.loginValid = true
            this.changeDetectorRef.detectChanges();
            this.loginValid = false
        }

    }

    loginChange() {
        this.loginValid = true
    }

}
