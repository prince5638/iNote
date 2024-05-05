import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGreaterThan, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  // icons declaration
  mailIcon = faEnvelope;
  passwordIcon = faLock;

  // eyeIconPassword = faEye;
  submitIcon = faGreaterThan;

  // Social icons declaration
  instaIcon = faInstagram;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  linkdinIcon = faLinkedin;
  githubIcon = faGithub;

  // variable declaration
  frogetPswForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }
  
  // -- [start] Validation code --
  ngOnInit(): void {
    this.frogetPswForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
      // password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }
  // -- [end] Validation code --

  // login form submit functionality 
  onForgetPswFormSubmit(){ 

    this.authService.forgetPassword(this.frogetPswForm.value).subscribe({
      next: (response) => {
        // After user signedUp, show the success toast
        // this.toastService.show({ template: this.toastService.getSuccessTemplateRef(), classname: 'bg-success text-dark', delay: 3000, message: 'Email sent Successfully!'});  

        console.log(response);
        this.router.navigate(['/login']);
        // this.authService.setUserId(response.data._id);
        // this.authService.isLoggedIn$.next(true);
        // this.router.navigate(['/notesList']);
      },
      error: (error) => {
        // User signedUp Error message, show the success toast
        // this.toastService.show({ template: this.toastService.getDangerTemplateRef(), classname: 'bg-danger text-dark', delay: 3000, message: error.error.message});  

        console.log(error.error.message);
      }
    })
    
  }
}
