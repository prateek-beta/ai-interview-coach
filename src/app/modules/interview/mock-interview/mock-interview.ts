import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiInterviewService, CandidateContext, InterviewQuestion } from '../../../services/ai-interview.service';

@Component({
  selector: 'app-mock-interview',
  imports: [NgIf, FormsModule],
  templateUrl: './mock-interview.html',
  styleUrl: './mock-interview.scss',
})
export class MockInterview implements OnInit, OnDestroy {
  sessionId = '';
  candidateName = '';
  questions: InterviewQuestion[] = [];
  currentQuestionIndex = 0;
  answerText = '';
  codeAnswer = '';
  inputType: 'TEXT' | 'VOICE' | 'CODE' = 'TEXT';
  timer = 45;
  intervalId?: ReturnType<typeof setInterval>;

  constructor(private aiInterviewService: AiInterviewService, private router: Router) {}

  ngOnInit(): void {
    const candidateProfileRaw = localStorage.getItem('candidateProfile');
    const candidate: CandidateContext = candidateProfileRaw
      ? JSON.parse(candidateProfileRaw)
      : { candidateId: `guest-${Date.now()}`, candidateName: 'Guest Candidate', resumeSkills: ['Angular'] };

    const session = this.aiInterviewService.createSession(candidate.candidateId, candidate.candidateName, candidate.resumeSkills);
    this.sessionId = session.sessionId;
    this.candidateName = session.candidateName;
    this.questions = session.questions;

    this.startTimer();

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  submitCurrentAnswer() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    const finalAnswer = this.inputType === 'CODE' ? this.codeAnswer : this.answerText;
    if (!finalAnswer.trim()) {
      alert('Please provide answer or wait for auto-skip after timer.');
      return;
    }

    this.aiInterviewService.submitAnswer(question.id, finalAnswer, this.inputType, this.codeAnswer);
    this.moveToNextQuestion();
  }

  completeInterview() {
    this.aiInterviewService.completeSession();
    this.router.navigate(['/report']);
  }

  private moveToNextQuestion() {
    this.answerText = '';
    this.codeAnswer = '';
    this.inputType = 'TEXT';

    if (this.currentQuestionIndex >= this.questions.length - 1) {
      this.completeInterview();
      return;
    }

    this.currentQuestionIndex += 1;
    this.resetTimer();
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        const question = this.questions[this.currentQuestionIndex];
        if (question) {
          this.aiInterviewService.autoSkipQuestion(question.id);
        }
        this.moveToNextQuestion();
      }
    }, 1000);
  }

  private resetTimer() {
    this.timer = 45;
  }

  private visibilityHandler = () => {
    if (document.hidden) {
      this.aiInterviewService.addIntegritySignal({
        eventType: 'TAB_SWITCH',
        severity: 'MEDIUM',
        note: 'Candidate moved away from interview tab.',
        detectedAt: new Date().toISOString()
      });
    }
  };
}
