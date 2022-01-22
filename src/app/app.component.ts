import { Component, ComponentRef, OnInit } from '@angular/core';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular12';
  isLogedIn: boolean;

  constructor(
    private event: EventService
  ) {
    this.isLogedIn = false;
  }

  ngOnInit() { }


  bindRootData(event: any): void {
    // DETECT USER IS ONLINE OR NOT
    this.event.isLogedin.subscribe((isLogedIn: boolean) => {
      this.isLogedIn = isLogedIn;
      if (isLogedIn) {
        // CALL A HTTP REQUEST FOR USER DETAILS

        // DUMMY DATA ASSIGN
        event.USER = {
          first_name: 'dummy',
          last_name: 'User',
        }
        event.isLogedIn = isLogedIn;
      }
    });
    // A STATUC DUMMY DATA IS ASSIGNED ON HOME PAGE
    event.homePageDummyData = {
      title: 'This is dummy data binded from app component. Use this features to bind the most common data. **Please note: Change the icons folder\'s images with project\s logo.'
    };
  }

}
