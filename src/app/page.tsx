'use client';

import { useEffect } from 'react';
import { RadicalSelector } from '@/components/kanji/RadicalSelector';
import { KanjiGrid } from '@/components/kanji/KanjiGrid';
import { useKanjiSearch } from '@/hooks/useKanjiSearch';
import { RadicalType, radicalInfo } from '@/data/mock-kanji';
import { Kanji } from '@/types/kanji';
import { APP_CONFIG } from '@/constants/app';

export default function HomePage() {
  const {
    results,
    loading,
    selectedRadical,
    searchRadical,
    clearSearch
  } = useKanjiSearch();

  // 選択された部首に応じてページタイトルを動的変更
  useEffect(() => {
    if (selectedRadical) {
      const radicalData = radicalInfo.find(r => r.id === selectedRadical);
      const groupName = radicalData?.description || `${selectedRadical}に関する漢字`;
      const title = APP_CONFIG.PDF_FILENAME_TEMPLATE(groupName);
      document.title = title;
    } else {
      document.title = APP_CONFIG.SERVICE_NAME;
    }
  }, [selectedRadical]);

  // 印刷時のURL表示用にCSS変数を設定
  useEffect(() => {
    // 現在のURLを取得（開発時は定数、本番は実際のURL）
    const currentUrl = typeof window !== 'undefined'
      ? window.location.origin
      : APP_CONFIG.SITE_URL;

    // CSS変数として設定
    document.documentElement.style.setProperty('--print-site-url', `"${currentUrl}"`);
  }, []);

  const handleRadicalSelect = (radical: RadicalType) => {
    if (selectedRadical === radical) {
      clearSearch(); // 同じ部首をクリックしたらクリア
    } else {
      searchRadical(radical);
    }
  };

  const handleKanjiClick = (kanji: Kanji) => {
    console.log('選択された漢字:', kanji.character, kanji);
    // 将来的に詳細表示や印刷選択に使用
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {APP_CONFIG.SERVICE_NAME}
          </h1>
          <p>
            {APP_CONFIG.DESCRIPTION}
          </p>

          {/* 印刷ボタン */}
          {results.length > 0 && (
            <div className="mt-4 print-hide">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                🖨️ 練習プリントを印刷
              </button>
            </div>
          )}
        </header>

        {/* 部首選択 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <RadicalSelector
            selectedRadical={selectedRadical}
            onRadicalSelect={handleRadicalSelect}
            loading={loading}
          />
        </section>

        {/* 漢字一覧 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">検索中...</p>
            </div>
          ) : (
            <KanjiGrid
              kanjiList={results}
              title={selectedRadical ? `${selectedRadical}に関係する漢字` : undefined}
            />
          )}
        </section>
      </div>
    </main>
  );
}
