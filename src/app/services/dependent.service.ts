import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Dependent } from '../store/models/dependent';


export interface encapsulatedResponse {
    data: Dependent,
    id: Number
}


@Injectable({
    providedIn: 'root'
})
export class DependentService {
    port = '9081';
    configUrl = `http://localhost:${this.port}/api/customers/`;
    constructor(private http: HttpClient) {

    }

    // CREATE Dependent
    createDependent(payload: Dependent) {
        return this.http.post<Dependent>(`${this.configUrl}${payload.customer_id}/dependents/`, payload);
    }

    // UPDATE Dependent
    updateDependent(payload: Dependent) {
        return this.http.put<Dependent>(`${this.configUrl}${payload.customer_id}/dependents/${payload.id}`, payload);
    }

    // DELETE Dependent
    deleteDependent(id: number, dependentId: number): Observable<any> {
        return this.http.delete<Dependent[]>(
            `${this.configUrl}${id}/dependents/${dependentId}`);
    }
}
