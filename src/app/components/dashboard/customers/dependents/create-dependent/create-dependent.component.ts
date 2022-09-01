import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { setAPIStatus } from 'src/app/store/actions/app.action';
import { selectAppState } from 'src/app/store/selectors/app.selector';
import { Appstate } from 'src/app/store/appstate';
import { Customer } from 'src/app/store/models/customer';
import { invokeCreateCustomerAPI, invokeCreateDependentAPI } from 'src/app/store/actions/customer.action';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dependent } from 'src/app/store/models/dependent';
import { switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-create-dependent',
    templateUrl: './create-dependent.component.html',
    styleUrls: ['./create-dependent.component.css']
})
export class CreateDependentComponent implements OnInit {
    form: FormGroup;
    id!: number;

    genders: any[] = [
        { value: 'Female', viewValue: 'Female' },
        { value: 'Male', viewValue: 'Male' },
        { value: 'Non-binary', viewValue: 'Non-binary' },
        { value: 'Transgender', viewValue: 'Transgender' },
        { value: 'Intersex', viewValue: 'Intersex' },
        { value: 'I prefer not to say', viewValue: 'I prefer not to say' },
    ];

    relativeTypes: any[] = [
        { value: 'Parent', viewValue: 'Parent' },
        { value: 'Sibling', viewValue: 'Sibling' },
        { value: 'Uncle/Aunt', viewValue: 'Uncle/Aunt' },
        { value: 'Grandparent', viewValue: 'Grandparent' },
        { value: 'Cousin', viewValue: 'Cousin' },
        { value: 'Spouse', viewValue: 'Spouse' },
        { value: 'Child', viewValue: 'Child' },
        { value: 'Nephew/Niece', viewValue: 'Nephew/Niece' },
        { value: 'GrandChild', viewValue: 'GrandChild' },
    ];

    constructor(private fb: FormBuilder,
        private store: Store,
        private appStore: Store<Appstate>,
        private router: Router,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthDate: ['', Validators.required],
            gender: ['', Validators.required],
            relativeType: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            streetAddress: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postal: ['', Validators.required],
        });
        //this.form.get('birthDate')!.patchValue(this.formatDate(new Date));
    }

    createDependent() {
        console.log(this.form);
        var id: number;
        this.route.paramMap.subscribe((params) => {
            if (params.get('id') != null) {
                id = +params.get('id')!;
            }

            const bdate = this.formatDate(this.form.value.birthDate);
            const dependent: Dependent = {
                firstName: this.form.value.firstName,
                lastName: this.form.value.lastName,
                birthDate: bdate,
                gender: this.form.value.gender,
                relativeType: this.form.value.relativeType,
                email: this.form.value.email,
                phone: this.form.value.phone,
                customer_id: id,
                streetAddress: this.form.value.streetAddress,
                city: this.form.value.city,
                state: this.form.value.state,
                postal: this.form.value.postal,
            }
            console.log(dependent);
            console.log("[Create Dependent component] ID: " + this.id);
            this.store.dispatch(invokeCreateDependentAPI({ newDependent: dependent }));
            let apiStatus$ = this.appStore.pipe(select(selectAppState));
            apiStatus$.subscribe((appState) => {
                if (appState.apiStatus == 'success') {
                    this.appStore.dispatch(
                        setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                    );
                    this._snackBar.open('Dependent created successfully.', '',
                        {
                            duration: 5000,
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom',
                            panelClass: ['message-snackbar']
                        });
                    this.router.navigate([`/dashboard/customers/${this.id}/dependents`])
                }
            })
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
        this.route.paramMap.subscribe((params) => {
            if (params.get('id') != null) {
                this.id = +params.get('id')!;
            }
        })
    }

}
