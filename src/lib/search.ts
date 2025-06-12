import { Kanji } from '@/types/kanji';
import { mockKanji, radicalSearchPatterns, RadicalType, radicalInfo } from '@/data/mock-kanji';

export function searchByRadical(radical: RadicalType): Kanji[] {
  const searchPatterns = radicalSearchPatterns[radical];

  const results = mockKanji.filter(kanji =>
    searchPatterns.some(pattern =>
      kanji.radicals.includes(pattern)
    )
  );

  return results.sort((a, b) => a.strokeCount - b.strokeCount);
}

export function searchByCharacter(query: string): Kanji[] {
  if (!query.trim()) return [];

  return mockKanji.filter(kanji =>
    kanji.character.includes(query) ||
    kanji.radicals.some(radical => radical.includes(query))
  );
}

export function searchByStrokeCount(min: number, max?: number): Kanji[] {
  return mockKanji.filter(kanji => {
    if (max !== undefined) {
      return kanji.strokeCount >= min && kanji.strokeCount <= max;
    }
    return kanji.strokeCount === min;
  }).sort((a, b) => a.strokeCount - b.strokeCount);
}

export function getAllKanji(): Kanji[] {
  return mockKanji.sort((a, b) => a.strokeCount - b.strokeCount);
}

export function getKanjiStats() {
  const radicalCounts = radicalInfo.map(info => ({
    radical: info.id,
    name: info.name,
    count: searchByRadical(info.id).length,
  }));

  return {
    totalKanji: mockKanji.length,
    radicalCounts,
    strokeRange: {
      min: Math.min(...mockKanji.map(k => k.strokeCount)),
      max: Math.max(...mockKanji.map(k => k.strokeCount)),
    }
  };
}
