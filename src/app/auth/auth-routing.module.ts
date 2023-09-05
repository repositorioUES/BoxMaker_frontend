import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { AdminLobbyComponent } from './administrador/admin-lobby/admin-lobby.component';
import { CajasComponent } from './cajas/cajas.component';
import { UserLobbyComponent } from './user-lobby/user-lobby.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "admin",
    component: AdministradorComponent
  },
  {
    path: "admin-lobby",
    component: AdminLobbyComponent
  },
  {
    path: "user-lobby",
    component: UserLobbyComponent
  },
  {
    path: "cajas",
    component: CajasComponent
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
