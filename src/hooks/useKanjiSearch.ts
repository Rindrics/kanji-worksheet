import { useState, useCallback } from 'react';
import { Kanji } from '@/types/kanji';
import { RadicalType } from '@/data/mock-kanji';
import { searchByRadical, searchByCharacter, getAllKanji } from '@/lib/search';

export function useKanjiSearch() {
  const [results, setResults] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRadical, setSelectedRadical] = useState<RadicalType | null>(null);

  const searchRadical = useCallback((radical: RadicalType) => {
    setLoading(true);
    try {
      const searchResults = searchByRadical(radical);
      setResults(searchResults);
      setSelectedRadical(radical);
    } catch (error) {
      console.error('部首検索エラー:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCharacter = useCallback((query: string) => {
    setLoading(true);
    try {
      const searchResults = searchByCharacter(query);
      setResults(searchResults);
      setSelectedRadical(null);
    } catch (error) {
      console.error('文字検索エラー:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setSelectedRadical(null);
    setLoading(false);
  }, []);

  const showAll = useCallback(() => {
    setLoading(true);
    try {
      const allKanji = getAllKanji();
      setResults(allKanji);
      setSelectedRadical(null);
    } catch (error) {
      console.error('全漢字取得エラー:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    selectedRadical,
    searchRadical,
    searchCharacter,
    clearSearch,
    showAll,
  };
}
