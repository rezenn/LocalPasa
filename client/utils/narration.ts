// Audio narration (US-017) via on-device text-to-speech (expo-speech).
// No audio files or backend needed — the "narration" is synthesized live
// from the site's existing summary/facts text, which also means every
// site gets one automatically instead of needing pre-recorded audio.
//
// Requires: npx expo install expo-speech

// eslint-disable-next-line @typescript-eslint/no-var-requires
let Speech: typeof import("expo-speech") | null = null;
try {
  Speech = require("expo-speech");
} catch {
  Speech = null;
}

export function isNarrationAvailable(): boolean {
  return !!Speech;
}

/**
 * Builds a ~60-90 second narration script (roughly 150-220 words at a
 * natural speaking pace) from data the site already has, so every site
 * gets a narration without needing a dedicated audio field.
 */
export function buildNarrationScript(site: any): string {
  const parts: string[] = [];
  parts.push(`${site.name}.`);
  if (site.summary) parts.push(site.summary);
  if (site.didYouKnow) parts.push(`Did you know? ${site.didYouKnow}`);
  if (site.myth) parts.push(site.myth);

  let script = parts.join(" ");
  // Keep it in the ~60-90 second range (roughly 150-220 words spoken).
  const words = script.split(/\s+/);
  if (words.length > 220) {
    script = words.slice(0, 220).join(" ") + "...";
  }
  return script;
}

export function speakNarration(
  text: string,
  onDone?: () => void,
): boolean {
  if (!Speech) return false;
  Speech.stop();
  Speech.speak(text, {
    rate: 0.95,
    onDone,
    onStopped: onDone,
  });
  return true;
}

export function pauseNarration(): void {
  Speech?.stop();
}
