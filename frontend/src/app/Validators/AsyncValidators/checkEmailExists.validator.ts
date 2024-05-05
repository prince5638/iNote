import { AbstractControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

export class checkEmailExists{

    constructor(private authService: AuthService){

    }
    
    static checkEmailAlreadyExists(authService: AuthService): (control: AbstractControl) => Promise<any> {
        return (control: AbstractControl): Promise<any> => {
            return authService.checkEmailExists().toPromise()
                .then((emails: any) => {
                    console.log(emails.data);
                    return isEmailAlreadyExists(control.value, emails.data);
                })
                .catch(() => {
                    return null; // Handle error accordingly, for simplicity returning null here
                });
        };
    }
}

function isEmailAlreadyExists(email: string, takenUsersEmail: string[]){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(takenUsersEmail.includes(email)){
                resolve({emailAlreadyExists: true});
            }
            else{
                resolve(null);
            }
        }, 2000)
    })
}