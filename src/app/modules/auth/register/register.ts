import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+@gmail\.com$/)
      ]],

      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/)
      ]],

      countryCode: ['+91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      country: ['', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) return;

    const data = {
      email: this.f.email.value,
      password: this.f.password.value,
      mobile: `${this.f.countryCode.value}-${this.f.mobile.value}`,
      country: this.f.country.value
    };

    this.auth.register(data).subscribe({
      next: () => {
        alert("Registered Successfully");
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => alert(err.error.msg)
    });
  }

}
