import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  
  constructor(private authService: AuthService, private router: Router){}
  
  // variable declaration
  isLoggedIn:boolean = false;
  
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((data) => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }
  
  userLogout(){
    this.authService.logout();
    this.authService.isLoggedIn$.next(false);
  }
}
