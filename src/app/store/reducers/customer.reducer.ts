import { createFeatureSelector, createReducer, on } from "@ngrx/store";

// Actions

import {
    customersFetchAPISuccess,
    createCustomerAPISuccess,
    deleteCustomerAPISuccess,
    updateCustomerAPISuccess,
    createDependentAPISuccess,
    deleteDependentAPISuccess,
    updateDependentAPISuccess
} from "../actions/customer.action";

export interface CustomersState {
    customers: Customer[];
}
import { Customer } from "../models/customer";
import { Dependent } from "../models/dependent";
import * as fromRoot from '../../app.reducer';


export const initialState: ReadonlyArray<Customer> = [];

export const customerReducer = createReducer(
    initialState,
    on(customersFetchAPISuccess, (state, { allCustomers }) => {
        return allCustomers;
    }),
    on(createCustomerAPISuccess, (state, { newCustomer }) => {
        let newState = [...state];
        newState.unshift(newCustomer);
        return newState;
    }),
    on(updateCustomerAPISuccess, (state, { updateCustomer }) => {
        let newState = state.filter((_) => _.id != updateCustomer.id);
        newState.unshift(updateCustomer);
        return newState;
    })
    ,
    on(deleteCustomerAPISuccess, (state, { id }) => {
        let newState = state.filter((_) => _.id != id);
        return newState;
    }),
    on(deleteDependentAPISuccess, (state, { id, dependentId }) => {
        let newState = state.filter((_) => _.id != id);
        let newCustomer: Customer;
        let oldCustomer = state.filter((_) => _.id === id);

        newCustomer = Object.assign({}, oldCustomer[0]);


        let newDep: Dependent[] = Object.assign([], newCustomer.dependents);
        let updatedDep = newDep.filter((_) => _.id != dependentId);
        newCustomer.dependents = updatedDep as [];
        newState.unshift(newCustomer);

        return newState;
    })
    ,
    on(createDependentAPISuccess, (state, { newDependent }) => {

        let newState = state.filter((_) => _.id != newDependent.customer_id);
        let newCustomer: Customer;
        let oldCustomer = state.filter((_) => _.id === newDependent.customer_id);

        newCustomer = Object.assign({}, oldCustomer[0]);


        let newDep: Dependent[] = Object.assign([], newCustomer.dependents);
        newDep.unshift(newDependent);
        newCustomer.dependents = newDep as [];
        newState.unshift(newCustomer);

        return newState;
    }),
    on(updateDependentAPISuccess, (state, { updateDependent }) => {
        let newState = state.filter((_) => _.id != updateDependent.customer_id);
        let newCustomer: Customer;
        let oldCustomer = state.filter((_) => _.id === updateDependent.customer_id);

        newCustomer = Object.assign({}, oldCustomer[0]);


        let newDep: Dependent[] = Object.assign([], newCustomer.dependents);
        let updatedDep = newDep.filter((_) => _.id != updateDependent.id);
        updatedDep.unshift(updateDependent);
        newCustomer.dependents = updatedDep as [];
        newState.unshift(newCustomer);

        return newState;
    })
);


//Selector
//export const getCustomerState = createFeatureSelector<CustomersState>('customers');




/*
const initialState: Array<Customer> = [
    {
        id: 1,
        firstName: "Jose",
        lastName: "Flores",
        birthDate: "1995-05-17",
        gender: "Male",
        email: "josef@gmail.com",
        phone: "9511346765",
        streetAddress: "Venue St. 12",
        city: "Arlington",
        state: "VA",
        postal: "945334",
        dependents: [],
        createdDate: "1995-05-17",
        modifiedDate: "1995-05-17"
    }
]
*/