// 般若心経データ

export const HANNYASHINGYO_TEXT = `
観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舍利子色不異空空不異色色即是空空即是色受想行識亦復如是舍利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神呪是大明呪是無上呪是無等等呪能除一切苦真実不虚故説般若波羅蜜多呪即説呪曰羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経
`.trim();

/**
 * 般若心経から漢字のみを抽出する
 */
export function extractKanjiFromHannyashingyo(): string[] {
  // 漢字のパターン（ひらがな・カタカナ・数字・記号を除外）
  const kanjiRegex = /[\u4e00-\u9faf]/g;

  const kanjiMatches = HANNYASHINGYO_TEXT.match(kanjiRegex) || [];

  // 重複も保持して出現順通りに返す
  return kanjiMatches;
}

/**
 * 般若心経から重複を除去した漢字を抽出する（統計用）
 */
export function extractUniqueKanjiFromHannyashingyo(): string[] {
  const allKanji = extractKanjiFromHannyashingyo();
  const uniqueKanji: string[] = [];
  const seen = new Set<string>();

  for (const kanji of allKanji) {
    if (!seen.has(kanji)) {
      seen.add(kanji);
      uniqueKanji.push(kanji);
    }
  }

  return uniqueKanji;
}

/**
 * 般若心経の情報
 */
export const HANNYASHINGYO_INFO = {
  name: '般若心経',
  description: '般若心経に含まれる漢字の練習ワークシート（重複を含む）',
  totalCharacters: HANNYASHINGYO_TEXT.length,
  totalKanji: extractKanjiFromHannyashingyo().length,
  uniqueKanji: extractUniqueKanjiFromHannyashingyo(),
} as const;
