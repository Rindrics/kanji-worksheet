export interface KanjiIndex {
  kanji: Record<string, KanjiBasicInfo>;
  radicalIndex: Record<string, string[]>;
  metadata: IndexMetadata;
}

export interface KanjiBasicInfo {
  character: string;
  strokeCount: number;
  radicals: string[];
  hasDetails: boolean;
}

export interface IndexMetadata {
  version: string;
  totalKanji: number;
  generatedAt: string;
}
