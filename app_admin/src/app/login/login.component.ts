import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
  // Variables
  public formError: string = '';
  public submitted: boolean = false;
  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  // Constructor to inject Router and AuthenticationService
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  // Method to handle form submission
  public onLoginSubmit(): void {
    this.formError = '';

    // Validate that all fields are filled
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // Return to login page
      return;
    }

    // Proceed with login process
    this.doLogin();
  }

  // Method to process the login
  private doLogin(): void {
    const newUser: User = {
      name: this.credentials.name,
      email: this.credentials.email
    };

    // Call the login method from the authentication service
    this.authenticationService.login(newUser, this.credentials.password);

    // Check if user is logged in and redirect accordingly
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']); // Redirect to homepage or dashboard
    } else {
      // Retry after a delay in case of asynchronous issues
      setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}
