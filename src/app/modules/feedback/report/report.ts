import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AiInterviewService } from '../../../services/ai-interview.service';

@Component({
  selector: 'app-report',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report implements OnInit {
  report: any;
  session: any;

  constructor(private aiInterviewService: AiInterviewService) {}

  ngOnInit(): void {
    const session = this.aiInterviewService.getSession();
    if (session) {
      this.session = session;
      this.report = this.aiInterviewService.buildReport(session);
    }
  }
}
