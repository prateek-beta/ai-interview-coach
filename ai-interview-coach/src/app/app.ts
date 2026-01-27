import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HttpClientModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  //isDashboard = false;
  protected readonly title = signal('ai-interview-coach');

  // constructor(private router: Router){
  // router.events.subscribe(() => {
  //   this.isDashboard = router.url.includes('dashboard');
  // });
// }
}
