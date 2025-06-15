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
      {/* SVGで書き順番号を表示 */}
      <svg
        viewBox={kanji.viewBox}
        className="w-full h-full pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* 書き順番号を描画 */}
        {kanji.strokes.map((stroke) => {
          const x = getStrokeStartX(stroke.path);
          const y = getStrokeStartY(stroke.path);
          // 偶数画は薄いグレー、奇数画は黒
          const fillColor = stroke.order % 2 === 0 ? '#999' : '#000';

          return (
            <g key={stroke.order}>
              {/* 書き順番号（偶数は薄いグレー、奇数は黒） */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill={fillColor}
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

// SVGパスから開始座標を抽出する関数
function getStrokeStartX(path: string): number {
  const match = path.match(/M(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 50;
}

function getStrokeStartY(path: string): number {
  const match = path.match(/M\d+(?:\.\d+)?,(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 50;
}
