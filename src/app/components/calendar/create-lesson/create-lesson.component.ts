import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../services/users.service";
import {ClubsService} from "../../../services/clubs.service";
import {Club} from "../../../models/club.model";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.scss'],
})
export class CreateLessonComponent  implements OnInit {
  employees$ = this.clubsService.employees$;
  clubs$: BehaviorSubject<Club[]> = this.clubsService.clubs$;
  selectedClub!: Club;
  selectedEmployee!: any;

  constructor(
    private modalCtrl: ModalController,
    private clubsService: ClubsService,
    private usersService: UsersService) { }

  async ngOnInit() {
    this.employees$.subscribe((employees: any) => {
      console.log(employees);
    })

    await this.clubsService.loadClubs();
  }

  async chooseClub() {
    console.log(this.selectedClub.id);
    await this.clubsService.loadEmployees(this.selectedClub.id);
  }

  // async chooseEmployee() {
  //   console.log(this.selectedEmployee);
  // }
  chooseEmployee() {
    if (this.selectedEmployee) {
      const employeeId = this.selectedEmployee.uuid;

      const user = this.usersService.getUser(employeeId);
      this.selectedEmployee.name = user.name;
      this.selectedEmployee.surname = user.surname;
      console.log(this.selectedEmployee);
    }
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

}
