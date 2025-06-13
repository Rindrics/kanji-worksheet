import { Kanji } from '@/types/kanji';

interface StrokeOrderDisplayProps {
  kanji: Kanji;
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

export function StrokeOrderDisplay({ kanji, className = '' }: StrokeOrderDisplayProps) {
  if (!kanji.strokes || kanji.strokes.length === 0) {
    // ストロークデータがない場合は何も表示しない
    return null;
  }

  // 書き順番号の位置を調整（重なり防止）
  const adjustedPositions = calculateAdjustedPositions(kanji.strokes);

  return (
    <div className={`${className}`}>
      {/* SVGで書き順番号のみを表示 */}
      <svg
        viewBox={kanji.viewBox}
        className="w-full h-full pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* 書き順番号のみを描画 */}
        {kanji.strokes.map((stroke, index) => {
          const position = adjustedPositions[index];
          return (
            <g key={stroke.order}>
              {/* 書き順番号（囲みなし黒文字） */}
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#333"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                stroke="#fff"
                strokeWidth="2"
                paintOrder="stroke fill"
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

// ストロークの重なりを防ぐ位置調整を計算
function calculateAdjustedPositions(strokes: any[]): Position[] {
  const positions: Position[] = [];
  const minDistance = 15; // 最小距離（重なり防止）

  strokes.forEach((stroke, index) => {
    const originalX = getStrokeStartX(stroke.path);
    const originalY = getStrokeStartY(stroke.path);

    let bestX = originalX;
    let bestY = originalY;

    // 既存の位置と重なりがないかチェック
    if (positions.length > 0) {
      const candidates = [
        { x: originalX, y: originalY }, // 元の位置
        { x: originalX + 8, y: originalY - 8 }, // 右上
        { x: originalX - 8, y: originalY - 8 }, // 左上
        { x: originalX + 8, y: originalY + 8 }, // 右下
        { x: originalX - 8, y: originalY + 8 }, // 左下
        { x: originalX + 12, y: originalY }, // 右
        { x: originalX - 12, y: originalY }, // 左
        { x: originalX, y: originalY - 12 }, // 上
        { x: originalX, y: originalY + 12 }, // 下
      ];

      // 最も重なりの少ない位置を選択
      let bestScore = Infinity;
      
      candidates.forEach(candidate => {
        let score = 0;
        positions.forEach(existing => {
          const distance = Math.sqrt(
            Math.pow(candidate.x - existing.x, 2) +
            Math.pow(candidate.y - existing.y, 2)
          );
          if (distance < minDistance) {
            score += (minDistance - distance) * 10; // ペナルティ
          }
          score += distance * 0.1; // 元の位置に近いほど良い
        });

        if (score < bestScore) {
          bestScore = score;
          bestX = candidate.x;
          bestY = candidate.y;
        }
      });
    }

    positions.push({ x: bestX, y: bestY });
  });

  return positions;
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
