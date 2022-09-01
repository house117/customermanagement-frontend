import { Action, createAction, props } from "@ngrx/store";
import { Customer } from "../models/customer";
import { Dependent } from "../models/dependent";

// GET Actions
export const invokeCustomersAPI = createAction(
    '[Customers API] Invoke Customers Fetch API'
);

export const customersFetchAPISuccess = createAction(
    '[Customers API] Fetch API Success',
    props<{ allCustomers: Customer[] }>()
);


// DELETE Actions
export const invokeDeleteCustomerAPI = createAction(
    '[Customer API] Invoke delete customer API',
    props<{ id: number }>()
);

export const deleteCustomerAPISuccess = createAction(
    '[Customer API] deleted customer success',
    props<{ id: number }>()
);


// CREATE Actions
export const invokeCreateCustomerAPI = createAction(
    '[Customer API] Invoke create customer API',
    props<{ newCustomer: Customer }>()
)

export const createCustomerAPISuccess = createAction(
    '[Customer API] Create new customer API success',
    props<{ newCustomer: Customer }>()
)

// UPDATE Actions
export const invokeUpdateCustomerAPI = createAction(
    '[Customer API] Inovke update customer api',
    props<{ updateCustomer: Customer }>()
);

export const updateCustomerAPISuccess = createAction(
    '[Customer API] update Customer api success',
    props<{ updateCustomer: Customer }>()
);


// DEPENDENT ACTIONS ---

// CREATE Actions
export const invokeCreateDependentAPI = createAction(
    '[Dependent API] Invoke create dependent API',
    props<{ newDependent: Dependent }>()
)

export const createDependentAPISuccess = createAction(
    '[Dependent API] Create new dependent API success',
    props<{ newDependent: Dependent }>()
)

// UPDATE Actions
export const invokeUpdateDependentAPI = createAction(
    '[Dependent API] Inovke update Dependent api',
    props<{ updateDependent: Dependent }>()
);

export const updateDependentAPISuccess = createAction(
    '[Dependent API] update Dependent api success',
    props<{ updateDependent: Dependent }>()
);

// DELETE Actions
export const invokeDeleteDependentAPI = createAction(
    '[Dependent API] Invoke delete Dependent API',
    props<{ id: number, dependentId: number }>()
);

export const deleteDependentAPISuccess = createAction(
    '[Dependent API] deleted Dependent success',
    props<{ id: number, dependentId: number }>()
);
