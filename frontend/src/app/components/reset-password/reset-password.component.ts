import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// font-awesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGithub, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEye, faGreaterThan, faKey } from '@fortawesome/free-solid-svg-icons';

// services import
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

// Custome validators import
import { passwordStrength } from '../../Validators/SyncValidators/passwordStrength.validator';
import { confirmPasswordMatch } from '../../Validators/SyncValidators/confirmPassword.validator';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  // icons declaration
  passwordIcon = faKey;
  eyeIconPassword = faEye;
  eyeIconConfirmPassword = faEye;
  submitIcon = faGreaterThan;

  // Social icons declaration
  instaIcon = faInstagram;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  linkdinIcon = faLinkedin;
  githubIcon = faGithub;

  // variable declaration
  newPasswordType:string = 'password';
  confirmPasswordType:string = 'password';
  token!: string; 

  resetPswForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  activatedRoute = inject(ActivatedRoute);

  // -- Validation code starts --
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
    
    this.resetPswForm = new FormGroup({
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
      this.newPasswordType = "text";
      this.eyeIconPassword = faEyeSlash;
    }else{
      this.newPasswordType = "password";
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

  formdata !: {newPassword: string, token: string};

  // Signup form Submit functionality
  onResetPswFormSubmit(){
    this.formdata = {
      newPassword: this.resetPswForm.value.psw.password,
      token: this.token
    };
    console.log(this.formdata);


    this.authService.resetPassword(this.formdata).subscribe({
      next: data => {
        console.log(data);
        if(data.status == 200 && data.success == true)
        {
          // After user signedUp, show the success toast
          // this.toastService.show({ template: this.toastService.getSuccessTemplateRef(), classname: 'bg-success text-dark', delay: 3000, message: 'Password Reset Successfully!'});
          
          console.log(data.message);
          this.resetPswForm.reset();
          this.router.navigate(['/login']);

        }
        else{
          console.log(data.message);
        }
      },
      error: error => {
        // User signedUp Error message, show the success toast
        // this.toastService.show({ template: this.toastService.getDangerTemplateRef(), classname: 'bg-danger text-dark', delay: 3000, message: error.error.message});

        console.error('There was an error!', error.error.message);
      }
    });

  }
}
