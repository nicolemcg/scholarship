export interface Language {
  language: string;
  level: string; // e.g., A2, B1, B2, C1
}

export class UserProfileDTO {
  id: string;
  current_education_level: string;
  fields_of_interest: string[];
  languages: Language[];
  country_of_residence: string;
  nationality: string;
  academic_average: number;
  work_experience: any;
  available_to_travel: boolean;
  preferred_modalities: string[];
  preferred_destinations: string[];
  personal_goals: string[];
  economic_situation: string;
  extra_certifications: string[];
}
