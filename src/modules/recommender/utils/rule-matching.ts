import { UserProfileDTO } from '../dto/user-profile.dto';
import { ScholarshipDTO } from '../dto/scholarship.dto';

export function calculateRulesScore(profile: UserProfileDTO, scholarship: ScholarshipDTO): number {
  let score = 0;
  const total = 5;

  if (scholarship.allowed_nationalities.includes(profile.nationality)) score++;
  if (scholarship.academic_fields.some(area => profile.fields_of_interest.includes(area))) score++;
  if (profile.preferred_destinations.includes(scholarship.destination_country)) score++;
  if (profile.preferred_modalities.includes(scholarship.modality)) score++;
  if (profile.languages.some(l =>
    scholarship.required_languages.some(r => r.language === l.language && l.level >= r.level))) score++;

  return score / total;
}
