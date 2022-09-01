import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";

import * as fromCustomer from './store/reducers/customer.reducer';

export interface State {
    customer: fromCustomer.CustomersState;
}

/*export const reducers: ActionReducerMap<State> = {
};*/
