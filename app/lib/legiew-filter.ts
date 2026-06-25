export const LEGIEW_EXCLUDE_KEYWORDS = ["法務チャット", "THEMIL"];

export const LEGIEW_EXCLUDE_FAQ_CATEGORIES = ["弁護士チャット"];

export function isLegiewRecordVisible(title: string): boolean {
  return !LEGIEW_EXCLUDE_KEYWORDS.some((kw) => title.includes(kw));
}

export function isLegiewFaqCategoryVisible(category: string): boolean {
  if (LEGIEW_EXCLUDE_FAQ_CATEGORIES.includes(category)) return false;
  if (LEGIEW_EXCLUDE_KEYWORDS.some((kw) => category.includes(kw))) return false;
  return true;
}
