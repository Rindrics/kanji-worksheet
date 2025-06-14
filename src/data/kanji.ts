// データソース管理ファイル
import type { Kanji } from '@/types/kanji';
import { radicalInfo, radicalSearchPatterns, type RadicalType } from '@/config/radicals';

// デフォルトで生成されたKanjiVGデータを使用、モックデータはフォールバックのみ
let kanjiData: Kanji[] = [];

// データソースの動的ロード
try {
  // 生成されたKanjiVGデータを使用
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const generated = require('./generated-kanji');
  kanjiData = generated.generatedKanji || [];
  console.log(`✅ Using generated KanjiVG data (${kanjiData.length} characters)`);
} catch {
  console.warn('⚠️ Generated KanjiVG data not found, falling back to mock data');
  // フォールバック: モックデータを使用
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mock = require('./mock-kanji');
  kanjiData = mock.mockKanji || [];
  console.log(`🔧 Fallback to mock data (${kanjiData.length} characters)`);
}

// エクスポート（radicalInfoは設定ファイルから）
export const allKanji = kanjiData;
export { radicalInfo, radicalSearchPatterns };
export type { RadicalType };

// 統計情報のキャッシュ
let statsCache: {
  totalCount: number;
  radicalCounts: Array<{ radical: RadicalType; count: number }>;
} | null = null;

export function getKanjiStats() {
  if (statsCache) return statsCache;

  const totalCount = allKanji.length;
  const radicalCounts = Object.keys(radicalSearchPatterns).map(radical => {
    const patterns = radicalSearchPatterns[radical as RadicalType];
    const count = allKanji.filter(kanji => 
      patterns.some(pattern => 
        kanji.radicals?.includes(pattern) || kanji.character.includes(pattern)
      )
    ).length;
    return { radical: radical as RadicalType, count };
  });

  statsCache = { totalCount, radicalCounts };
  return statsCache;
}

// 部首による漢字検索
export function searchKanjiByRadical(radical: RadicalType): Kanji[] {
  const patterns = radicalSearchPatterns[radical];
  if (!patterns) return [];

  // 対応する部首情報から除外リストを取得
  const radicalInfoItem = radicalInfo.find(info => info.id === radical);
  const excludeComponents = radicalInfoItem?.excludeComponents || [];

  // 型安全性のため配列にキャスト
  const patternArray = [...patterns] as string[];

  return allKanji.filter(kanji => {
    // デフォルト除外：部首文字そのものを除外
    if (patternArray.includes(kanji.character)) {
      return false;
    }

    // 構成要素除外：指定された文字を構成要素として含む漢字を除外
    if (excludeComponents.some(component => kanji.radicals?.includes(component))) {
      return false;
    }

    // 部首パターンにマッチする漢字を検索
    return patternArray.some(pattern => 
      kanji.radicals?.includes(pattern) || kanji.character.includes(pattern)
    );
  }).sort((a, b) => a.strokeCount - b.strokeCount); // 画数順でソート
} 