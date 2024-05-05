import { Component, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// font-awesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGreaterThan, faEnvelope, faLock, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  // icons declaration
  mailIcon = faEnvelope;
  passwordIcon = faLock;
  eyeIconPassword = faEye;
  loginIcon = faGreaterThan;

  // Social icons declaration
  instaIcon = faInstagram;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  linkdinIcon = faLinkedin;
  githubIcon = faGithub;

  // variable declaration
  passwordType = 'password';
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }
  
  // -- [start] Validation code --
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }
  // -- [end] Validation code --

  togglePassword(inputType: string){
    if(inputType === 'password')
    {
      this.passwordType = 'text';
      this.eyeIconPassword = faEyeSlash;
    }
    else{
      this.passwordType = 'password';
      this.eyeIconPassword = faEye;
    }
  }

  // login form submit functionality 
  onloginFormSubmit(){
    console.log(this.loginForm.value);   
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        // After user signedUp, show the success toast
        this.toastService.show({ template: this.toastService.getSuccessTemplateRef(), classname: 'bg-success text-dark', delay: 3000, message: 'Logged in Successfully!'});

        console.log(response);
        this.authService.setUserId(response.data._id);
        this.authService.isLoggedIn$.next(true);
        this.router.navigate(['/notesList']);
      },
      error: (error) => {
        // User signedUp Error message, show the success toast

        console.log(error.error.message);
      }
    })
  }
}
