import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';


import { DashboardRoutingModule } from './dashboard-routing.module';

// Modules
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomersComponent } from './customers/customers.component';

// Reducers
import { customerReducer } from 'src/app/store/reducers/customer.reducer';

import { EffectsModule } from '@ngrx/effects';
import { CustomersEffect } from 'src/app/store/effects/customers.effect';
import { DialogComponent } from './dialog/dialog.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { EditCustomerComponent } from './customers/edit-customer/edit-customer.component';
import { DependentsComponent } from './customers/dependents/dependents.component';
import { CreateDependentComponent } from './customers/dependents/create-dependent/create-dependent.component';
import { EditDependentComponent } from './customers/dependents/edit-dependent/edit-dependent.component';

@NgModule({
    declarations: [
        DashboardComponent,
        HomeComponent,
        NavbarComponent,
        CustomersComponent,
        DialogComponent,
        CreateCustomerComponent,
        EditCustomerComponent,
        DependentsComponent,
        CreateDependentComponent,
        EditDependentComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule,
        StoreModule.forFeature('customers', customerReducer),
        EffectsModule.forFeature([CustomersEffect])
    ]
})
export class DashboardModule { }
