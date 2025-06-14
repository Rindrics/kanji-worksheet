import { Kanji } from '@/types/kanji';

interface StrokeOrderDisplayProps {
  kanji: Kanji;
  className?: string;
}

interface StrokeDirection {
  x: number;
  y: number;
  angle: number;
  length: number;
}

export function StrokeOrderDisplay({ kanji, className = '' }: StrokeOrderDisplayProps) {
  if (!kanji.strokes || kanji.strokes.length === 0) {
    // ストロークデータがない場合は何も表示しない
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* SVGで書き順番号と方向矢印を表示 */}
      <svg
        viewBox={kanji.viewBox}
        className="w-full h-full pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* 書き順番号と方向矢印を描画 */}
        {kanji.strokes.map((stroke) => {
          const x = getStrokeStartX(stroke.path);
          const y = getStrokeStartY(stroke.path);
          const direction = getStrokeDirection(stroke.path);

          return (
            <g key={stroke.order}>
              {/* 書き順番号（黒文字） */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#000"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {stroke.order}
              </text>

              {/* 方向矢印（画の長さに応じた長さ） */}
              {direction && (
                <g transform={`translate(${x + 15}, ${y}) rotate(${direction.angle})`}>
                  <path
                    d={`M${-direction.length/2},0 L${direction.length/2},0 M${direction.length/2},0 L${direction.length/2-3},-2 M${direction.length/2},0 L${direction.length/2-3},2`}
                    stroke="#000"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
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

// SVGパスからストロークの長さを概算する関数
function getStrokeLength(path: string): number {
  // パスから主要な座標を抽出して距離を計算
  const coordinates = [];

  // M (開始点) を抽出
  const startMatch = path.match(/M(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
  if (startMatch) {
    coordinates.push({
      x: parseFloat(startMatch[1]),
      y: parseFloat(startMatch[2])
    });
  }

  // L (直線) コマンドを全て抽出
  const lineMatches = path.matchAll(/L(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g);
  for (const match of lineMatches) {
    coordinates.push({
      x: parseFloat(match[1]),
      y: parseFloat(match[2])
    });
  }

  // C (ベジェ曲線) の終点を抽出
  const curveMatches = path.matchAll(/C[^,]+,[^,]+\s+[^,]+,[^,]+\s+(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g);
  for (const match of curveMatches) {
    coordinates.push({
      x: parseFloat(match[1]),
      y: parseFloat(match[2])
    });
  }

  // 相対座標の処理
  let currentX = coordinates[0]?.x || 0;
  let currentY = coordinates[0]?.y || 0;

  const relLineMatches = path.matchAll(/l(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g);
  for (const match of relLineMatches) {
    currentX += parseFloat(match[1]);
    currentY += parseFloat(match[2]);
    coordinates.push({ x: currentX, y: currentY });
  }

  // 座標間の距離を合計
  let totalLength = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const distance = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
    );
    totalLength += distance;
  }

  // 最小値8、最大値20の範囲で正規化
  const normalizedLength = Math.max(8, Math.min(20, totalLength / 4));
  return normalizedLength;
}

// SVGパスからストロークの方向を抽出する関数
function getStrokeDirection(path: string): StrokeDirection | null {
  // パスの開始点を取得
  const startMatch = path.match(/M(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
  if (!startMatch) return null;

  const startX = parseFloat(startMatch[1]);
  const startY = parseFloat(startMatch[2]);

  // 次の点を取得（直線、曲線、相対座標に対応）
  let nextX: number | null = null;
  let nextY: number | null = null;

  // L (直線) コマンドを探す
  const lineMatch = path.match(/L(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
  if (lineMatch) {
    nextX = parseFloat(lineMatch[1]);
    nextY = parseFloat(lineMatch[2]);
  } else {
    // C (ベジェ曲線) コマンドを探す - 最初の制御点を使用
    const curveMatch = path.match(/C(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/);
    if (curveMatch) {
      nextX = parseFloat(curveMatch[1]);
      nextY = parseFloat(curveMatch[2]);
    } else {
      // l (相対直線) コマンドを探す
      const relLineMatch = path.match(/l(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      if (relLineMatch) {
        nextX = startX + parseFloat(relLineMatch[1]);
        nextY = startY + parseFloat(relLineMatch[2]);
      } else {
        // c (相対ベジェ曲線) コマンドを探す
        const relCurveMatch = path.match(/c(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
        if (relCurveMatch) {
          nextX = startX + parseFloat(relCurveMatch[1]);
          nextY = startY + parseFloat(relCurveMatch[2]);
        }
      }
    }
  }

  if (nextX === null || nextY === null) return null;

  // ベクトルから角度を計算（度単位）
  const deltaX = nextX - startX;
  const deltaY = nextY - startY;
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  // ストロークの長さを計算
  const length = getStrokeLength(path);

  return {
    x: startX,
    y: startY,
    angle: angle,
    length: length
  };
}
