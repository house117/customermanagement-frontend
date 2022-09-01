import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Customer } from "../models/customer";
import { Dependent } from "../models/dependent";

export const selectCustomers = createFeatureSelector<Customer[]>('customers');


export const selectCustomerById = (customerId: number) =>
    createSelector(selectCustomers, (customers: Customer[]) => {
        var customerbyId = customers.filter((_) => _.id == customerId);
        if (customerbyId.length == 0) {
            return null;
        }
        return customerbyId[0];
    });


export const getDependentsByCustomerId = (customerId: number) =>
    createSelector(selectCustomers, (customers: Customer[]) => {
        var customerbyId = customers.filter((_) => _.id == customerId);
        if (customerbyId.length == 0) {
            return null;
        }
        let dependentsArray: Dependent[] = customerbyId[0].dependents;
        return dependentsArray;
    });

export const selectDependentById = (customerId: number, dependentId: number) =>
    createSelector(selectCustomers, (customers: Customer[]) => {
        var customerbyId: Customer[] = customers.filter((_) => _.id == customerId);
        if (customerbyId.length == 0) {
            return null;
        } else {
            var dependentbyId = customerbyId[0].dependents.filter((_) => (_ as Dependent).id == dependentId);
            return dependentbyId[0];
        }
    })