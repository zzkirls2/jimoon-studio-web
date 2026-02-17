"use client";

import PhysicsScene from "./PhysicsScene";

interface Entry {
  char: string;
  name: string;
  period: string;
  body: string;
}

const ENTRIES: Entry[] = [
  // ── 1460~1480년: 한자음 전용 글자 소멸 ──
  {
    char: "ㆆ",
    name: "여린히읗",
    period: "1460년대 소멸",
    body: "성문파열음 [ʔ]. 훈민정음 28자 중 하나였지만, 고유어에서는 독립 음소가 아니었다. 한자음 표기 용도로만 쓰이다가 세조 이후 사라졌다.",
  },
  {
    char: "ㅹ · ㅱ",
    name: "한자음 전용 순경음",
    period: "~1480년 소멸",
    body: "ㅹ(순경음 쌍비읍)과 ㅱ(순경음 미음). 중국 한자음의 [f]와 微모를 표기하기 위해 동국정운(1448)에서만 사용되었다. 고유어에는 대응 음소가 없어, 동국정운식 표기 체계 폐기와 함께 소멸.",
  },
  // ── 15세기: 순경음 [β]→[w] 변화 ──
  {
    char: "ㅸ · ㆄ",
    name: "고유어 순경음",
    period: "15세기 중반 소멸",
    body: "ㅸ(순경음 비읍)과 ㆄ(순경음 피읖). ㅂ·ㅍ 아래 ㅇ을 붙여 양순마찰음 [β]를 표기했다. [β]→[w]로 약화되어 모음에 흡수. ㅂ불규칙 활용(덥다→더워)이 그 흔적.",
  },
  // ── 15세기: 된소리 대립 소멸 ──
  {
    char: "ㅥ · ㆅ · ㆀ",
    name: "사라진 각자병서",
    period: "15세기 소멸",
    body: "ㅥ(ㄴㄴ)·ㆅ(ㅎㅎ)·ㆀ(ㆁㆁ). 같은 글자를 겹쳐 된소리를 표기했다. 현대에 살아남은 ㄲ·ㄸ·ㅃ·ㅆ·ㅉ과 달리, 이 셋은 음소 대립 자체가 사라지며 소멸.",
  },
  // ── 16세기 말 ──
  {
    char: "ㅿ",
    name: "반시옷",
    period: "16세기 말 소멸",
    body: "유성 치경마찰음 [z]. 모음 사이에서만 나타났고, 점차 약화되어 탈락하거나 ㅈ에 합류했다. ㅅ불규칙 동사(짓다→지어)가 그 흔적.",
  },
  // ── 15~17세기: 종성 자음군 단순화 ──
  {
    char: "ㅦㅧㅨ ㅮㅯㅰ ㆂㆃ",
    name: "사라진 종성 겹받침",
    period: "15~17세기 소멸",
    body: "ㄴ계: ㅦ(ㄴㄷ)·ㅧ(ㄴㅅ)·ㅨ(ㄴㅿ). ㅁ계: ㅮ(ㅁㅂ)·ㅯ(ㅁㅅ)·ㅰ(ㅁㅿ). ㆁ계: ㆂ(ㆁㅅ)·ㆃ(ㆁㅿ). 중세 국어의 복잡한 종성 자음군이 단순화되면서 소멸. ㅿ·ㆁ을 포함한 것들은 해당 글자의 소멸과 연동.",
  },
  {
    char: "ㅩㅪㅫㅬㅭ",
    name: "사라진 종성 겹받침 — ㄹ계",
    period: "15~17세기 소멸",
    body: "ㅩ(ㄹㄱㅅ)·ㅪ(ㄹㄷ)·ㅫ(ㄹㅂㅅ)·ㅬ(ㄹㅿ)·ㅭ(ㄹㆆ). 현대에 살아남은 ㄹ계 겹받침(ㄺ·ㄻ·ㄼ 등)과 달리, 이 다섯은 자음군 단순화와 ㅿ·ㆆ 소멸로 사라졌다.",
  },
  // ── 17세기 초: 어두 자음군 소멸 ──
  {
    char: "ㅲㅳㅶㅷ ㅴㅵ",
    name: "ㅂ계 · ㅄ계 합용병서",
    period: "17세기 초 소멸",
    body: "ㅂ계: ㅲ(ㅂㄱ)·ㅳ(ㅂㄷ)·ㅶ(ㅂㅈ)·ㅷ(ㅂㅌ). ㅄ계: ㅴ(ㅂㅅㄱ)·ㅵ(ㅂㅅㄷ). 어두에서 둘 이상의 자음이 연속되는 자음군을 표기했다. 서울말 기준 17세기 초에는 이미 소멸. 된소리 또는 유기음으로 합류.",
  },
  {
    char: "ㅺㅻㅼㅽㅾ",
    name: "ㅅ계 합용병서",
    period: "17세기 초 소멸",
    body: "ㅺ(ㅅㄱ)·ㅻ(ㅅㄴ)·ㅼ(ㅅㄷ)·ㅽ(ㅅㅂ)·ㅾ(ㅅㅈ). 어두 된소리를 표기하는 데 사용되었다. 1933년 한글맞춤법통일안에서 각자병서(ㄲㄸㅃㅆㅉ)로 된소리 표기가 통일되며 완전 폐지.",
  },
  // ── 17세기: 음소 합류 ──
  {
    char: "ㆁ",
    name: "옛이응",
    period: "17세기 소멸",
    body: "연구개 비음 [ŋ]. 영어 sing의 ng 소리. 초성에서 [ŋ]은 실현되지 않아 ㅇ과 구별이 무의미해졌고, ㅇ이 초성(무음)과 종성([ŋ]) 이중 역할을 흡수했다.",
  },
  // ── 16~18세기: 아래아와 함께 소멸한 모음 ──
  {
    char: "ㆍ",
    name: "아래아",
    period: "16~18세기 소멸",
    body: "후설 모음 [ʌ]. 훈민정음에서 '하늘(天)'을 상징한 기본 모음. 비어두 음절에서 ㅡ로, 어두 음절에서 ㅏ로 합류하며 소멸. 오직 제주 방언에만 잔존.",
  },
  {
    char: "ㆎ · ㆉ · ㆌ",
    name: "아래아 복합 모음",
    period: "18세기경 소멸",
    body: "ㆎ(ㆍ+ㅣ → 현대 ㅐ에 합류)·ㆉ(ㅛ+ㅣ)·ㆌ(ㅠ+ㅣ). 아래아(ㆍ)가 소멸하면서 이를 포함한 복합 모음 체계도 함께 사라졌다.",
  },
  // ── 해례본 이론적 글자 ──
  {
    char: "ㆇ · ㆈ · ㆊ · ㆋ",
    name: "해례본 이론적 모음",
    period: "실용 기록 없음",
    body: "ㆇ(ㅛ+ㅑ)·ㆈ(ㆇ+ㅣ)·ㆊ(ㅠ+ㅕ)·ㆋ(ㆊ+ㅣ). 훈민정음 해례본 중성해에서 '같은 부류의 모음끼리 합할 수 있다'는 원리를 증명하기 위해 기재되었으나, 실제 문헌이나 발화에서 쓰인 적이 없는 이론적 글자.",
  },
];

