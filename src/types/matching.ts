export interface Candidate {
  skill_match: string;
  experience_relevance: string;
  education_background: string;
  cultural_fit: string;
  improvement_areas: string;
}

export interface ResumeAnalysis {
  candidate_name: string;
  percentage_match: string;
  detailed_description: Candidate;
  AI_Response_Counter: number;
}

export interface MatchingResponse {
  best_resume: ResumeAnalysis;
}
