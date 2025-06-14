'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RadicalSelector } from '@/components/kanji/RadicalSelector';
import { KanjiGrid } from '@/components/kanji/KanjiGrid';
import Footer from '@/components/common/Footer';
import { useKanjiSearch } from '@/hooks/useKanjiSearch';
import { type RadicalType, radicalInfo } from '@/data/kanji';
import { APP_CONFIG } from '@/constants/app';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [isPrintMode, setIsPrintMode] = useState(false);

  const {
    results,
    loading,
    searchType,
    selectedRadical,
    searchRadical,
    searchHannyashingyo,
    clearSearch
  } = useKanjiSearch();

  // URL クエリパラメータで印刷モードを判定
  useEffect(() => {
    const printParam = searchParams.get('print');
    const radicalParam = searchParams.get('radical') as RadicalType;

    setIsPrintMode(printParam === 'true');

    // 印刷モードで部首が指定されていない場合、デフォルトで「火」を選択
    if (printParam === 'true') {
      if (radicalParam) {
        // URLに部首が指定されている場合はそれを使用
        if (selectedRadical !== radicalParam) {
          searchRadical(radicalParam);
        }
      } else if (!selectedRadical) {
        // 印刷モードで部首が未選択の場合、デフォルトで「火」を選択
        searchRadical('火');

        // URLにも反映
        const url = new URL(window.location.href);
        url.searchParams.set('radical', '火');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams, selectedRadical, searchRadical]);

  // 選択された検索タイプに応じてページタイトルを動的変更
  useEffect(() => {
    if (searchType === 'hannyashingyo') {
      const title = APP_CONFIG.PDF_FILENAME_TEMPLATE('般若心経');
      document.title = title;
    } else if (selectedRadical) {
      const radicalData = radicalInfo.find(r => r.id === selectedRadical);
      const groupName = radicalData?.description || `${selectedRadical}に関する漢字`;
      const title = APP_CONFIG.PDF_FILENAME_TEMPLATE(groupName);
      document.title = title;
    } else {
      document.title = APP_CONFIG.SERVICE_NAME;
    }
  }, [searchType, selectedRadical]);



  // 印刷モード用のスタイルを動的に適用
  useEffect(() => {
    if (isPrintMode) {
      document.body.classList.add('print-mode-enabled');
    } else {
      document.body.classList.remove('print-mode-enabled');
    }

    return () => {
      document.body.classList.remove('print-mode-enabled');
    };
  }, [isPrintMode]);

  const handleRadicalSelect = (radical: RadicalType) => {
    if (selectedRadical === radical) {
      clearSearch(); // 同じ部首をクリックしたらクリア
    } else {
      searchRadical(radical);
    }

    // 印刷モードの場合、URLにも部首を反映
    if (isPrintMode) {
      const url = new URL(window.location.href);
      if (selectedRadical === radical) {
        url.searchParams.delete('radical');
      } else {
        url.searchParams.set('radical', radical);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // 将来的に詳細表示や印刷選択に使用する予定
  // const handleKanjiClick = (kanji: Kanji) => {
  //   console.log('選択された漢字:', kanji.character, kanji);
  // };

  const togglePrintMode = () => {
    const newPrintMode = !isPrintMode;
    const url = new URL(window.location.href);

    if (newPrintMode) {
      url.searchParams.set('print', 'true');
      // 印刷モードに入る時、部首が未選択なら「火」をデフォルトに
      if (!selectedRadical) {
        searchRadical('火');
        url.searchParams.set('radical', '火');
      } else {
        // 既に選択されている部首をURLに反映
        url.searchParams.set('radical', selectedRadical);
      }
    } else {
      url.searchParams.delete('print');
      url.searchParams.delete('radical');
    }

    window.history.replaceState({}, '', url.toString());
    setIsPrintMode(newPrintMode);
  };

  const radicalData = selectedRadical ? radicalInfo.find(r => r.id === selectedRadical) : null;
  const title = radicalData ? `${radicalData.description || selectedRadical}に関係する漢字ワークシート` : '';

  // 印刷モードの場合
  if (isPrintMode) {
    return (
      <main className="min-h-screen bg-white print-mode-view">
        {/* 開発用コントロールパネル */}
        <div className="fixed top-0 left-0 right-0 bg-green-100 border-b-2 border-green-300 p-4 z-50 screen-only">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-bold text-green-800">🖨️ 印刷モード（開発用）</h1>
              {radicalData && (
                <div className="text-sm text-green-700">
                  部首: {radicalData.name} ({selectedRadical}) | 漢字数: {results.length}
                </div>
              )}
              <div className="text-xs text-green-600">
                💡 リロード時は自動で「火」を選択
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🖨️ 印刷
              </button>
              <button
                onClick={togglePrintMode}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                👁️ 通常表示
              </button>
            </div>
          </div>
        </div>

        {/* 印刷プレビューコンテンツ */}
        <div className="print-mode-content" style={{ marginTop: '80px' }}>
          {/* 印刷時のヘッダー */}
          {results.length > 0 && (
            <div className="print-only mb-6">
              <h1 className="text-xl font-bold text-center mb-2">{title}</h1>
              <div className="text-sm text-center text-gray-600 mb-4">
                漢字数: {results.length} | {new Date().toLocaleDateString('ja-JP')}
              </div>
              <div className="text-xs text-center text-gray-500 mb-4">
                筆順データ: KanjiVG © Ulrich Apel - CC BY-SA 3.0
              </div>
            </div>
          )}

          <div className="print-mode-styles">
            {results.length > 0 ? (
              <KanjiGrid
                kanjiList={results}
                title={undefined} // 印刷時は上部にタイトル表示済み
              />
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-500">漢字を読み込み中...</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  部首を選択してワークシートを生成してください
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // 通常モード
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
        </header>

        {/* 検索方法選択 */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* 般若心経ボタン */}
          <div className="mb-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">学習テーマを選択</h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearSearch}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg transition-colors shadow-sm ${
                    searchType === 'radical'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  🧵 部首別
                </button>
                <button
                  onClick={searchHannyashingyo}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg transition-colors shadow-sm ${
                    searchType === 'hannyashingyo'
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  📿 般若心経
                </button>
              </div>
            </div>
          </div>

          {/* 部首選択（部首モードの時のみ表示） */}
          {searchType === 'radical' && (
            <>
              <RadicalSelector
                selectedRadical={selectedRadical}
                onRadicalSelect={handleRadicalSelect}
                loading={loading}
              />

              {/* 新しいグループ追加リクエストへの導線 */}
              <div className="mt-6 pt-6 border-t border-gray-200 print-hide">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    探している部首・部品グループが見つからない場合
                  </p>
                  <Link
                    href="/request-radical"
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                  >
                    📝 グループの追加を依頼する
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        {/* 印刷ボタン */}
        {results.length > 0 && (
          <section className="text-center mb-6 print-hide">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                title="ブラウザで直接印刷"
              >
                🖨️ ワークシートを印刷
              </button>
              {/* 開発環境でのみ印刷プレビューボタンを表示 */}
              {process.env.NODE_ENV !== 'production' && (
                <button
                  onClick={togglePrintMode}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  title="印刷レイアウトを確認"
                >
                  👁️ 印刷プレビュー
                </button>
              )}
            </div>
          </section>
        )}

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
              title={
                searchType === 'hannyashingyo'
                  ? `般若心経の漢字（${results.length}文字）`
                  : selectedRadical
                  ? `${selectedRadical}に関係する漢字（${results.length}個）`
                  : undefined
              }
            />
          )}
        </section>

        {/* フッター */}
        <Footer />
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
