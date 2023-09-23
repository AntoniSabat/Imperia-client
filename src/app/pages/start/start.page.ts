import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  goToInfo() {
    this.router.navigate(['info'])
  }
  goToLogin() {
    this.router.navigate(['login']);
  }
  goToRegister() {
    this.router.navigate(['register'])
  }
  constructor(private router: Router) { }

  ngOnInit() {}
}
