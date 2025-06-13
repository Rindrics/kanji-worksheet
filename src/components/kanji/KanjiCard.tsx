import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';
import { StrokeOrderDisplay } from './StrokeOrderDisplay';

interface KanjiCardProps {
  kanji: Kanji;
}

export function KanjiCard({ kanji }: KanjiCardProps) {
  return (
    <div className="kanji-card print-break-inside-avoid">
      {/* 通常表示：シンプルな漢字のみ */}
      <div className="screen-only text-center">
        <div className="text-6xl kanji-character text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
          {kanji.character}
        </div>
      </div>

      {/* 印刷時のみ：2x2練習レイアウト */}
      <div className="print-only grid grid-cols-2 grid-rows-2 gap-1">
        {/* 左上：なぞり書き用（書き順付き） */}
        <div className="flex items-center justify-center border border-gray-400 relative">
          {/* なぞり書き用の薄いグレー文字 */}
          <div className="text-3xl kanji-character text-gray-300 font-light">
            {kanji.character}
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
          {/* なぞり書き用の薄いグレー文字 */}
          <div className="text-3xl kanji-character text-gray-300 font-light">
            {kanji.character}
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
