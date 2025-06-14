import { Kanji } from '@/types/kanji';

interface StrokeOrderDisplayProps {
  kanji: Kanji;
  className?: string;
}

export function StrokeOrderDisplay({ kanji, className = '' }: StrokeOrderDisplayProps) {
  if (!kanji.strokes || kanji.strokes.length === 0) {
    // ストロークデータがない場合は何も表示しない
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* SVGで書き順番号のみを表示 */}
      <svg
        viewBox={kanji.viewBox}
        className="w-full h-full pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* 書き順番号のみを描画 */}
        {kanji.strokes.map((stroke) => {
          const x = getStrokeStartX(stroke.path);
          const y = getStrokeStartY(stroke.path);

          return (
            <g key={stroke.order}>
              {/* 書き順番号（黒文字のみ） */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#333"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {stroke.order}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// SVGパスから開始座標を抽出する簡易関数
function getStrokeStartX(path: string): number {
  const match = path.match(/M(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 50;
}

function getStrokeStartY(path: string): number {
  const match = path.match(/M\d+(?:\.\d+)?,(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 50;
}
