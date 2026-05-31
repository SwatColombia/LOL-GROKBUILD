import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PersonsComponent } from './components/pages/persons/persons.component';
import { HextechCrystalComponent } from './components/3d/hextech-crystal/hextech-crystal.component';
import { ComparatorComponent } from './components/pages/comparator/comparator.component';
import { MouseTiltDirective } from './directives/mouse-tilt.directive';
import { LoginComponent } from './components/pages/auth/login/login.component';
import { RegisterComponent } from './components/pages/auth/register/register.component';
import { VerifyComponent } from './components/pages/auth/verify/verify.component';
import { RegionsComponent } from './components/pages/regions/regions.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { LiveComponent } from './components/pages/live/live.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PersonsComponent,
    HextechCrystalComponent,
    ComparatorComponent,
    MouseTiltDirective,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    RegionsComponent,
    ProfileComponent,
    LiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
