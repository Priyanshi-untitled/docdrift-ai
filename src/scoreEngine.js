'use strict';

/**
 * Computes overall project trust score and summary stats.
 *
 * Weighting:
 *   - Doc files    carry 2× weight (most critical for trust)
 *   - Code files   carry 1× weight
 *   - Config files carry 1.5× weight (secrets are serious)
 */

const WEIGHTS = {
  doc:    2.0,
  code:   1.0,
  config: 1.5
};

function computeSummary(results, filesMeta) {
  if (!results || results.length === 0) {
    return {
      trustScore: 0,
      total:      0,
      lies:       0,
      warnings:   0,
      accurate:   0,
      grade:      'F',
      message:    'No scannable files found.'
    };
  }

  // Weighted average trust score
  let weightedSum = 0;
  let totalWeight = 0;

  results.forEach((r, i) => {
    const meta   = filesMeta[i];
    const weight = WEIGHTS[meta?.category] || 1.0;
    weightedSum += r.trustScore * weight;
    totalWeight += weight;
  });

  const rawScore  = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const trustScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  const lies     = results.filter(r => r.trustScore < 50).length;
  const warnings = results.filter(r => r.trustScore >= 50 && r.trustScore < 75).length;
  const accurate = results.filter(r => r.trustScore >= 75).length;

  const grade = trustScore >= 90 ? 'A'
              : trustScore >= 80 ? 'B'
              : trustScore >= 70 ? 'C'
              : trustScore >= 55 ? 'D'
              : 'F';

  const message = grade === 'A' ? 'Excellent documentation integrity.'
                : grade === 'B' ? 'Good — minor issues detected.'
                : grade === 'C' ? 'Moderate drift detected. Review flagged files.'
                : grade === 'D' ? 'Significant documentation issues. Immediate review needed.'
                : 'Critical integrity failures. Documentation cannot be trusted.';

  return {
    trustScore,
    total:    results.length,
    lies,
    warnings,
    accurate,
    grade,
    message
  };
}

module.exports = { computeSummary };