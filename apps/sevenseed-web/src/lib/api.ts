// Sevenseed Platform API Client for FastAPI Endpoints

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VerifyKeyPayload {
  provider: string;
  api_key: string;
}

export interface VerifyEmailPayload {
  email: string;
}

export interface OutreachSequencePayload {
  product_name: string;
  target_audience: string;
}

export interface BaPrdPayload {
  product_name: string;
  concept_description: string;
  target_users?: string;
}

export interface HiringQuestionsPayload {
  role: string;
  experience_level?: string;
}

export interface EvaluateAnswerPayload {
  question: string;
  candidate_answer: string;
}

export interface MeetingSummaryPayload {
  meeting_title: string;
  transcript_text: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'API Request Failed' }));
    throw new Error(errorData.detail || `HTTP Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // BYOK Key Vault
  verifyApiKey: (payload: VerifyKeyPayload) =>
    fetchApi<{ provider: string; valid: boolean; status: string }>('/api/keys/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getKeysStatus: () =>
    fetchApi<{ mode: string; configured_keys: string[] }>('/api/keys/status'),

  // Growth Outreach Engine
  verifyEmail: (payload: VerifyEmailPayload) =>
    fetchApi<{
      email: string;
      domain: string;
      mx_record_found: boolean;
      is_disposable: boolean;
      deliverability_score: number;
      status: string;
      recommendation: string;
    }>('/api/outreach/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateOutreachSequence: (payload: OutreachSequencePayload) =>
    fetchApi<{
      product_name: string;
      target_audience: string;
      sequence: Array<{ step: number; channel: string; timing: string; subject?: string; body?: string; message?: string }>;
    }>('/api/outreach/sequence', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Business Analyst PRD Suite
  generatePrd: (payload: BaPrdPayload) =>
    fetchApi<{
      prd_title: string;
      executive_summary: string;
      functional_requirements: Array<{ id: string; feature: string; priority: string; description: string }>;
      system_architecture_recommendation: { frontend: string; backend: string; database: string };
    }>('/api/ba/prd', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Hiring Candidate Screener
  generateHiringQuestions: (payload: HiringQuestionsPayload) =>
    fetchApi<{
      role: string;
      experience_level: string;
      question_set: Array<{ id: number; category: string; question: string }>;
    }>('/api/hiring/questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  evaluateCandidateAnswer: (payload: EvaluateAnswerPayload) =>
    fetchApi<{
      score: number;
      grade: string;
      feedback: string;
      follow_up_prompt: string;
    }>('/api/hiring/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Meeting Notetaker
  summarizeMeeting: (payload: MeetingSummaryPayload) =>
    fetchApi<{
      meeting_title: string;
      executive_summary: string;
      key_decisions: string[];
      action_items: Array<{ task: string; owner: string; deadline: string }>;
    }>('/api/meeting/summarize', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
