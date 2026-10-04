// Placeholder marketing helpers for Efasa

export function draftAdCopy({ headline, tone = 'calm' }) {
  const mood = tone === 'energetic' ? 'with urgency and optimism' : 'with calm confidence';
  return `Listing: ${headline}\n\nPitch (${tone}): Discover a standout opportunity ${mood}. Book a viewing today.`;
}
