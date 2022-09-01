import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { EMPTY } from "rxjs";
import { map, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import { CustomerService } from "src/app/services/customer.service";
import { DependentService } from "src/app/services/dependent.service";
import { setAPIStatus } from "../actions/app.action";
import {
    customersFetchAPISuccess,
    invokeCustomersAPI,
    invokeCreateCustomerAPI,
    createCustomerAPISuccess,
    invokeDeleteCustomerAPI,
    deleteCustomerAPISuccess,
    invokeUpdateCustomerAPI,
    updateCustomerAPISuccess,
    invokeCreateDependentAPI,
    createDependentAPISuccess,
    invokeUpdateDependentAPI,
    updateDependentAPISuccess,
    invokeDeleteDependentAPI,
    deleteDependentAPISuccess,
} from "../actions/customer.action";
import { Appstate } from "../appstate";
import { selectCustomers } from "../selectors/customers.selector";


@Injectable()
export class CustomersEffect {
    constructor(
        private actions$: Actions,
        private customerService: CustomerService,
        private dependentService: DependentService,
        private store: Store,
        private appStore: Store<Appstate>
    ) { }

    // Load Customers
    loadAllCustomers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(invokeCustomersAPI),
            withLatestFrom(this.store.pipe(select(selectCustomers))),
            mergeMap(([, customerformStore]) => {
                if (customerformStore.length > 0) {
                    return EMPTY;
                }
                return this.customerService
                    .getCustomers()
                    .pipe(map((data) => customersFetchAPISuccess({ allCustomers: data })));
            })
        ));

    // Create customer
    createNewCustomer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeCreateCustomerAPI),
            switchMap((action) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                return this.customerService.createCustomer(action.newCustomer).pipe(
                    map((data) => {
                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' }
                            })
                        );
                        return createCustomerAPISuccess({ newCustomer: data });
                    })
                )
            })
        )
    })

    // Create dependent
    createNewDependent$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeCreateDependentAPI),
            switchMap((action) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );

                return this.dependentService.createDependent(action.newDependent).pipe(
                    map((data) => {
                        console.log("This is data:");
                        console.log(data);
                        console.log("This is id:");
                        console.log();

                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' }
                            })
                        );
                        return createDependentAPISuccess({ newDependent: data });
                    })
                )
            })
        )
    })


    // UPDATE customer

    updateCustomerAPI$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeUpdateCustomerAPI),
            switchMap((action) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                return this.customerService.updateCustomer(action.updateCustomer).pipe(
                    map((data) => {
                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
                            })
                        );
                        return updateCustomerAPISuccess({ updateCustomer: data });
                    })
                )
            })
        )
    })

    // UPDATE Dependent

    updateDependentAPI$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeUpdateDependentAPI),
            switchMap((action) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                return this.dependentService.updateDependent(action.updateDependent).pipe(
                    map((data) => {
                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
                            })
                        );
                        return updateDependentAPISuccess({ updateDependent: data });
                    })
                )
            })
        )
    })

    // Delete customer
    deleteCustomer$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeDeleteCustomerAPI),
            switchMap((actions) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                return this.customerService.deleteCustomer(actions.id).pipe(
                    map(() => {
                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
                            })
                        );
                        return deleteCustomerAPISuccess({ id: actions.id });
                    })
                )
            })
        )
    });

    // DELETE Dependent
    deleteDependent$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(invokeDeleteDependentAPI),
            switchMap((actions) => {
                this.appStore.dispatch(
                    setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
                );
                return this.dependentService.deleteDependent(actions.id, actions.dependentId).pipe(
                    map(() => {
                        this.appStore.dispatch(
                            setAPIStatus({
                                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
                            })
                        );
                        return deleteDependentAPISuccess({ id: actions.id, dependentId: actions.dependentId });
                    })
                )
            })
        )
    })



















}