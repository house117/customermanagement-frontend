import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer.service';
import { Appstate } from 'src/app/store/appstate';
import { getDependentsByCustomerId } from 'src/app/store/selectors/customers.selector';
import { Dependent } from 'src/app/store/models/dependent';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogComponent } from '../../dialog/dialog.component';
import { invokeDeleteDependentAPI } from 'src/app/store/actions/customer.action';
import { setAPIStatus } from 'src/app/store/actions/app.action';
import { selectAppState } from 'src/app/store/selectors/app.selector';

@Component({
    selector: 'app-dependents',
    templateUrl: './dependents.component.html',
    styleUrls: ['./dependents.component.css']
})
export class DependentsComponent implements OnInit {

    loading: boolean = false;
    errorMessage: any;
    columnsToDisplay = [
        'firstName', 'lastName', 'email', 'phone', 'actions'];
    id!: number;

    dependents$ = this.route.paramMap.pipe(
        switchMap((params) => {
            this.id = Number(params.get('id'));
            return this.store.pipe(select(getDependentsByCustomerId(this.id)));
        })
    );
    dataSource = new MatTableDataSource();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    constructor(private fb: FormBuilder,
        private customerService: CustomerService,
        private store: Store,
        private appStore: Store<Appstate>,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {

        this.dependents$.subscribe((data) => {
            this.dataSource.data = data as Dependent[];
        });
        console.log(this.dataSource.data);


    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    openDialogDependentDeletion(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        id: number,
        dependentId: number,
        firstName: string,
        lastName: string): void {

        let dialogRef = this.dialog.open(DialogComponent, {
            data: {
                typeOfRecord: 'dependent',
                id: dependentId,
                firstName: firstName,
                lastName: lastName
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            //console.log(typeof (result));
            if (result === true) {
                //this.deleteCustomer(id);
                this.deleteDependent(id, dependentId);
            }
        })
    }

    deleteDependent(id: number, dependentId: number) {
        this.store.dispatch(
            invokeDeleteDependentAPI({
                id: id,
                dependentId: dependentId
            })
        );
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((appState) => {
            if (appState.apiStatus == 'success') {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                this._snackBar.open('Dependent deleted successfully.', '',
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
