import { Injectable } from '@angular/core';

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type QuestionType = 'CONCEPTUAL' | 'SCENARIO' | 'CODING';

export interface CandidateContext {
  candidateId: string;
  candidateName: string;
  resumeSkills: string[];
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  candidateId: string;
  candidateName: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
}

export interface InterviewAnswer {
  questionId: string;
  sessionId: string;
  candidateId: string;
  answerText: string;
  inputType: 'TEXT' | 'VOICE' | 'CODE';
  codeSnippet?: string;
  answeredAt: string;
}

export interface QuestionEvaluation {
  questionId: string;
  technicalAccuracy: number;
  depth: number;
  problemSolving: number;
  communication: number;
  feedback: string;
  improvementSuggestions: string[];
}

export interface IntegritySignal {
  eventType: 'TAB_SWITCH' | 'INACTIVITY' | 'SUSPICIOUS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  note: string;
  detectedAt: string;
}

export interface InterviewSession {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  status: SessionStatus;
  startedAt: string;
  completedAt?: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  evaluations: QuestionEvaluation[];
  integritySignals: IntegritySignal[];
}

@Injectable({ providedIn: 'root' })
export class AiInterviewService {
  private readonly storageKey = 'aiInterviewSession';
  private readonly defaultSkills = ['JavaScript', 'TypeScript', 'Angular', 'SQL'];

  createSession(candidateId: string, candidateName: string, resumeSkills: string[]): InterviewSession {
    const session: InterviewSession = {
      sessionId: `SES-${Date.now()}`,
      candidateId,
      candidateName,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      questions: [],
      answers: [],
      evaluations: [],
      integritySignals: []
    };

    const normalizedSkills = resumeSkills.length ? resumeSkills : this.defaultSkills;
    session.questions = this.generateQuestions(session, normalizedSkills);
    this.persist(session);
    return session;
  }

  getSession(): InterviewSession | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as InterviewSession : null;
  }

  submitAnswer(questionId: string, answerText: string, inputType: 'TEXT' | 'VOICE' | 'CODE', codeSnippet = ''): InterviewSession | null {
    const session = this.getSession();
    if (!session) return null;

    const answer: InterviewAnswer = {
      questionId,
      sessionId: session.sessionId,
      candidateId: session.candidateId,
      answerText,
      inputType,
      codeSnippet,
      answeredAt: new Date().toISOString()
    };

    session.answers.push(answer);
    session.evaluations.push(this.evaluateAnswer(questionId, answerText));

    if (answerText.length < 10) {
      session.integritySignals.push({
        eventType: 'INACTIVITY',
        severity: 'LOW',
        note: 'Minimal response captured. Candidate may have skipped details.',
        detectedAt: new Date().toISOString()
      });
    }

    this.persist(session);
    return session;
  }

  autoSkipQuestion(questionId: string): InterviewSession | null {
    return this.submitAnswer(questionId, 'No response received. AI greeted and moved to next question.', 'TEXT');
  }

  addIntegritySignal(signal: IntegritySignal): InterviewSession | null {
    const session = this.getSession();
    if (!session) return null;
    session.integritySignals.push(signal);
    this.persist(session);
    return session;
  }

  completeSession(): InterviewSession | null {
    const session = this.getSession();
    if (!session) return null;
    session.status = 'COMPLETED';
    session.completedAt = new Date().toISOString();
    this.persist(session);
    return session;
  }

  closeSessionWithoutJoin(): InterviewSession | null {
    const session = this.getSession();
    if (!session) return null;
    session.status = 'CLOSED';
    session.completedAt = new Date().toISOString();
    this.persist(session);
    return session;
  }

  buildReport(session: InterviewSession) {
    const scores = session.evaluations.map((evalResult) =>
      (evalResult.technicalAccuracy + evalResult.depth + evalResult.problemSolving + evalResult.communication) / 4
    );
    const overallScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const integrityScore = Math.max(0, 100 - (session.integritySignals.length * 10));

    return {
      overallScore,
      integrityScore,
      detailedFeedback: session.evaluations,
      weaknesses: this.findWeakAreas(session.evaluations),
      todoList: this.createTodoList(session.evaluations)
    };
  }

  private generateQuestions(session: InterviewSession, skills: string[]): InterviewQuestion[] {
    return skills.slice(0, 5).map((skill, index) => {
      const questionType: QuestionType = index % 3 === 0 ? 'CONCEPTUAL' : index % 3 === 1 ? 'SCENARIO' : 'CODING';
      const difficulty = index < 2 ? 'EASY' : index < 4 ? 'MEDIUM' : 'HARD';
      return {
        id: `Q-${session.sessionId}-${index + 1}`,
        sessionId: session.sessionId,
        candidateId: session.candidateId,
        candidateName: session.candidateName,
        questionText: this.getTechnicalQuestion(skill, questionType, difficulty),
        questionType,
        difficulty,
        createdAt: new Date().toISOString()
      };
    });
  }

  private getTechnicalQuestion(skill: string, type: QuestionType, difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    if (type === 'CONCEPTUAL') {
      return `(${difficulty}) Explain core ${skill} concepts and how you have applied them in your projects.`;
    }
    if (type === 'SCENARIO') {
      return `(${difficulty}) A production issue appears in a ${skill} module. Walk through your debugging and resolution strategy.`;
    }
    return `(${difficulty}) Write ${skill} code for a realistic interview task and explain edge case handling and optimization.`;
  }

  private evaluateAnswer(questionId: string, answerText: string): QuestionEvaluation {
    const strengthFactor = Math.min(10, Math.max(4, Math.round(answerText.length / 35)));
    return {
      questionId,
      technicalAccuracy: strengthFactor,
      depth: Math.max(4, strengthFactor - 1),
      problemSolving: strengthFactor,
      communication: Math.max(4, strengthFactor - 2),
      feedback: 'Good attempt. Improve structure and include concrete examples for stronger technical clarity.',
      improvementSuggestions: [
        'Use step-by-step reasoning before final answer.',
        'Mention trade-offs and edge cases explicitly.',
        'Summarize final solution in concise bullet points.'
      ]
    };
  }

  private findWeakAreas(evaluations: QuestionEvaluation[]): string[] {
    if (!evaluations.length) return ['No answers captured'];
    const weaknesses = new Set<string>();
    evaluations.forEach((item) => {
      if (item.technicalAccuracy < 7) weaknesses.add('Technical accuracy');
      if (item.depth < 7) weaknesses.add('Depth of explanation');
      if (item.problemSolving < 7) weaknesses.add('Problem solving');
      if (item.communication < 7) weaknesses.add('Communication clarity');
    });
    return Array.from(weaknesses);
  }

  private createTodoList(evaluations: QuestionEvaluation[]): string[] {
    if (!evaluations.length) return ['Practice mock interviews and submit at least one detailed answer daily'];
    return [
      'Revise resume skills and prepare one conceptual + one scenario answer per skill.',
      'Practice coding with edge cases and explain complexity verbally.',
      'Record a 2-minute explanation for each answer to improve communication.',
      'Take another AI mock interview after completing the above tasks.'
    ];
  }

  private persist(session: InterviewSession) {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }
}
