import { RadicalType, radicalInfo } from '@/data/mock-kanji';
import { getKanjiStats } from '@/lib/search';

interface RadicalSelectorProps {
  selectedRadical: RadicalType | null;
  onRadicalSelect: (radical: RadicalType) => void;
  loading?: boolean;
}

export function RadicalSelector({ selectedRadical, onRadicalSelect, loading = false }: RadicalSelectorProps) {
  const stats = getKanjiStats();

  return (
    <div className="mb-6 radical-selector">
      <h2 className="text-xl font-semibold mb-4">グループを選択</h2>

      <div className="flex flex-wrap gap-3">
        {radicalInfo.map(radical => {
          const count = stats.radicalCounts.find(r => r.radical === radical.id)?.count || 0;

          return (
            <button
              key={radical.id}
              onClick={() => onRadicalSelect(radical.id)}
              disabled={loading}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all duration-200 disabled:opacity-50
                ${selectedRadical === radical.id
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{radical.id}</div>
                <div className="text-left">
                  <div className="font-medium">{radical.name}</div>
                  <div className="text-xs opacity-75">{count}文字</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedRadical && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">{selectedRadical}編</span>の漢字を表示中
            <span className="ml-2">
              (検索パターン: {radicalInfo.find(r => r.id === selectedRadical)?.variants.join(', ')})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
