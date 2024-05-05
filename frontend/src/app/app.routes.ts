import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { LoginComponent } from './components/login-signup/login/login.component';
import { SignUpComponent } from './components/login-signup/sign-up/sign-up.component';
import { authGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent
    },
    {
        path: 'signup',
        title: 'Signup',
        component: SignUpComponent
    },
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent
    }, 
    {
        path: 'notesList',
        title: 'Notes List',
        component: NotesListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'contact',
        title: 'Contact',
        component: ContactComponent
    },
    {
        path: 'forget-password',
        title: 'Forget Password',
        component: ForgetPasswordComponent
    },
    {
        path: 'reset-password/:token',
        title: 'Reset Password',
        component: ResetPasswordComponent
    },
    {
        path: '**',
        title: 'Page Not Found(4O4)',
        component: PageNotFoundComponent
    }
];
