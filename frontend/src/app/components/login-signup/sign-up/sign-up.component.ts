import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// font-awesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faKey, faEye, faEyeSlash, faGreaterThan, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { confirmPasswordMatch } from '../../../Validators/SyncValidators/confirmPassword.validator';
import { checkEmailExists } from '../../../Validators/AsyncValidators/checkEmailExists.validator';

import { passwordStrength } from '../../../Validators/SyncValidators/passwordStrength.validator';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  // icons declaration
  mailIcon = faEnvelope;
  passwordIcon = faKey;
  eyeIconPassword = faEye;
  eyeIconConfirmPassword = faEye;
  signUpIcon = faGreaterThan;
  emailAllowed = faCircleCheck;

  // Social icons declaration
  instaIcon = faInstagram;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  linkdinIcon = faLinkedin;
  githubIcon = faGithub;

  // variable declaration
  passwordType:string = 'password';
  confirmPasswordType:string = 'password';

  signupForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  // -- Validation code starts --
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),

      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),

      email: new FormControl('', [Validators.required, Validators.email], checkEmailExists.checkEmailAlreadyExists(this.authService)),

      psw: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
      }, [confirmPasswordMatch(), passwordStrength()])
    });
  }
  // -- Validation code ends --

  togglePassword(inputType: string){
    // console.log(inputType);
    if(inputType == "password")
    {
      this.passwordType = "text";
      this.eyeIconPassword = faEyeSlash;
    }else{
      this.passwordType = "password";
      this.eyeIconPassword = faEye;
    }
  }
  
  toggleConfirmPassword(inputType: string)
  {
    // console.log("confirm",inputType);
    if(inputType == "password")
    {
      this.confirmPasswordType = "text";
      this.eyeIconConfirmPassword = faEyeSlash;
    }
    else{
      this.confirmPasswordType = "password";
      this.eyeIconConfirmPassword = faEye;
    }
  }

  formdata !: {firstName: string, lastName: string, email: string, password: string};

  // Signup form Submit functionality
  onSignupFormSubmit(){
    // console.log(this.signupForm.value);
    this.formdata = {
      email: this.signupForm.value.email,
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      password: this.signupForm.value.psw.password
    };
    console.log(this.signupForm);
    this.authService.signupUser(this.formdata).subscribe({
      next: data => {
        console.log(data);
        if(data.status == 200 && data.success == true){
          // After user signedUp, show the success toast
          
          console.log(data.message);
          this.signupForm.reset();
          this.router.navigate(['/login']);

        }
        else{
          console.log(data.message);
        }
      },
      error: error => {
        // User signedUp Error message, show the success toast

        console.error('There was an error!', error.error.message);
      }
    });
  }
}
