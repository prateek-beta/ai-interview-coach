import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './modules/dashboard/home/home';
import { Login } from './modules/auth/login/login';
import { Register } from './modules/auth/register/register';
import { MockInterview} from './modules/interview/mock-interview/mock-interview';
import { Report } from './modules/feedback/report/report';
import { Schedule } from './pages/schedule/schedule';
import { FreeTrialLimit } from './modules/interview/free-trial-limit/free-trial-limit';
import { Dashboard } from './modules/dashboard/dashboard/dashboard';
import { loggedSchedule } from './pages/loggedSchedule/loggedSchedule';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'interview', component: MockInterview },
  { path: 'report', component: Report },
  { path: 'schedule', component: Schedule },
  { path: 'free-trial-limit', component: FreeTrialLimit },
  { path: 'dashboard', component: Dashboard },
  { path: 'loggedSchedule', component: loggedSchedule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
