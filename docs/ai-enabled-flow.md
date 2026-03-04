# AI Enabled Interview Flow (Steps 4 to 9)

## Step 4: Schedule Interview + Calendar Event
1. User selects date/time and enters profile + resume skills.
2. Backend stores schedule in `interview_schedule`.
3. Backend creates `calendar_events` record with provider metadata.
4. UI shows "Add event to Google Calendar" action.

## Step 5: Click "Take AI Interview"
1. User starts interview session.
2. Backend creates `session_id` with `IN_PROGRESS` in `interview_sessions`.
3. Session is linked to `candidate_id` and `candidate_name`.
4. On completion, backend sets status to `COMPLETED`.
5. If candidate never joins after reminder window, status set to `CLOSED`.

## Step 6: AI Generates Personalized Technical Questions
1. Resume skills are sent to LLM.
2. LLM generates technical-only questions based on resume and prior answers.
3. If no response in 30-45 seconds, AI greets and auto-moves to next question.
4. Question types include conceptual, scenario, coding.
5. Difficulty adjusts with candidate experience and prior response quality.
6. Questions persist in `interview_questions` table.

## Step 7: User Answers (Text / Voice / Coding)
1. Candidate answers in text/voice/coding editor.
2. Voice input is converted to text (STT transcript).
3. Coding answers are stored as code blobs.
4. All answers map to `session_id` and `candidate_id` in `interview_answers`.

## Step 8: AI Evaluates, Scores & Integrity
1. Each answer is evaluated by LLM.
2. Coding reviewed for correctness, edge cases, logic, optimization.
3. Scores saved for technical accuracy, depth, problem solving, communication.
4. Proctoring signals (tab switches, inactivity, suspicious patterns) stored in `integrity_flags`.
5. AI feedback + improvement suggestions written to `answer_evaluations`.
6. Session summary saved in `interview_reports`.

## Step 9: Dashboard Shows Complete Report
1. Dashboard reads report by session.
2. Displays overall and integrity percentage.
3. Shows question-wise answer/code + feedback.
4. Highlights weak areas.
5. Displays cheating/integrity flags.
6. Creates candidate action items in `candidate_todo_items` for future improvement.
