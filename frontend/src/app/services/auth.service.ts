import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  // Creating an behavior subject to store that user is logged in or not
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  
  // signup user
  signupUser(signupData: any): Observable<any> {
    return this.http.post('http://localhost:4500/api/auth/signup', signupData, httpOptions);
  }

  // fetching the user emails for checking the email is already exists or not
  checkEmailExists(): Observable<any> {
    return this.http.get('http://localhost:4500/api/auth/check-email-exist');  
  }

  // login user
  loginUser(loginData: any): Observable<any> {
    return this.http.post('http://localhost:4500/api/auth/login', loginData, httpOptions);
  }

  // forget password (sending email)
  forgetPassword(email: any): Observable<any> {
    return this.http.post('http://localhost:4500/api/auth/send-email', email, httpOptions);
  }
  
  // reset password
  resetPassword(resetData: any): Observable<any> {
    return this.http.post('http://localhost:4500/api/auth/reset-password', resetData, httpOptions);
  }

  // Store the userId securely, for example, in local storage
  setUserId(_id: string): void {
    if(_id)
    {
      localStorage.setItem('user_id', _id);
    }
  }

  // Retrieve the userId securely, for example, from local storage
  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getUserId();
  }

  isLoggedIn(){
    return !!localStorage.getItem('user_id');
  }

  // Logout
  logout(): void {
    // Clear the stored userId
    localStorage.removeItem('user_id');
    // Additional logic for logout, e.g., redirecting to login page
    this.router.navigate(['/login']);
  }
}
