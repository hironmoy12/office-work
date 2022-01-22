import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() background: string = 'transparent';
  @Input() color: string = '#ffffff';
  @Input() class: string = '';
  @Input() standalone: boolean = false;
  @Input() text: string = ''
  @Input() fullPage: boolean = false
  isLoading = this.event.isHttpRequest;

  constructor(
    private event: EventService
  ) { }

  ngOnInit(): void {
  }

}
