import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'TCC';

  ngOnInit(): void {
    this.title = 'TCC';
  }
}
