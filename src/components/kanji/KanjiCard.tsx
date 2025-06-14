import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';
import { StrokeOrderDisplay } from './StrokeOrderDisplay';
import { KanjiSVGDisplay } from './KanjiSVGDisplay';

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
          {/* なぞり書き用の薄いグレー漢字 */}
          <div className="w-full h-full p-1">
            <KanjiSVGDisplay
              kanji={kanji}
              className="w-full h-full"
              opacity={0.3}
            />
          </div>
          {/* 書き順番号オーバーレイ */}
          <StrokeOrderDisplay
            kanji={kanji}
            className="absolute inset-0 stroke-order-overlay"
          />
        </div>

        {/* 右上：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400">
          {/* 空欄 */}
        </div>

        {/* 左下：なぞり書き用（書き順付き） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          {/* なぞり書き用の薄いグレー漢字 */}
          <div className="w-full h-full p-1">
            <KanjiSVGDisplay
              kanji={kanji}
              className="w-full h-full"
              opacity={0.3}
            />
          </div>
          {/* 書き順番号オーバーレイ */}
          <StrokeOrderDisplay
            kanji={kanji}
            className="absolute inset-0 stroke-order-overlay"
          />
        </div>

        {/* 右下：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400">
          {/* 空欄 */}
        </div>
      </div>
    </div>
  );
}
