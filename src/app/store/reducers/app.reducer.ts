import { createReducer, on } from "@ngrx/store";
import { setAPIStatus } from "../actions/app.action";
import { Appstate } from "../appstate";

export const initialState: Readonly<Appstate> = {
    apiStatus: '',
    apiResponseMessage: ''
}

export const appReducer = createReducer(
    initialState,
    on(setAPIStatus, (state, { apiStatus }) => {
        return {
            ...state,
            ...apiStatus
        };
    })
)