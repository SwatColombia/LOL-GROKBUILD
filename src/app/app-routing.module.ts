import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { PersonsComponent } from './components/pages/persons/persons.component';
import { ComparatorComponent } from './components/pages/comparator/comparator.component';
import { LoginComponent } from './components/pages/auth/login/login.component';
import { RegisterComponent } from './components/pages/auth/register/register.component';
import { VerifyComponent } from './components/pages/auth/verify/verify.component';
import { RegionsComponent } from './components/pages/regions/regions.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { LiveComponent } from './components/pages/live/live.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'persons', component: PersonsComponent },
  { path: 'comparator', component: ComparatorComponent },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'regions', component: RegionsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'live', component: LiveComponent },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
