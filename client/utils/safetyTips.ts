// Static, client-side safety & etiquette tips (US-037). Real content would
// eventually come from a curated backend field per neighbourhood, but for
// this UX prototype a short, always-available set of general + type-aware
// tips is enough to demonstrate the feature end-to-end.

export function getSafetyTips(site: { type?: string; city?: string }): string[] {
  const tips: string[] = [];
  const type = (site.type || "").toLowerCase();

  if (type.includes("temple") || type.includes("stupa") || type.includes("monastery")) {
    tips.push("Remove shoes and leather items before entering shrine areas.");
    tips.push("Dress modestly — cover shoulders and knees out of respect.");
    tips.push("Ask before photographing worshippers or rituals.");
  } else if (type.includes("palace") || type.includes("square")) {
    tips.push("Stick to marked paths — some structures are still settling after past earthquakes.");
    tips.push("Keep valuables close in busy courtyard areas.");
  } else {
    tips.push("Dress modestly when visiting religious or residential areas nearby.");
    tips.push("Keep an eye on belongings in crowded spots.");
  }

  tips.push(
    `Evenings in ${site.city || "this area"} are generally safe but stick to well-lit main streets after dark.`,
  );

  return tips.slice(0, 3);
}
