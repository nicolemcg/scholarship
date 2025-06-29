import { Injectable } from '@nestjs/common';
import { firestore } from '../../config/firebase'; 
import { cosineSimilarity } from './utils/cosine-similarity';
import { calculateFinalScore } from './utils/final-score';
import { calculateRulesScore } from './utils/rule-matching';
import { buildProfileText } from './utils/build-profile-text';
import { UserProfileDTO } from './dto/user-profile.dto';
import { ScholarshipDTO } from './dto/scholarship.dto';
import { getEmbedding } from './utils/embedding-helper';


@Injectable()
export class RecommenderService {
  async recommendScholarships(userId: string): Promise<any[]> {
    const profile = await this.getUserProfile(userId);
    const profileText = buildProfileText(profile);
    const profileEmbedding = await getEmbedding(profileText);
    const scholarships = await this.getScholarships();

    const results = scholarships.map((scholarship) => {
      const similarity = cosineSimilarity(profileEmbedding, scholarship.embedding);
      const rulesScore = calculateRulesScore(profile, scholarship);
      const urgencyScore = this.calculateUrgency(scholarship.deadline);
      const impactScore = this.scoreImpact(scholarship);

      const finalScore = calculateFinalScore({ semanticSimilarity: similarity, rulesScore, urgencyScore, impactScore });

      return {
        ...scholarship,
        similarity,
        rulesScore,
        urgencyScore,
        impactScore,
        finalScore
      };
    });

    return results.sort((a, b) => b.finalScore - a.finalScore).slice(0, 10);
  }

  private async getUserProfile(userId: string) {
    const doc = await firestore.collection('users').doc(userId).get();
    return doc.data() as UserProfileDTO;
  }

  private async getScholarships() {
    const snapshot = await firestore.collection('scholarships').get();
    return snapshot.docs.map(doc => doc.data() as ScholarshipDTO);
  }

  private calculateUrgency(deadline: string): number {
    const daysRemaining = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const maxDays = 180;
    return 1 - Math.min(daysRemaining / maxDays, 1);
  }

  private scoreImpact(scholarship: ScholarshipDTO): number {
    switch (scholarship.scholarship_type) {
      case 'full': return 1;
      case 'partial': return 0.5;
      case 'tuition': return 0.2;
      default: return 0.3;
    }
  }
}