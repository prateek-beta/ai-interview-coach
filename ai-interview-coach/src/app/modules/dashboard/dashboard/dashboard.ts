import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../../services/resume.service';
import { ScheduleService } from '../../../services/schedule.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  //user: any;
  resumePath: string | null = null;
  showInterviewButton = false;

  constructor(private resumeService: ResumeService, private service: ScheduleService, private router: Router) { }


  userEmail = localStorage.getItem("email") || "";
  userName = "";

  showForm = false;


  stats = {
    totalInterviews: 0,
    aiScore: 0,
    improvementAreas: ["Communication", "DSA", "System Design"],
    nextInterviewIn: "2 Days 5 Hours",
    lastInterview: "Not Taken Yet"
  };

  todoList: string[] = [];
  newTask = "";

  ngOnInit() {
    this.extractName();
    this.loadResume();
  }

  extractName() {
    this.userName = this.userEmail.split("@")[0];
  }

  // Resume Upload
  onResumeUpload(event: any) {
    const file = event.target.files[0];

    if (!file || file.type !== "application/pdf") {
      alert("Only PDF allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("name", this.userName);
    formData.append("email", this.userEmail);

    this.resumeService.uploadResume(formData).subscribe({
      next: (res: any) => {
        alert("Resume Uploaded Successfully");
        this.loadResume();
        console.log("Upload Success:", res);
      },
      error: (err) => {
        console.error("Upload Error:", err);
        alert("Resume upload failed");
      }
    });
  }

  loadResume() {
    this.resumeService.getResume().subscribe((res: any) => {
      this.resumePath = res.resume;

      if (this.resumePath) {
        this.showInterviewButton = true;
      }
    });
  }

  confirmInterview() {
    this.router.navigate(['/loggedSchedule']);
  }

  // TODO Feature
  addTask() {
    if (this.newTask.trim()) {
      this.todoList.push(this.newTask);
      this.newTask = "";
    }
  }

  removeTask(index: number) {
    this.todoList.splice(index, 1);
  }
}
