export interface Kanji {
  character: string;
  unicode: string;
  strokeCount: number;
  strokes: Stroke[];
  radicals: string[];
  viewBox: string;
  source: 'kanjivg';
}

export interface Stroke {
  order: number;
  path: string;
  type?: StrokeType;
}

export type StrokeType = 'horizontal' | 'vertical' | 'left_down' | 'right_down' | 'dot' | 'complex';
