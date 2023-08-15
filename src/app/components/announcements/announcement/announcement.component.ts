import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
})
export class AnnouncementComponent {
  @Input() hasHeader: boolean = false;
  @Input() hasFooter: boolean = false;
  @Input() title!: string;
  @Input() createdAt!: string;
  @Input() desc!: string;
}
