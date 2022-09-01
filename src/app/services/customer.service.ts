import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Customer } from '../store/models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private http: HttpClient) { }

    port = '9081';
    configUrl = `http://localhost:${this.port}/api/customers/`;


    getCustomers() {
        return this.http.get<Customer[]>(this.configUrl);
    }

    getCustomer(id: number): Observable<any> {

        const params: HttpParams = new HttpParams({ fromObject: { id: id } });
        params.append("id", id);

        return this.http.get<Customer[]>(this.configUrl, { params: params });
    }

    // CREATE Customer
    createCustomer(payload: Customer) {
        return this.http.post<Customer>(this.configUrl, payload);
    }

    // UPDATE Customer
    updateCustomer(payload: Customer) {
        return this.http.put<Customer>(`${this.configUrl}${payload.id}`, payload);
    }

    // DELETE cucstomer
    deleteCustomer(id: number): Observable<any> {
        //const params: HttpParams = new HttpParams({ fromObject: { id: id } });
        //params.append("id", id);
        return this.http.delete<Customer[]>(
            `${this.configUrl}${id}`);
    }
}
