'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { KanjiGrid } from '@/components/kanji/KanjiGrid';
import { searchKanjiByRadical, type RadicalType, radicalInfo } from '@/data/kanji';
import { APP_CONFIG } from '@/constants/app';

export default function PrintPreviewPage() {
  const searchParams = useSearchParams();
  const [kanjiList, setKanjiList] = useState<any[]>([]);
  const [selectedRadical, setSelectedRadical] = useState<RadicalType | null>(null);

  useEffect(() => {
    // URLパラメータから部首を取得
    const radical = searchParams.get('radical') as RadicalType;
    if (radical) {
      setSelectedRadical(radical);
      const results = searchKanjiByRadical(radical);
      setKanjiList(results);
    }
  }, [searchParams]);

  // 印刷プレビュー用のスタイルを動的に適用
  useEffect(() => {
    // 印刷用CSSを通常表示でも適用
    const style = document.createElement('style');
    style.textContent = `
      /* 印刷設定 - 横向き（landscape）をデフォルトに */
      @page {
        size: A4 landscape;
        margin: 1cm;
      }

      /* 印刷時の基本設定 */
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        body {
          font-size: 12pt;
          line-height: 1.4;
        }

        .screen-only {
          display: none !important;
        }

        .print-only {
          display: grid !important;
        }

        .print-break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }

      /* プレビュー表示用スタイル */
      .print-preview-mode {
        font-size: 14pt;
        line-height: 1.6;
        padding: 20pt;
        background: white;
        min-height: 100vh;
        max-width: 100%;
      }

      /* 画面でも印刷レイアウトを表示 */
      .print-preview-mode .screen-only {
        display: none;
      }

      .print-preview-mode .print-only {
        display: grid !important;
      }

      /* 漢字カード基本レイアウト */
      .print-preview-mode .kanji-card {
        margin-bottom: 15pt;
        padding: 4pt;
        border: 1pt solid #333;
        display: inline-block;
        width: 80pt;
        height: 80pt;
        background: white;
        break-inside: avoid;
      }

      .print-preview-mode .kanji-card .print-only {
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1pt;
        height: 100%;
        width: 100%;
      }

      /* 2x2グリッドの各セル */
      .print-preview-mode .kanji-card .print-only > div {
        border: 0.5pt solid #666 !important;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* 十字ガイドライン */
      .print-preview-mode .kanji-card .print-only > div::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        right: 0;
        bottom: 0;
        border-left: 0.3pt dashed #ccc;
        pointer-events: none;
      }

      .print-preview-mode .kanji-card .print-only > div::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 0.3pt dashed #ccc;
        pointer-events: none;
      }

      /* 漢字文字スタイル */
      .print-preview-mode .kanji-character {
        font-size: 24pt;
        line-height: 1;
        font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
      }

      .print-preview-mode .text-gray-300 {
        color: #ddd !important;
        font-weight: 200;
      }

      /* 書き順オーバーレイ */
      .print-preview-mode .stroke-order-overlay {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none;
      }

      .print-preview-mode .stroke-order-overlay svg {
        width: 100% !important;
        height: 100% !important;
      }

      .print-preview-mode .stroke-order-overlay text {
        font-size: 6pt !important;
        fill: #333 !important;
        stroke: white !important;
        stroke-width: 1.5pt !important;
        font-weight: bold !important;
        font-family: Arial, sans-serif !important;
        paint-order: stroke fill !important;
      }

      /* グリッドレイアウト最適化 */
      .print-preview-mode .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80pt, 1fr));
        gap: 8pt;
        margin: 0 auto;
        max-width: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const radicalData = selectedRadical ? radicalInfo.find(r => r.id === selectedRadical) : null;
  const title = radicalData ? `${radicalData.description || selectedRadical}に関係する漢字ワークシート` : '印刷プレビュー';

  const handlePrint = () => {
    // 印刷前にタイトルを設定
    const originalTitle = document.title;
    document.title = title;

    // 印刷実行
    window.print();

    // タイトルを元に戻す
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 開発用コントロールパネル */}
      <div className="fixed top-0 left-0 right-0 bg-blue-100 border-b-2 border-blue-300 p-4 z-50 screen-only">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-blue-800">📄 印刷プレビュー（横向き印刷）</h1>
            {radicalData && (
              <div className="text-sm text-blue-700">
                部首: {radicalData.name} ({selectedRadical}) | 漢字数: {kanjiList.length}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
            >
              🖨️ 印刷（横向き）
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>

      {/* 印刷プレビューコンテンツ */}
      <div className="print-preview-mode" style={{ marginTop: '80px' }}>
        {/* 印刷時のヘッダー */}
        <div className="print-only mb-6">
          <h1 className="text-xl font-bold text-center mb-2">{title}</h1>
          <div className="text-sm text-center text-gray-600 mb-4">
            漢字数: {kanjiList.length} | {new Date().toLocaleDateString('ja-JP')}
          </div>
        </div>

        <main>
          {kanjiList.length > 0 ? (
            <KanjiGrid
              kanjiList={kanjiList}
              title={undefined} // 印刷時は上部にタイトル表示済み
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                URLパラメータで部首を指定してください<br />
                例: /dev/print-preview?radical=水
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
