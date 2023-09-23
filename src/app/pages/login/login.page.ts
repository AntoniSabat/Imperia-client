import { Component, OnInit } from '@angular/core';
import {UsersService, UserType} from "../../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  resetInputs() {
    this.email = '';
    this.password = '';
  }

  async login() {
    const response = await this.usersService.signin(this.email, this.password);
    if (response.status == 'correct') {
      localStorage.setItem('auth', response.data)
      this.resetInputs();
      await this.router.navigate(['']);
    }
    else {
      console.log('Hasło niepoprawne: ', response.data)
      this.resetInputs();
    }
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  constructor(private usersService: UsersService, private router: Router) { }
}
