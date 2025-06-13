import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';

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
        {/* 左上：なぞり書き用（薄いグレー） */}
        <div className="flex items-center justify-center border border-gray-400">
          <div className="text-3xl kanji-character text-gray-300 font-light">
            {kanji.character}
          </div>
        </div>

        {/* 右上：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400">
          {/* 空欄 */}
        </div>

        {/* 左下：なぞり書き用（薄いグレー） */}
        <div className="flex items-center justify-center border border-gray-400">
          <div className="text-3xl kanji-character text-gray-300 font-light">
            {kanji.character}
          </div>
        </div>

        {/* 右下：空欄（自分で書く用） */}
        <div className="flex items-center justify-center border border-gray-400">
          {/* 空欄 */}
        </div>
      </div>
    </div>
  );
}