export default function KoreanRuinsPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `main, footer { user-select: none; -webkit-user-select: none; }
             main ::selection, footer ::selection { background: transparent; color: inherit; }`,
        }}
      />
      <div
        className="pt-14 flex"
        style={{ height: "calc(100dvh - 8rem)" }}
      >
        {/* Scene */}
        <div className="flex-1 min-w-0">
          <PhysicsScene />
        </div>

        {/* Explanation panel */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 overflow-y-auto px-5 py-6 gap-6 shrink-0 text-justify">
          <h2 className="text-sm font-semibold text-neutral-800 tracking-wide">
            옛 한글 무덤
          </h2>
          <p className="text-[11px] text-neutral-800 leading-relaxed">
            옛 한글들이 죽었다.
            소리가 변하고, 구별이 무의미해지고, 쓰임이 없어지면서.
            이 곳은 죽은 글자들의 무덤이다.
          </p>

          {ENTRIES.map((e) => (
            <div key={e.char} className="flex flex-col gap-1">
              <span className="text-lg font-bold text-neutral-800">
                {e.char}
              </span>
              <span className="text-xs font-medium text-neutral-600">
                {e.name}
              </span>
              <span className="text-[10px] text-neutral-400">{e.period}</span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {e.body}
              </p>
            </div>
          ))}

          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-800 tracking-wide">
              죽은 글자들의 무덤 앞에서
            </h3>
            <p className="text-[11px] text-neutral-800 leading-relaxed">
              그렇게 옛 글자들은 사라졌다.
              소리가 조금씩 변하고,
              점차 아무도 그 소리를 발음하지 않게 되었을 때,
              글자는 조용히 그 쓸모를 잃었다.
            </p>
            <p className="text-[11px] text-neutral-800 leading-relaxed">
              이것은 모든 언어에서 일어나는 일이다. 한글도 예외는 아니다.
              실질적인 아쉬움이 있다면 외래어 표기의 빈자리이다.
              ㅸ이 살아 있었다면 video의 [v]를,
              ㅹ이 살아 있었다면 coffee의 [f]를,
              ㅿ가 살아 있었다면 zero의 [z]를
              지금보다 정확히 적을 수 있었을 것이다.
            </p>
            <p className="text-[11px] text-neutral-800 leading-relaxed">
              죽은 글자들의 무덤 앞에서 우리는 무엇을 할 수 있을까.
              딱히 없다.
              아이우에오 입을 풀고,
              한때 살아있었던 글자들의 음운을 가능한 한 발음해보는 것?
            </p>
            <p className="text-[11px] text-neutral-800 leading-relaxed">
              우우-하고 입을 풀고 있을 때, 봉분 앞에 휘이- 한 가락 바람이 스쳤다.
              <br />
              글자로 된 유령들이 우우- 우는 소리를 내고 있다.
            </p>
          </div>

          <div className="text-[10px] text-neutral-300 leading-relaxed mt-2 flex flex-col gap-0.5">
            <span>참고:</span>
            <a href="https://encykorea.aks.ac.kr/Article/E0074518" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 훈민정음 28자모</a>
            <a href="https://encykorea.aks.ac.kr/Article/E0031868" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 순경음</a>
            <a href="https://encykorea.aks.ac.kr/Article/E0016294" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 동국정운</a>
            <a href="https://encykorea.aks.ac.kr/Article/E0023106" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 병서</a>
            <a href="https://encykorea.aks.ac.kr/Article/E0035910" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 어두자음군</a>
            <a href="https://encykorea.aks.ac.kr/Article/E0078694" target="_blank" rel="noopener" className="hover:text-neutral-400">한국민족문화대백과 — 중성해</a>
            <a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE00521732" target="_blank" rel="noopener" className="hover:text-neutral-400">최윤갑, 「모음자 ㆉ·ㆌ·ㆇ·ㆊ·ㆋ와 그 음가에 대하여」(중국조선어문, 1992)</a>
            <span>이기문, 「국어사개설」(태학사, 1998)</span>
            <span>Lee &amp; Ramsey, <em>A History of the Korean Language</em> (Cambridge, 2011)</span>
          </div>
        </aside>
      </div>
    </>
  );
}
