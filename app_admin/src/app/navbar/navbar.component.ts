import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  // Inject the AuthenticationService for managing login state and logout functionality
  constructor(private authenticationService: AuthenticationService) { }

  // Lifecycle hook for initialization logic
  ngOnInit(): void {}

  /**
   * Checks if the user is logged in by calling the authentication service.
   * @returns boolean - True if the user is logged in, false otherwise.
   */
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  /**
   * Logs the user out by invoking the logout method in the authentication service.
   */
  public onLogout(): void {
    this.authenticationService.logout();
  }
}
