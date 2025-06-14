// 部首設定ファイル（TypeScriptとビルドスクリプトの両方から使用）

// 部首ごとの検索パターン
export const radicalSearchPatterns = {
  '水': ['水', '氵'], // 水、さんずい
  '火': ['火', '灬'], // 火、れっか、その他火関連
  '魚': ['魚'], // 魚、うおへん
  '木': ['木'], // 木へん
} as const;

// 型定義を動的に生成
export type RadicalType = keyof typeof radicalSearchPatterns;

// 部首情報の型定義
export interface RadicalInfo {
  id: RadicalType;
  name: string;
  description: string;
  variants: readonly string[];
  excludeComponents?: string[];
  excludeCharacter?: string[];
}

// 部首情報（UI表示用）
export const radicalInfo: RadicalInfo[] = [
  {
    id: '水' as RadicalType,
    name: '水・さんずい',
    description: '水に関係する漢字',
    variants: radicalSearchPatterns['水'],
    excludeCharacter: ['氵', '氺'],
  },
  {
    id: '火' as RadicalType,
    name: '火へん・れっか',
    description: '火に関係する漢字',
    variants: radicalSearchPatterns['火'],
    excludeComponents: ['馬', '魚', '鳥', '寫', '黒'],
    excludeCharacter: ['灬'],
  },
  {
    id: '魚' as RadicalType,
    name: '魚へん',
    description: '魚に関係する漢字',
    variants: radicalSearchPatterns['魚'],
  },
  {
    id: '木' as RadicalType,
    name: '木へん',
    description: '木に関係する漢字',
    variants: radicalSearchPatterns['木'],
  },
];

// CommonJS用のエクスポート（Node.jsビルドスクリプト用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    radicalSearchPatterns,
    radicalInfo,
  };
}
