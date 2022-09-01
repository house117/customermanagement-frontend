import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { setAPIStatus } from 'src/app/store/actions/app.action';
import { selectAppState } from 'src/app/store/selectors/app.selector';
import { Appstate } from 'src/app/store/appstate';
import { Customer } from 'src/app/store/models/customer';
import { invokeCreateCustomerAPI } from 'src/app/store/actions/customer.action';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {
    form: FormGroup;

    genders: any[] = [
        { value: 'Female', viewValue: 'Female' },
        { value: 'Male', viewValue: 'Male' },
        { value: 'Non-binary', viewValue: 'Non-binary' },
        { value: 'Transgender', viewValue: 'Transgender' },
        { value: 'Intersex', viewValue: 'Intersex' },
        { value: 'I prefer not to say', viewValue: 'I prefer not to say' },

    ];

    constructor(private fb: FormBuilder,
        private store: Store,
        private appStore: Store<Appstate>,
        private router: Router,
        private _snackBar: MatSnackBar,) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthDate: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            streetAddress: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postal: ['', Validators.required],
        });
        //this.form.get('birthDate')!.patchValue(this.formatDate(new Date));
    }

    createCustomer() {
        console.log(this.form);
        const bdate = this.formatDate(this.form.value.birthDate);
        const customer: Customer = {
            firstName: this.form.value.firstName,
            lastName: this.form.value.lastName,
            birthDate: bdate,
            gender: this.form.value.gender,
            email: this.form.value.email,
            phone: this.form.value.phone,
            streetAddress: this.form.value.streetAddress,
            city: this.form.value.city,
            state: this.form.value.state,
            postal: this.form.value.postal,
            dependents: [],
        }
        console.log(customer);
        this.store.dispatch(invokeCreateCustomerAPI({ newCustomer: customer }));
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((appState) => {
            if (appState.apiStatus == 'success') {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                this._snackBar.open('Customer created successfully.', '',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['message-snackbar']
                    })
                this.router.navigate(['/dashboard/customers'])
            }
        })

    }


    private formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + (d.getDate());
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    ngOnInit(): void {
    }
}
