import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe, CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [UpperCasePipe , FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  isLoggedIn = false;
  userEmail = "";
  userName = "";
  showMenu: any;


  constructor(private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.userEmail = localStorage.getItem("email") || "";
    this.userName = this.userEmail.split("@")[0];
  }

  loginnav() {
    this.router.navigate(['/login']);
  }
  home() {
    this.router.navigate(['/']);
  }
  interview() {
    this.router.navigate(['/interview']);
  }
  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.clear();
    window.location.reload();
  }

}
