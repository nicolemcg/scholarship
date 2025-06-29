export function calculateFinalScore(params: {
  semanticSimilarity: number;
  rulesScore: number;
  urgencyScore: number;
  impactScore: number;
}): number {
  const α = 0.5, β = 0.25, γ = 0.15, δ = 0.1;
  const { semanticSimilarity, rulesScore, urgencyScore, impactScore } = params;

  return (
    (semanticSimilarity * α) +
    (rulesScore * β) +
    (urgencyScore * γ) +
    (impactScore * δ)
  );
}
