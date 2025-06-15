import { Kanji } from '@/types/kanji';

interface KanjiSVGDisplayProps {
  kanji: Kanji;
  className?: string;
  variant?: 'normal' | 'light' | 'outline';
  showStrokes?: boolean;
}

// SVGパスから開始点を抽出する関数
function extractStartPoint(pathData: string): { x: number, y: number } {
  // MoveTo (M または m) から開始点を抽出
  const moveMatch = pathData.match(/^[Mm]([\d.-]+)[,\s]+([\d.-]+)/);
  if (!moveMatch) {
    return { x: 50, y: 50 }; // デフォルト
  }

  return {
    x: parseFloat(moveMatch[1]),
    y: parseFloat(moveMatch[2])
  };
}

// ストロークの開始点に小さな濃い点を作成する関数
function createStartPointIndicator(pathData: string): string {
  const startPoint = extractStartPoint(pathData);

  // 開始点から非常に短い線分を作成（方向は元のパスの最初の方向に合わせる）
  const firstCommand = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);

  if (firstCommand && firstCommand.length > 1) {
    const secondCommand = firstCommand[1];
    const commandType = secondCommand[0].toLowerCase();
    const params = secondCommand.slice(1).trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));

    let directionX = 0;
    let directionY = 0;

    // 最初のコマンドから方向を推定
    switch (commandType) {
      case 'c': // キュービックベジェ曲線
        if (params.length >= 2) {
          if (secondCommand[0] === 'C') {
            directionX = params[0] - startPoint.x;
            directionY = params[1] - startPoint.y;
          } else {
            directionX = params[0];
            directionY = params[1];
          }
        }
        break;
      case 'l': // 直線
        if (params.length >= 2) {
          if (secondCommand[0] === 'L') {
            directionX = params[0] - startPoint.x;
            directionY = params[1] - startPoint.y;
          } else {
            directionX = params[0];
            directionY = params[1];
          }
        }
        break;
      case 'h': // 水平線
        if (params.length > 0) {
          directionX = secondCommand[0] === 'H' ? params[0] - startPoint.x : params[0];
          directionY = 0;
        }
        break;
      case 'v': // 垂直線
        if (params.length > 0) {
          directionX = 0;
          directionY = secondCommand[0] === 'V' ? params[0] - startPoint.y : params[0];
        }
        break;
    }

    // 方向ベクトルを正規化して短くする
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    if (length > 0) {
      const shortLength = 3; // 短い線分の長さ
      const normalizedX = (directionX / length) * shortLength;
      const normalizedY = (directionY / length) * shortLength;

      return `M${startPoint.x},${startPoint.y}l${normalizedX},${normalizedY}`;
    }
  }

  // フォールバック: 小さな円形の点
  return `M${startPoint.x - 1.5},${startPoint.y}a1.5,1.5 0 1,0 3,0a1.5,1.5 0 1,0 -3,0`;
}

export function KanjiSVGDisplay({
  kanji,
  className = '',
  variant = 'normal',
  showStrokes = true
}: KanjiSVGDisplayProps) {
  if (!kanji.strokes || kanji.strokes.length === 0) {
    // SVGデータがない場合は通常のテキスト表示にフォールバック
    return (
      <div
        className={`kanji-character ${className}`}
        style={{
          opacity: variant === 'light' ? 0.3 : 1,
          color: variant === 'light' ? '#ddd' : 'inherit'
        }}
      >
        {kanji.character}
      </div>
    );
  }

  // バリアントに応じてスタイルを決定
  const getStrokeProps = (strokeNumber: number) => {
    // 偶数画かどうかを判定
    const isEvenStroke = strokeNumber % 2 === 0;

    switch (variant) {
      case 'light':
        return {
          stroke: isEvenStroke ? "#e5e5e5" : "#d3d3d3",
          strokeWidth: "5",
          opacity: 1.0
        };
      case 'outline':
        return {
          stroke: isEvenStroke ? "#999" : "#666",
          strokeWidth: "2.5",
          fill: "none"
        };
      default:
        return {
          stroke: isEvenStroke ? "#333" : "#333",
          strokeWidth: "4.5",
          fill: "none"
        };
    }
  };

  return (
    <div className={`kanji-svg-container ${className}`}>
      <svg
        viewBox={kanji.viewBox}
        className="w-full h-full"
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 漢字のストロークを描画 */}
        {showStrokes && kanji.strokes.map((stroke, index) => {
          const strokeNumber = index + 1; // 画数は1から始まる
          const strokeProps = getStrokeProps(strokeNumber);
          const isEvenStroke = strokeNumber % 2 === 0;

          return (
            <g key={index}>
              {/* メインストローク */}
              <path
                d={stroke.path}
                stroke={strokeProps.stroke}
                strokeWidth={strokeProps.strokeWidth}
                fill={strokeProps.fill || "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={strokeProps.opacity || 1}
              />

              {/* ストロークの開始点を示す濃い点（lightバリアントのみ） */}
              {variant === 'light' && (
                <path
                  d={createStartPointIndicator(stroke.path)}
                  stroke={isEvenStroke ? "#aaa" : "#777"}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
