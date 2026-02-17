"use client";

import PhysicsScene from "./PhysicsScene";

interface Entry {
  char: string;
  name: string;
  period: string;
  body: string;
}

const ENTRIES: Entry[] = [
  // ── 15세기 ──
  {
    char: "ㅸ",
    name: "순경음 비읍",
    period: "15세기 중반 소멸",
    body: "양순마찰음 [β]. ㅂ 아래 ㅇ을 붙여 만든 파생 글자. [β]→[w]로 약화되어 모음에 흡수. ㅂ불규칙 활용(덥다→더워)의 원인.",
  },
  {
    char: "ㆄ",
    name: "순경음 피읖",
    period: "15세기 소멸",
    body: "ㅍ의 순경음. ㅸ과 같은 이유로 소멸. 순경음 계열은 모두 [w] 합류로 사라졌다.",
  },
  {
    char: "ㅹ",
    name: "순경음 비읍시옷",
    period: "~1480년 소멸",
    body: "ㅂㅅ의 순경음. 중국 한자음의 [f] 음을 표기하기 위해 동국정운(1448)·홍무정운역훈(1455)에서만 사용되었다. 고유어에는 [f] 음이 없어, 동국정운식 표기 체계 폐기와 함께 소멸.",
  },
  {
    char: "ᄝ",
    name: "순경음 미음",
    period: "~1480년 소멸",
    body: "ㅁ의 순경음(ㅁ 아래 ㅇ). 동국정운(1448)에서 한자음 微모(미모)를 표기하기 위해 쓰였으나, 고유어 표기에는 사용되지 않았다.",
  },
  {
    char: "ㆅ",
    name: "된히읗",
    period: "15세기 소멸",
    body: "ㅎ의 된소리(경음). 훈민정음에서 각자병서(같은 글자를 겹침)로 만든 글자. 현대 한국어에는 ㅎ의 된소리 구별이 없어 소멸.",
  },
  {
    char: "ㆀ",
    name: "쌍이응",
    period: "15세기 소멸",
    body: "ㆁ(옛이응)의 된소리. 연구개 비음의 경음 대립이 사라지며 함께 소멸했다.",
  },
  // ── 15~16세기 ──
  {
    char: "ㆆ",
    name: "여린히읗",
    period: "1460년대 소멸",
    body: "성문파열음 [ʔ]. 훈민정음 28자 중 하나였으나 고유어에서는 독립 음소가 아니었고, 한자음 표기 용도로만 쓰였다. 세조 이후 문헌에서 자취를 감추었다.",
  },
  // ── 16세기 ──
  {
    char: "ㅵ",
    name: "니은히읗",
    period: "16세기경 소멸",
    body: "ㄴ+ㅎ 합용 병서. 종성에서 쓰였으나 음운 변화로 단순화되며 사라졌다.",
  },
  {
    char: "ㅶ",
    name: "디귿리을",
    period: "16세기경 소멸",
    body: "ㄷ+ㄹ 합용 병서. 복잡한 자음군이 단순화되는 과정에서 소멸.",
  },
  {
    char: "ㅷ",
    name: "리을비읍시옷",
    period: "16세기경 소멸",
    body: "ㄹ+ㅂ+ㅅ 삼중 합용 병서. 종성 자음군 단순화의 일환으로 사라졌다.",
  },
  {
    char: "ㅿ",
    name: "반시옷",
    period: "16세기 말 소멸",
    body: "유성 치경마찰음 [z]. 모음 사이에서만 나타났고, 점차 약화되어 사라지거나 ㅈ에 합류했다. ㅅ불규칙 동사(짓다→지어)가 그 흔적이다.",
  },
  // ── 17세기 ──
  {
    char: "ㆁ",
    name: "옛이응",
    period: "17세기 소멸",
    body: "연구개 비음 [ŋ]. 영어 sing의 ng 소리. 초성에서 [ŋ]은 실제로 나타나지 않아 ㅇ과 구별이 무의미해졌고, ㅇ이 초성(무음)과 종성([ŋ]) 이중 역할을 흡수했다.",
  },
  // ── 16~18세기 ──
  {
    char: "ㆍ",
    name: "아래아",
    period: "16~18세기 소멸",
    body: "후설 모음 [ʌ]. 훈민정음 체계에서 '하늘(天)'을 상징한 기본 모음. 비어두 음절에서 ㅡ로, 어두 음절에서 ㅏ로 합류하며 소멸했다. 오직 제주 방언에만 잔존한다.",
  },
  {
    char: "ㆎ",
    name: "아래아이",
    period: "18세기경 소멸",
    body: "ㆍ+ㅣ 이중모음. 아래아(ㆍ)의 소멸과 함께 사라졌다. 현대어에서는 ㅐ에 합류.",
  },
  {
    char: "ㆉ",
    name: "유 아래아",
    period: "18세기경 소멸",
    body: "ㅠ+ㆍ 이중모음. 아래아가 소멸하면서 함께 사라졌고, 현대어에서는 ㅛ 또는 ㅠ에 합류했다.",
  },
  {
    char: "ㆌ",
    name: "아래아 유",
    period: "18세기경 소멸",
    body: "ㆍ+ㅠ 이중모음. 아래아의 소멸과 함께 사라졌다. 훈민정음 체계에서 천(ㆍ)·지(ㅡ)·인(ㅣ) 조합으로 만든 모음 중 하나.",
  },
  // ── 이론적 글자 (실용 기록 없음) ──
  {
    char: "ㆊ",
    name: "유 아래아이",
    period: "실용 기록 거의 없음",
    body: "ㅠ+ㅕ 복합 모음. 훈민정음 해례본 중성해에서 같은 부류의 모음끼리 합할 수 있음을 보이기 위해 기재되었으나, 실제 문헌 용례가 거의 없는 이론적 글자.",
  },
  {
    char: "ㆋ",
    name: "유유",
    period: "실용 기록 없음",
    body: "ㆊ(ㅠ+ㅕ)에 ㅣ를 더한 삼중 복합 모음. 훈민정음 체계에서 가장 복잡한 모음 조합으로, 해례본의 조합 논리를 완성하기 위해 기재되었으나 실제 발화나 문헌에서 쓰인 적이 없다.",
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
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            옛 한글들이 죽었다.
            소리가 변하고, 구별이 무의미해지고, 쓰임이 없어지면서.
            이 곳은 죽은 글자들의 무덤이다.
          </p>

          {ENTRIES.map((e) => (
            <div key={e.char} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-700">
                  {e.char}
                </span>
                <span className="text-xs font-medium text-neutral-600">
                  {e.name}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">{e.period}</span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {e.body}
              </p>
            </div>
          ))}

          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-neutral-100">
            <h3 className="text-[11px] font-semibold text-neutral-600 tracking-wide">
              죽은 글자들의 무덤 앞에서
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              그렇게 옛 글자들은 사라졌다.
              소리가 조금씩 변하고,
              점차 아무도 그 소리를 발음하지 않게 되었을 때,
              글자는 조용히 그 쓸모를 잃었다.
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              이것은 모든 언어에서 일어나는 일이다. 한글도 예외는 아니다.
              실질적인 아쉬움이 있다면 외래어 표기의 빈자리이다.
              ㅸ이 살아 있었다면 video의 [v]를,
              ㅹ이 살아 있었다면 coffee의 [f]를,
              ㅿ가 살아 있었다면 zero의 [z]를
              지금보다 정확히 적을 수 있었을 것이다.
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              죽은 글자들의 무덤 앞에서 우리는 무엇을 할 수 있을까.
              딱히 없다.
              아이우에오 입을 풀고,
              한때 살아있었던 글자들의 음운을 가능한 한 발음해보는 것?
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              우우-하고 입을 풀고 있을 때, 봉분 앞에 휘이- 한 가락 바람이 스쳤다.
              <br />
              글자로 된 유령들이 우우- 우는 소리를 내고 있다.
            </p>
          </div>

          <p className="text-[10px] text-neutral-300 leading-relaxed mt-2">
            참고: 이기문 「국어음운사연구」(탑출판사, 1972), 이기문 「국어사개설」(태학사, 1998), Lee &amp; Ramsey <em>A History of the Korean Language</em> (Cambridge, 2011), 「훈민정음 해례본」, 「동국정운」(1448), 한국민족문화대백과사전, 「모음자 ㆉ·ㆌ·ㆇ·ㆊ·ㆋ와 그 음가에 대하여」(중국조선어문, 1992)
          </p>
        </aside>
      </div>
    </>
  );
}
