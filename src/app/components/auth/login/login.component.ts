import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading: Boolean;

    constructor(private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        })
        this.loading = false;
    }

    ngOnInit(): void {
    }

    login() {
        console.log(this.form);
        const username = this.form.value.username;
        const password = this.form.value.password;
        //console.log(username);
        //console.log(password);

        if (username === 'jose' && password === '123') {
            //routing to dashboard
            this.fakeLoading();

        } else {
            //error message
            this.error();
            this.form.reset();
        }
    }


    error() {
        this._snackBar.open('Invalid username or password', '',
            {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
            })
    }

    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            // Redireccion al dashboard
            this.router.navigate(['dashboard']);
        }, 1000);
    }

}
