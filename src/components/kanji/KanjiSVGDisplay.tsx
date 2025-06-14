import { Kanji } from '@/types/kanji';

interface KanjiSVGDisplayProps {
  kanji: Kanji;
  className?: string;
  variant?: 'normal' | 'light' | 'outline';
  showStrokes?: boolean;
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
  const getStrokeProps = () => {
    switch (variant) {
      case 'light':
        return {
          stroke: "#d5d5d5",
          strokeWidth: "5",
          opacity: 1.0
        };
      case 'outline':
        return {
          stroke: "#666",
          strokeWidth: "2.5",
          fill: "none"
        };
      default:
        return {
          stroke: "#333",
          strokeWidth: "4.5",
          fill: "none"
        };
    }
  };

  const strokeProps = getStrokeProps();

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
        {showStrokes && kanji.strokes.map((stroke, index) => (
          <path
            key={index}
            d={stroke.path}
            stroke={strokeProps.stroke}
            strokeWidth={strokeProps.strokeWidth}
            fill={strokeProps.fill || "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={strokeProps.opacity || 1}
          />
        ))}
      </svg>
    </div>
  );
} 
