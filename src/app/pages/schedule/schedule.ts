import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  interviewScheduled = false;
  calendarEventUrl = '';

  timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  user = {
    name: '',
    email: '',
    phone: '',
    country: '',
    resumeSkills: 'Angular, TypeScript, SQL'
  };

  ngOnInit() {
    this.generateMonths();
  }

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
      alert('Please select both date and time');
      return;
    }

    const formData = {
      name: this.user.name,
      email: this.user.email,
      mobile: this.user.phone,
      country: this.user.country,
      resumeSkills: this.user.resumeSkills,
      date: this.selectedDate.toISOString().split('T')[0],
      time: this.selectedTime
    };

    this.service.scheduleInterview(formData).subscribe({
      next: () => {
        this.interviewScheduled = true;
        this.calendarEventUrl = this.buildGoogleCalendarLink();
        localStorage.setItem('candidateProfile', JSON.stringify({
          candidateId: this.user.email || `guest-${Date.now()}`,
          candidateName: this.user.name,
          resumeSkills: this.user.resumeSkills.split(',').map((skill) => skill.trim()).filter(Boolean)
        }));
        alert('Interview Scheduled Successfully. Add this event to your calendar and click Take AI Interview.');
      },
      error: (err) => {
        if (err.status === 403) {
          this.router.navigate(['/free-trial-limit']);
        } else {
          alert('Server Error. Try again.');
        }
      }
    });
  }

  startInterview() {
    this.router.navigate(['/interview']);
  }

  private buildGoogleCalendarLink(): string {
    if (!this.selectedDate || !this.selectedTime) return '';

    const [time, meridiem] = this.selectedTime.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hour = Number(hourStr);
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    const start = new Date(this.selectedDate);
    start.setHours(hour, Number(minuteStr), 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'AI Mock Interview Session',
      details: 'AI interview scheduled from AI Interview Coach platform',
      location: 'Online',
      dates: `${format(start)}/${format(end)}`
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
}
