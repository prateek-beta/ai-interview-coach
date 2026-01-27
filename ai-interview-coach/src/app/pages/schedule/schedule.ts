import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  imports: [DatePipe, NgFor, NgIf, FormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule implements OnInit {
  constructor(private service: ScheduleService, private router: Router) {}

  months: Date[] = [];
  dates: Date[] = [];

  selectedMonth: Date | null = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;

  showForm = false;

  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '04:00 PM', '06:00 PM',
    '08:00 PM'
  ];

  user = {
    name: '',
    email: '',
    phone: '',
    country: ''
  };

  ngOnInit() {
    this.generateMonths();
  }

  // Generate next 6 months
  generateMonths() {
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      this.months.push(new Date(today.getFullYear(), today.getMonth() + i, 1));
    }
    this.selectMonth(this.months[0]);
  }

  selectMonth(month: Date) {
    this.selectedMonth = month;
    this.generateDatesForMonth(month);
  }
  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedIndex = target.selectedIndex;
    if (selectedIndex >= 0 && this.months[selectedIndex]) {
      this.selectMonth(this.months[selectedIndex]);
    }
  }

  generateDatesForMonth(month: Date) {
    this.dates = [];
    const year = month.getFullYear();
    const m = month.getMonth();
    const totalDays = new Date(year, m + 1, 0).getDate();

    for (let d = 1; d <= totalDays; d++) {
      this.dates.push(new Date(year, m, d));
    }
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.selectedTime = '';
    this.showForm = false;
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  

  confirmInterview() {
  if (!this.selectedDate || !this.selectedTime) {
    alert("Please select both date and time");
    return;
  }

  const formData = {
    name: this.user.name,
    email: this.user.email,
    mobile: this.user.phone,
    country: this.user.country,
    date: this.selectedDate.toISOString().split('T')[0],
    time: this.selectedTime
  };

  this.service.scheduleInterview(formData).subscribe({
    next: () => {
      alert("Interview Scheduled Successfully");
    },
    error: (err) => {
      if (err.status === 403) {
        this.router.navigate(['/free-trial-limit']);
      } else {
        alert("Server Error. Try again.");
      }
    }
  });
}


}



