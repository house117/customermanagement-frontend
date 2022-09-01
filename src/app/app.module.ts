import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// Modules
import { SharedModule } from './components/shared/shared.module';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { customerReducer } from './store/reducers/customer.reducer';
import { EffectsModule } from '@ngrx/effects';

import { appReducer } from './store/reducers/app.reducer';


@NgModule({
  declarations: [
        AppComponent,
        LoginComponent,
  ],
  imports: [
    BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      SharedModule,
      StoreModule.forRoot({ appState: appReducer }),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
      HttpClientModule,
      EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
