export interface RequiredLanguage {
  language: string;
  level: string;
}

export class ScholarshipDTO {
  id: string;
  title: string;
  required_education_level: string;
  academic_fields: string[];
  required_languages: RequiredLanguage[];
  destination_country: string;
  modality: string;
  duration: number;
  benefits: string[];
  allowed_nationalities: string[];
  deadline: string;
  additional_requirements: string[];
  scholarship_type: string;
  application_link: string;
  embedding: number[];
}
