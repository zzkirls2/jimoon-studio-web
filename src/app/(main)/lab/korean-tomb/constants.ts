/** Dead Korean letters (사양된 한글 자모) */
export const DEAD_LETTERS = [
  "ㆁ", "ㅿ", "ㆆ", "ㅸ", "ㆄ", "ㅹ", "ㆅ", "ㆀ",
  "ㅵ", "ㅶ", "ㅷ", "ㆍ", "ㆎ", "ᄝ", "ᅀ", "ᅙ",
  "ᆞ", "ㆉ", "ㆊ", "ㆋ", "ㆌ",
];

/** Earthy text colors */
export const TEXT_COLORS = [
  "#6B5B4A",
  "#8B7355",
  "#7A6B5D",
  "#5C4E40",
  "#9C8B75",
  "#A0917D",
];

function cols(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * Tomb with cross: dome mound (봉분) + thin cross on top (십자가).
 * Rows from bottom (0) to top.
 */
function buildTombCross(): number[][] {
  const rows: number[][] = [];
  // Mound (봉분) — 10 rows, rounder dome
  rows.push(cols(0, 14));  // row 0 - base
  rows.push(cols(0, 14));  // row 1
  rows.push(cols(0, 14));  // row 2
  rows.push(cols(0, 14));  // row 3
  rows.push(cols(1, 13));  // row 4
  rows.push(cols(1, 13));  // row 5
  rows.push(cols(2, 12));  // row 6
  rows.push(cols(2, 12));  // row 7
  rows.push(cols(3, 11));  // row 8
  rows.push(cols(5, 9));   // row 9 - mound top
  // Cross lower shaft (기둥) — 6 rows
  for (let i = 0; i < 6; i++) rows.push(cols(6, 8));
  // Cross arms — 2 rows
  rows.push(cols(2, 12));  // row 16
  rows.push(cols(2, 12));  // row 17
  // Cross upper shaft (짧은 상단) — 3 rows
  for (let i = 0; i < 3; i++) rows.push(cols(6, 8));
  return rows;
}

export const RUIN_ROWS = buildTombCross();
export const STRUCTURE_COLS = 15;

/** Character name map */
export const CHAR_NAMES: Record<string, string> = {
  ㆁ: "옛이응",
  ㅿ: "반시옷",
  ㆆ: "여린히읗",
  ㅸ: "순경음 비읍",
  ㆄ: "순경음 피읖",
  ㅹ: "순경음 비읍시옷",
  ㆅ: "된히읗",
  ㆀ: "쌍이응",
  ㅵ: "니은히읗",
  ㅶ: "디귿리을",
  ㅷ: "리을비읍시옷",
  ㆍ: "아래아",
  ㆎ: "아래아이",
  ᄝ: "순경음 미음",
  ᅀ: "반시옷",
  ᅙ: "여린히읗",
  ᆞ: "아래아",
  ㆉ: "유 아래아",
  ㆊ: "유 아래아이",
  ㆋ: "유유",
  ㆌ: "아래아 유",
};

/** Physics configuration */
export const PHYSICS = {
  gravity: 1.5,
  restitution: 0.05,
  friction: 0.9,
  frictionStatic: 2.0,
  wallThickness: 60,
};
