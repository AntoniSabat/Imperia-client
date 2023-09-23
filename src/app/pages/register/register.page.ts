import {Component} from '@angular/core';
import {UsersService, UserType} from "../../services/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(private usersService: UsersService, private router: Router) {}

  name = '';
  surname = '';
  email = '';
  password = '';
  confirmPassword = '';
  type: UserType = UserType.STUDENT;

  resetInputs() {
    this.name = '';
    this.surname = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async register() {
    if (this.password === this.confirmPassword) {
       const response = await this.usersService.signup(this.name, this.surname, this.type, this.email, this.password);

      if (response.status == 'correct') {
        console.log(response.data);
        this.resetInputs();
        await this.router.navigate(['']);
      }
      else {
        console.log('Hasło niepoprawne: ', response.data)
        this.resetInputs();
      }
    }
    else
      console.log('Hasła nie pasują do siebie')
  }
}
