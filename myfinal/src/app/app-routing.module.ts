import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BestdealsComponent } from './bestdeals/bestdeals.component';
import { DealsComponent } from './deals/deals.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './Shared/auth.guard';


const routes: Routes = [
  {
    path:'', redirectTo:'/deals', pathMatch:'full'
  },
  {
    path:'deals', component: DealsComponent
  },
  {
    path:'best-deals', component: BestdealsComponent, canActivate: [AuthGuard]
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'register', component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
