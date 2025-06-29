import { UserProfileDTO } from '../dto/user-profile.dto';

export function buildProfileText(profile: UserProfileDTO): string {
  return `
    I am a ${profile.nationality} student living in ${profile.country_of_residence}.
    I studied ${profile.fields_of_interest.join(", ")} and I speak ${profile.languages.map(l => l.language + " " + l.level).join(", ")}.
    I’m looking for ${profile.preferred_modalities.join(", ")} scholarships in ${profile.preferred_destinations.join(", ")}.
    My goals are: ${profile.personal_goals.join(", ")}.
  `;
}
