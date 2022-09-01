import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Appstate } from 'src/app/store/appstate';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectCustomerById } from 'src/app/store/selectors/customers.selector';
import { Customer } from 'src/app/store/models/customer';
import { invokeUpdateCustomerAPI } from 'src/app/store/actions/customer.action';
import { selectAppState } from 'src/app/store/selectors/app.selector';
import { setAPIStatus } from 'src/app/store/actions/app.action';

@Component({
    selector: 'app-edit-customer',
    templateUrl: './edit-customer.component.html',
    styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
    form!: FormGroup;
    id!: number;
    editMode!: boolean;
    customer!: Customer;
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
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute) {


    }

    ngOnInit(): void {
        let fetchData$ = this.route.paramMap.pipe(
            switchMap((params) => {
                this.id = Number(params.get('id'));
                return this.store.pipe(select(selectCustomerById(this.id)));
            })
        );
        fetchData$.subscribe((data) => {
            if (data) {
                this.customer = { ...data }
                //console.log("customer is: ");
                //console.log(this.customer);
            }
            else {
                this.router.navigate(['/dashboard/customers'])
            }
        });

        let formattedDate: string = this.formatDateToDisplay(this.customer.birthDate)
        let dateToShow: Date = new Date(formattedDate);

        this.form = this.fb.group({
            firstName: [this.customer.firstName, Validators.required],
            lastName: [this.customer.lastName, Validators.required],
            birthDate: [dateToShow, Validators.required],
            gender: [this.customer.gender, Validators.required],
            email: [this.customer.email, Validators.required],
            phone: [this.customer.phone, Validators.required],
            streetAddress: [this.customer.streetAddress, Validators.required],
            city: [this.customer.city, Validators.required],
            state: [this.customer.state, Validators.required],
            postal: [this.customer.postal, Validators.required],
        });

        this.editMode = false;
        this.form.disable();
    }


    editCustomer() {
        console.log("trying to edit lmao");
        const bdate = this.formatDateToUpdate(this.form.value.birthDate);
        const customer: Customer = {
            id: this.customer.id,
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
        };
        this.store.dispatch(
            invokeUpdateCustomerAPI({ updateCustomer: { ...customer } })
        );
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((appState) => {
            if (appState.apiStatus == 'success') {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                this.editMode = false;
                this.form.disable();
            }
        })
    }

    private formatDateToUpdate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + (d.getDate());
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    formatDateToDisplay(date: string): string {
        let numbersArray: string[] = date.split('-');
        let correctDate = `${numbersArray[1]}-${numbersArray[2]}-${numbersArray[0]}`
        console.log(correctDate);
        return correctDate;
    }

    editModeEnable(event: MouseEvent) {
        this.form.enable();
        event.stopPropagation();
        this.editMode = true;
    }


    editModeDisable(event: MouseEvent) {
        let formattedDate: string = this.formatDateToDisplay(this.customer.birthDate)
        let dateToShow: Date = new Date(formattedDate);

        this.form.controls['firstName'].setValue(this.customer.firstName);
        this.form.controls['lastName'].setValue(this.customer.lastName);
        this.form.controls['birthDate'].setValue(dateToShow);
        this.form.controls['gender'].setValue(this.customer.gender);
        this.form.controls['email'].setValue(this.customer.email);
        this.form.controls['phone'].setValue(this.customer.phone);
        this.form.controls['streetAddress'].setValue(this.customer.streetAddress);
        this.form.controls['city'].setValue(this.customer.city);
        this.form.controls['state'].setValue(this.customer.state);
        this.form.controls['postal'].setValue(this.customer.postal);

        this.editMode = false;
        this.form.disable();
    }
}
