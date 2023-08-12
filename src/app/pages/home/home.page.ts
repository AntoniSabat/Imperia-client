import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  myName = '';
  constructor(private usersService: UsersService) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    const response = await this.usersService.whoAmI();
    this.myName = response?.data.name;
  }
}
