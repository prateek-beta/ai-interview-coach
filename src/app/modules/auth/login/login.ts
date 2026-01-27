import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+@gmail\.com$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/)
      ]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) return;

    const data = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.auth.login(data).subscribe({
      next: (res: any) => {
        alert("Logged in Successfully");
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: err => alert(err.error.msg || "Login failed")
    });
  }
}