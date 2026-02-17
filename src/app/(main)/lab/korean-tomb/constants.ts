/** Dead Korean letters (사양된 한글 자모) — 42자 */
export const DEAD_LETTERS = [
  // 훈민정음 28자 중 소멸 4자
  "ㆁ", "ㅿ", "ㆆ", "ㆍ",
  // 순경음 4자
  "ㅸ", "ㆄ", "ㅱ", "ㅹ",
  // 각자병서 3자
  "ㅥ", "ㆅ", "ㆀ",
  // ㅂ계 합용병서 4자
  "ㅲ", "ㅳ", "ㅶ", "ㅷ",
  // ㅄ계 합용병서 2자
  "ㅴ", "ㅵ",
  // ㅅ계 합용병서 5자
  "ㅺ", "ㅻ", "ㅼ", "ㅽ", "ㅾ",
  // 사라진 종성 겹받침 13자
  "ㅦ", "ㅧ", "ㅨ",
  "ㅩ", "ㅪ", "ㅫ", "ㅬ", "ㅭ",
  "ㅮ", "ㅯ", "ㅰ",
  "ㆂ", "ㆃ",
  // 소멸 복합 모음 7자
  "ㆎ", "ㆇ", "ㆈ", "ㆉ", "ㆊ", "ㆋ", "ㆌ",
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

/** Character name map (유니코드 표준 검증) */
export const CHAR_NAMES: Record<string, string> = {
  // 훈민정음 28자 중 소멸 4자
  ㆁ: "옛이응",
  ㅿ: "반시옷",
  ㆆ: "여린히읗",
  ㆍ: "아래아",
  // 순경음
  ㅸ: "순경음 비읍",
  ㆄ: "순경음 피읖",
  ㅱ: "순경음 미음",
  ㅹ: "순경음 쌍비읍",
  // 각자병서
  ㅥ: "쌍니은",
  ㆅ: "쌍히읗",
  ㆀ: "쌍이응",
  // ㅂ계 합용병서
  ㅲ: "비읍기역",
  ㅳ: "비읍디귿",
  ㅶ: "비읍지읒",
  ㅷ: "비읍티읕",
  // ㅄ계 합용병서
  ㅴ: "비읍시옷기역",
  ㅵ: "비읍시옷디귿",
  // ㅅ계 합용병서
  ㅺ: "시옷기역",
  ㅻ: "시옷니은",
  ㅼ: "시옷디귿",
  ㅽ: "시옷비읍",
  ㅾ: "시옷지읒",
  // 사라진 종성 겹받침 — ㄴ계
  ㅦ: "니은디귿",
  ㅧ: "니은시옷",
  ㅨ: "니은반시옷",
  // ㄹ계
  ㅩ: "리을기역시옷",
  ㅪ: "리을디귿",
  ㅫ: "리을비읍시옷",
  ㅬ: "리을반시옷",
  ㅭ: "리을여린히읗",
  // ㅁ계
  ㅮ: "미음비읍",
  ㅯ: "미음시옷",
  ㅰ: "미음반시옷",
  // ㆁ계
  ㆂ: "옛이응시옷",
  ㆃ: "옛이응반시옷",
  // 소멸 복합 모음
  ㆎ: "아래아이",
  ㆇ: "요야",
  ㆈ: "요얘",
  ㆉ: "요이",
  ㆊ: "유여",
  ㆋ: "유예",
  ㆌ: "유이",
};

/** Physics configuration */
export const PHYSICS = {
  gravity: 1.5,
  restitution: 0.05,
  friction: 0.9,
  frictionStatic: 2.0,
  wallThickness: 60,
};
