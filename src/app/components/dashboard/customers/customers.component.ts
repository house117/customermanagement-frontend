import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/store/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { deleteCustomerAPISuccess, invokeCustomersAPI, invokeDeleteCustomerAPI } from 'src/app/store/actions/customer.action';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Appstate } from 'src/app/store/appstate';
import { selectAppState } from 'src/app/store/selectors/app.selector';
import { setAPIStatus } from 'src/app/store/actions/app.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectCustomers } from 'src/app/store/selectors/customers.selector';

/*const listUsers: Customer[] = [
    { id: 1, firstName: 'Jose', lastName: 'Flores', email: '1000073120@hexaware.com', gender: 'M' },

];*/

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
    form: FormGroup;
    loading: boolean = false;
    errorMessage: any;
    columnsToDisplay = [
        'firstName', 'lastName', 'email', 'phone', 'actions'];

    customers$ = this.store.pipe(select(selectCustomers));
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private fb: FormBuilder,
        private customerService: CustomerService,
        private store: Store,
        private appStore: Store<Appstate>,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
    ) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        })
        this.customers$.subscribe((data) => {
            this.dataSource.data = data;
        });
    }

    ngOnInit(): void {
        this.store.dispatch(invokeCustomersAPI());
        //this.getCustomers();

    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    openDialogCustomerDeletion(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        id: number,
        firstName: string,
        lastName: string): void {

        let dialogRef = this.dialog.open(DialogComponent, {
            data: {
                typeOfRecord: 'customer',
                id: id,
                firstName: firstName,
                lastName: lastName
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            //console.log(typeof (result));
            if (result === true) {
                this.deleteCustomer(id);
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    menuOpened(event: MouseEvent) {
        event.stopPropagation();
    }

    // CRUD Operations
    deleteCustomer(id: number) {
        this.store.dispatch(
            invokeDeleteCustomerAPI({
                id: id,
            })
        );
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((appState) => {
            if (appState.apiStatus == 'success') {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                this._snackBar.open('Customer deleted successfully.', '',
                    {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['message-snackbar']
                    })
            }
        });

    }
}


// API Methods deprecated
/*
public getCustomers() {
    this.loading = true;
    this.errorMessage = "";
    this.customerService.getCustomers()
        .subscribe(
            (response) => {
                console.log('Received response from the server.');
                console.log(response);
                //this.customers$ = response;
                this.dataSource.data = response;
                //console.log(this.dataSource);
            },
            (error) => {
                console.error('Request failed with error');
                this.errorMessage = error;
                this.loading = false;
            }
        )
}
*/