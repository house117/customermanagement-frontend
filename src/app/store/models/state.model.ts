import { Customer } from "./customer";
export interface State {
    readonly customers: Array<Customer>;
}