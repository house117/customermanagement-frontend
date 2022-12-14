export interface Customer {
    id?: number,
    firstName: string,
    lastName: string,
    birthDate: string,
    gender: string,
    email: string,
    phone: string,
    streetAddress: string,
    city: string,
    state: string,
    postal: string,
    dependents: [],
    createdDate?: string,
    modifiedDate?: string,
}