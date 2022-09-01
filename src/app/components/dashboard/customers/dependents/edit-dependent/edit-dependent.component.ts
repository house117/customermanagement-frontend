import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Appstate } from 'src/app/store/appstate';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectAppState } from 'src/app/store/selectors/app.selector';
import { setAPIStatus } from 'src/app/store/actions/app.action';
import { Dependent } from 'src/app/store/models/dependent';
import { selectDependentById } from 'src/app/store/selectors/customers.selector';
import { invokeUpdateDependentAPI } from 'src/app/store/actions/customer.action';

@Component({
    selector: 'app-edit-dependent',
    templateUrl: './edit-dependent.component.html',
    styleUrls: ['./edit-dependent.component.css']
})
export class EditDependentComponent implements OnInit {
    form!: FormGroup;
    id!: number;
    dependentId!: number;
    editMode!: boolean;
    dependent!: Dependent;
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
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        let fetchData$ = this.route.paramMap.pipe(
            switchMap((params) => {
                this.id = Number(params.get('id'));
                this.dependentId = Number(params.get('dependentId'));
                return this.store.pipe(select(selectDependentById(this.id, this.dependentId)))
            })
        );
        fetchData$.subscribe((data) => {
            if (data) {
                this.dependent = Object.assign({}, data);
                console.log('[EditDependentComponent] fetched dependent:');
                console.log(this.dependent);

            } else {
                this.router.navigate([`/dashboard/customers/${this.id}/dependents`])
            }
        });
        let formattedDate: string = this.formatDateToDisplay(this.dependent.birthDate)
        let dateToShow: Date = new Date(formattedDate);

        this.form = this.fb.group({
            firstName: [this.dependent.firstName, Validators.required],
            lastName: [this.dependent.lastName, Validators.required],
            birthDate: [dateToShow, Validators.required],
            gender: [this.dependent.gender, Validators.required],
            relativeType: [this.dependent.relativeType, Validators.required],
            email: [this.dependent.email, Validators.required],
            phone: [this.dependent.phone, Validators.required],
            streetAddress: [this.dependent.streetAddress, Validators.required],
            city: [this.dependent.city, Validators.required],
            state: [this.dependent.state, Validators.required],
            postal: [this.dependent.postal, Validators.required],
        });

        this.editMode = false;
        this.form.disable();

    }

    editDependent() {
        console.log("Edit dependent");
        const bdate = this.formatDateToUpdate(this.form.value.birthDate);
        const dependent: Dependent = {
            id: this.dependentId,
            customer_id: this.id,
            firstName: this.form.value.firstName,
            lastName: this.form.value.lastName,
            birthDate: bdate,
            gender: this.form.value.gender,
            relativeType: this.form.value.relativeType,
            email: this.form.value.email,
            phone: this.form.value.phone,
            streetAddress: this.form.value.streetAddress,
            city: this.form.value.city,
            state: this.form.value.state,
            postal: this.form.value.postal,
        };

        this.store.dispatch(
            invokeUpdateDependentAPI({ updateDependent: { ...dependent } })
        );
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((appState) => {
            if (appState.apiStatus == 'success') {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                this._snackBar.open('Dependent updated successfully.', '',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['message-snackbar']
                    });
                this.editMode = false;
                this.form.disable();
            }
        })
    }
    editModeEnable(event: MouseEvent) {
        this.form.enable();
        event.stopPropagation();
        this.editMode = true;
    }

    editModeDisable(event: MouseEvent) {
        let formattedDate: string = this.formatDateToDisplay(this.dependent.birthDate)
        let dateToShow: Date = new Date(formattedDate);

        this.form.controls['firstName'].setValue(this.dependent.firstName);
        this.form.controls['lastName'].setValue(this.dependent.lastName);
        this.form.controls['birthDate'].setValue(dateToShow);
        this.form.controls['gender'].setValue(this.dependent.gender);
        this.form.controls['relativeType'].setValue(this.dependent.relativeType);
        this.form.controls['email'].setValue(this.dependent.email);
        this.form.controls['phone'].setValue(this.dependent.phone);
        this.form.controls['streetAddress'].setValue(this.dependent.streetAddress);
        this.form.controls['city'].setValue(this.dependent.city);
        this.form.controls['state'].setValue(this.dependent.state);
        this.form.controls['postal'].setValue(this.dependent.postal);

        this.editMode = false;
        this.form.disable();
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
}
