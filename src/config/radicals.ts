// 部首設定ファイル（TypeScriptとビルドスクリプトの両方から使用）

// 部首ごとの検索パターン
export const radicalSearchPatterns = {
  '水': ['水', '氵'], // 水、さんずい
  '火': ['火', '灬'], // 火、れっか、その他火関連
  '魚': ['魚'], // 魚、うおへん
  '木': ['木', '禾'], // 木へん
  '金': ['金'], // 金へん
  '人': ['人', '亻'],
  '月': ['月'],
  '手': ['手', '扌'],
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
    name: '木・きへん・のぎへん',
    description: '木に関係する漢字',
    variants: radicalSearchPatterns['木'],
  },
  {
    id: '金' as RadicalType,
    name: '金・かねへん',
    description: '金に関係する漢字',
    variants: radicalSearchPatterns['金'],
  },
  {
    id: '人' as RadicalType,
    name: '人, にんべん',
    description: '人に関係する漢字',
    variants: radicalSearchPatterns['人'],
    excludeCharacter: ['亻'],
    excludeComponents: ['彳', '隹', '合', '倉', '拳', '秦', '余', '今', '令', '龰', '券', '侖', '參', '参'],
  },
  {
    id: '月' as RadicalType,
    name: '月・にくづき',
    description: '体に関係する漢字・「月」を含む漢字',
    variants: radicalSearchPatterns['月'],
  },
  {
    id: '手' as RadicalType,
    name: '手・てへん',
    description: '手に関係する漢字',
    variants: radicalSearchPatterns['手'],
  },
];

// CommonJS用のエクスポート（Node.jsビルドスクリプト用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    radicalSearchPatterns,
    radicalInfo,
  };
}
