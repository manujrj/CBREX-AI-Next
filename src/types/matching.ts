export interface Candidate {
  name: string;
  positive: number;
  negative: number;
}

export interface ResumeAnalysis {
  success: boolean;
  summary: string;
  detailed_responses: string;
}

export interface MatchingResponse {
  best_resume: ResumeAnalysis;
}
