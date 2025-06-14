import { useState } from 'react';
import { searchByRadical } from '@/lib/search';
import { type RadicalType } from '@/data/kanji';
import type { Kanji } from '@/types/kanji';

export function useKanjiSearch() {
  const [results, setResults] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRadical, setSelectedRadical] = useState<RadicalType | null>(null);

  const searchRadical = async (radical: RadicalType) => {
    setLoading(true);
    setSelectedRadical(radical);
    
    try {
      // 実際の環境では非同期処理（API呼び出し等）になる可能性があるため
      // setTimeoutで非同期処理をシミュレート
      setTimeout(() => {
        const searchResults = searchByRadical(radical);
        setResults(searchResults);
        setLoading(false);
      }, 300); // UXのため少し遅延を入れる
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setResults([]);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setSelectedRadical(null);
    setLoading(false);
  };

  return {
    results,
    loading,
    selectedRadical,
    searchRadical,
    clearSearch,
  };
}
