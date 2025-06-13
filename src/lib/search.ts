import { allKanji, radicalSearchPatterns, getKanjiStats, searchKanjiByRadical, type RadicalType } from '@/data/kanji';
import type { Kanji } from '@/types/kanji';

// 統計情報を取得（キャッシュ済み）
export { getKanjiStats };

// 部首による検索
export function searchByRadical(radical: RadicalType): Kanji[] {
  return searchKanjiByRadical(radical);
}

// 全ての漢字を取得
export function getAllKanji(): Kanji[] {
  return allKanji;
}

// 特定の漢字を検索
export function findKanjiByCharacter(character: string): Kanji | undefined {
  return allKanji.find(kanji => kanji.character === character);
}

// 画数による検索
export function searchByStrokeCount(min: number, max: number): Kanji[] {
  return allKanji.filter(kanji => 
    kanji.strokeCount >= min && kanji.strokeCount <= max
  ).sort((a, b) => a.strokeCount - b.strokeCount);
}

// 部首のバリエーション検索
export function getRadicalVariants(radical: RadicalType): string[] {
  return radicalSearchPatterns[radical] || [];
}
