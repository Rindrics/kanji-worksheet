import { Kanji } from '@/types/kanji';
import { KanjiCard } from './KanjiCard';

interface KanjiGridProps {
  kanjiList: Kanji[];
  title?: string;
  loading?: boolean;
}

export function KanjiGrid({ kanjiList, title, loading = false }: KanjiGridProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (kanjiList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          🙈 グループが選択されていません
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {kanjiList.map(kanji => (
          <KanjiCard 
            key={kanji.unicode} 
            kanji={kanji}
          />
        ))}
      </div>
      
      {/* 追加情報 */}
      {kanjiList.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg print-hide">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              画数範囲: {Math.min(...kanjiList.map(k => k.strokeCount))} - {Math.max(...kanjiList.map(k => k.strokeCount))}画
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
