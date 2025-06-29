import { UserProfileDTO } from '../dto/user-profile.dto';
import { ScholarshipDTO } from '../dto/scholarship.dto';

export function calculateMatch(profile: UserProfileDTO, scholarship: ScholarshipDTO): { score: number, reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (scholarship.academic_fields.some(field => profile.fields_of_interest.includes(field))) {
    score += 1;
    reasons.push("Matches academic interest");
  }

  if (scholarship.allowed_nationalities.includes(profile.nationality)) {
    score += 1;
    reasons.push("Nationality allowed");
  }

  if (profile.available_to_travel && scholarship.modality === "presential") {
    score += 1;
    reasons.push("Available for presential modality");
  }

  if (profile.languages.some(userLang => 
    scholarship.required_languages.some(reqLang =>
      userLang.language === reqLang.language && userLang.level >= reqLang.level
    )
  )) {
    score += 1;
    reasons.push("Meets language requirement");
  }

  if (scholarship.destination_country && profile.preferred_destinations.includes(scholarship.destination_country)) {
    score += 1;
    reasons.push("Preferred destination country");
  }

  if (scholarship.modality && profile.preferred_modalities.includes(scholarship.modality)) {
    score += 1;
    reasons.push("Preferred study modality");
  }

  return { score, reasons };
}
