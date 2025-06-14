import { radicalSearchPatterns, type RadicalType } from '@/data/kanji';
import { generatedKanji } from '@/data/generated-kanji';
import { radicalInfo } from '@/data/kanji';
import { extractKanjiFromHannyashingyo } from '@/data/hannyashingyo';
import type { Kanji } from '@/types/kanji';

// 検索タイプの定義
export type SearchType = 'radical' | 'hannyashingyo';

// 部首による漢字検索（既存機能）
export function searchByRadical(radical: RadicalType): Kanji[] {
  console.log(`🔍 Searching for radical: ${radical}`);

  const patterns = radicalSearchPatterns[radical];
  if (!patterns) {
    console.warn(`⚠️ No patterns found for radical: ${radical}`);
    return [];
  }

  const radicalConfig = radicalInfo.find(info => info.id === radical);
  const excludeComponents = radicalConfig?.excludeComponents || [];
  const excludeCharacter = radicalConfig?.excludeCharacter || [];

  const results = generatedKanji.filter(kanji => {
    // 除外文字のチェック
    if (excludeCharacter.includes(kanji.character)) {
      return false;
    }

    // 除外部品のチェック
    if (excludeComponents.some(component => kanji.radicals.includes(component))) {
      return false;
    }

    // パターンマッチング
    return patterns.some(pattern =>
      kanji.radicals.includes(pattern)
    );
  });

  console.log(`📊 Found ${results.length} characters for radical: ${radical}`);
  return results;
}

// 般若心経による漢字検索（新機能）
export function searchByHannyashingyo(): Kanji[] {
  console.log('🔍 Searching for Hannyashingyo characters');

  const hannyashingyoKanji = extractKanjiFromHannyashingyo(); // 重複も含む

  const results: Kanji[] = [];
  const missingKanji: string[] = [];

  // 般若心経の出現順に従い、重複も含めて結果を作成
  for (const kanjiChar of hannyashingyoKanji) {
    const foundKanji = generatedKanji.find(kanji => kanji.character === kanjiChar);
    if (foundKanji) {
      results.push(foundKanji);
    } else {
      // KanjiVGデータが存在しない漢字のダミーオブジェクトを作成
      const dummyKanji: Kanji = {
        character: kanjiChar,
        unicode: kanjiChar.codePointAt(0)?.toString(16).padStart(4, '0').toUpperCase() || '0000',
        strokeCount: 1, // デフォルト値
        strokes: [], // 空の配列
        radicals: [], // 空の配列
        viewBox: '0 0 109 109', // 標準的なviewBox
        source: 'kanjivg'
      };
      results.push(dummyKanji);
      missingKanji.push(kanjiChar);
    }
  }

  console.log(`📊 Found ${results.length} characters for Hannyashingyo (including duplicates)`);
  if (missingKanji.length > 0) {
    console.log(`⚠️ Missing from KanjiVG database: ${missingKanji.join(', ')}`);
  }
  return results;
}

// 統合検索関数
export function searchKanji(type: SearchType, query?: RadicalType): Kanji[] {
  switch (type) {
    case 'radical':
      if (!query) {
        console.warn('⚠️ Radical search requires a query parameter');
        return [];
      }
      return searchByRadical(query);
    case 'hannyashingyo':
      return searchByHannyashingyo();
    default:
      console.warn(`⚠️ Unknown search type: ${type}`);
      return [];
  }
}
