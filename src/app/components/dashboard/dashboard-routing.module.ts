import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { CreateDependentComponent } from './customers/dependents/create-dependent/create-dependent.component';
import { DependentsComponent } from './customers/dependents/dependents.component';
import { EditDependentComponent } from './customers/dependents/edit-dependent/edit-dependent.component';
import { EditCustomerComponent } from './customers/edit-customer/edit-customer.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'customers/:id/dependents/create-dependent', component: CreateDependentComponent },
            { path: 'customers/:id/dependents/:dependentId', component: EditDependentComponent, },
            { path: 'customers/create-customer', component: CreateCustomerComponent },
            { path: 'customers/:id/dependents', component: DependentsComponent },
            { path: 'customers/:id', component: EditCustomerComponent },
            { path: 'customers', component: CustomersComponent },
            { path: '', component: HomeComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
