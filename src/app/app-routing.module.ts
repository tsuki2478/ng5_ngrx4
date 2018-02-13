import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
     { path: '', redirectTo: '/login', pathMatch: 'full' },
    // { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/project', pathMatch: 'full' },
    // { path: 'project', component: ProjectListComponent },
    { path: '', redirectTo: '/tasklists', pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
