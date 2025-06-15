import { useState } from 'react';
import { searchKanji, type SearchType } from '@/lib/search';
import { type RadicalType } from '@/data/kanji';
import type { Kanji } from '@/types/kanji';

export function useKanjiSearch() {
  const [results, setResults] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('radical');
  const [selectedRadical, setSelectedRadical] = useState<RadicalType | null>(null);

  const searchRadical = async (radical: RadicalType) => {
    setLoading(true);
    setSelectedRadical(radical);
    setSearchType('radical');

    try {
      setTimeout(() => {
        const searchResults = searchKanji('radical', radical);
        setResults(searchResults);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setResults([]);
      setLoading(false);
    }
  };

  const searchHannyashingyo = async () => {
    setLoading(true);
    setSelectedRadical(null);
    setSearchType('hannyashingyo');

    try {
      setTimeout(() => {
        const searchResults = searchKanji('hannyashingyo');
        setResults(searchResults);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setResults([]);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setSelectedRadical(null);
    setSearchType('radical');
    setLoading(false);
  };

  return {
    results,
    loading,
    searchType,
    selectedRadical,
    searchRadical,
    searchHannyashingyo,
    clearSearch,
  };
}
