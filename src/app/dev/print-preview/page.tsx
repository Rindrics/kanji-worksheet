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
      .print-preview-mode {
        /* 印刷用レイアウトを通常表示で再現 */
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 14pt;
        line-height: 1.6;
        padding: 20pt;
        background: white;
        min-height: 100vh;
      }

      .print-preview-mode .screen-only {
        display: none;
      }

      .print-preview-mode .print-only {
        display: grid;
      }

      .print-preview-mode .kanji-card {
        writing-mode: vertical-rl;
        text-orientation: upright;
        margin-bottom: 15pt;
        padding: 4pt;
        border: 1pt solid #333;
        display: inline-block;
        width: 80pt;
        height: 80pt;
        background: white;
      }

      .print-preview-mode .kanji-card .print-only {
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 2pt;
        height: 100%;
        width: 100%;
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
      }

      .print-preview-mode .kanji-character {
        writing-mode: vertical-rl;
        text-orientation: upright;
        font-feature-settings: "vert" 1;
        font-size: 26pt;
        line-height: 1;
      }

      .print-preview-mode .text-gray-300 {
        color: #ddd !important;
        font-weight: 200;
        writing-mode: vertical-rl !important;
        text-orientation: upright !important;
      }

      .print-preview-mode .border {
        border: 0.5pt solid #666 !important;
        position: relative;
      }

      .print-preview-mode .border::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        right: 0;
        bottom: 0;
        border-left: 0.3pt dashed #ccc;
        pointer-events: none;
      }

      .print-preview-mode .border::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 0.3pt dashed #ccc;
        pointer-events: none;
      }

      .print-preview-mode .stroke-order-overlay svg {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }

      .print-preview-mode .stroke-order-overlay text {
        font-size: 7pt !important;
        fill: #333 !important;
        stroke: white !important;
        stroke-width: 1.5pt !important;
        font-weight: bold !important;
        font-family: Arial, sans-serif !important;
        paint-order: stroke fill !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const radicalData = selectedRadical ? radicalInfo.find(r => r.id === selectedRadical) : null;
  const title = radicalData ? `${radicalData.description || selectedRadical}ワークシート` : '印刷プレビュー';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 開発用コントロールパネル */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-2 border-yellow-300 p-4 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-yellow-800">🚧 開発用印刷プレビュー</h1>
            {radicalData && (
              <div className="text-sm text-yellow-700">
                部首: {radicalData.name} ({selectedRadical}) | 漢字数: {kanjiList.length}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🖨️ 印刷テスト
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
        <main>
          {kanjiList.length > 0 ? (
            <KanjiGrid
              kanjiList={kanjiList}
              title={title}
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