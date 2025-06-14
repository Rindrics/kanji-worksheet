import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';
import { StrokeOrderDisplay } from './StrokeOrderDisplay';
import { KanjiSVGDisplay } from './KanjiSVGDisplay';

// 背景グリッドコンポーネント（重複削除）
function BackgroundGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100">
      {/* 縦線 */}
      <line x1="50" y1="0" x2="50" y2="100" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="2,2" />
      {/* 横線 */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="2,2" />
    </svg>
  );
}

interface KanjiCardProps {
  kanji: Kanji;
}

export function KanjiCard({ kanji }: KanjiCardProps) {
  return (
    <div className="kanji-card print-break-inside-avoid">
      {/* 通常表示：シンプルな漢字のみ */}
      <div className="screen-only text-center">
        <div className="w-24 h-24 mx-auto text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
          <KanjiSVGDisplay
            kanji={kanji}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 印刷時のみ：2x2練習レイアウト */}
      <div className="print-only grid grid-cols-2 grid-rows-2 gap-1">
        {/* 左上：なぞり書き用（書き順付き） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          <BackgroundGrid />
          {/* なぞり書き用の薄いグレー漢字 */}
          <div className="w-full h-full p-1 relative z-10">
            <KanjiSVGDisplay
              kanji={kanji}
              className="w-full h-full"
              variant="light"
            />
          </div>
          {/* 書き順番号オーバーレイ */}
          <StrokeOrderDisplay
            kanji={kanji}
            className="absolute inset-0 stroke-order-overlay z-20"
          />
        </div>

        {/* 右上：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          <BackgroundGrid />
        </div>

        {/* 左下：なぞり書き用（書き順付き） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          <BackgroundGrid />
          {/* なぞり書き用の薄いグレー漢字 */}
          <div className="w-full h-full p-1 relative z-10">
            <KanjiSVGDisplay
              kanji={kanji}
              className="w-full h-full"
              variant="light"
            />
          </div>
          {/* 書き順番号オーバーレイ */}
          <StrokeOrderDisplay
            kanji={kanji}
            className="absolute inset-0 stroke-order-overlay z-20"
          />
        </div>

        {/* 右下：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          <BackgroundGrid />
        </div>
      </div>
    </div>
  );
}
