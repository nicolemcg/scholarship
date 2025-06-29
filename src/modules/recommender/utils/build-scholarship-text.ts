import { ScholarshipDTO } from '../dto/scholarship.dto';

export function buildScholarshipText(s: ScholarshipDTO): string {
  return `
    Scholarship title: ${s.title || 'N/A'}.
    This is a ${s.scholarship_type || 'N/A'} scholarship for students with at least a ${s.required_education_level || 'N/A'} level of education.
    It is focused on the following academic fields: ${(s.academic_fields || []).join(', ')}.
    The destination country is ${s.destination_country || 'N/A'}, and the modality is ${s.modality || 'N/A'}.
    It lasts for ${s.duration || 'unknown'} months.
    Required languages: ${(s.required_languages || []).map(l => `${l.language} ${l.level}`).join(', ')}.
    It offers benefits like ${(s.benefits || []).join(', ')}.
    It is available to citizens of: ${(s.allowed_nationalities || []).join(', ')}.
    Application deadline: ${s.deadline || 'N/A'}.
    Additional requirements: ${(s.additional_requirements || []).join(', ')}.
  `;
}
