import { Kanji } from '@/types/kanji';

export const mockKanji: Kanji[] = [
  {
    character: "水",
    unicode: "U+6C34",
    strokeCount: 4,
    strokes: [
      { order: 1, path: "M52,25c0.25,2.28-0.52,3.59-1.8,5.62" },
      { order: 2, path: "M54.5,30.25c6.73,7.3,24.09,24.81,32.95,31.91" },
      { order: 3, path: "M37.36,65.16c1.64,0.34,4.04,0.36,4.98,0.25" },
      { order: 4, path: "M23,80.98c2.12,0.52,4.25,0.64,7.01,0.3" }
    ],
    radicals: ["水"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "泳",
    unicode: "U+6CB3",
    strokeCount: 8,
    strokes: [
      { order: 1, path: "M12,25c0.25,1.5,0.5,3.2,0.75,4.8" },
      { order: 2, path: "M15,35c1.2,1.8,2.4,3.6,3.6,5.4" },
      { order: 3, path: "M18,45c0.8,1.2,1.6,2.4,2.4,3.6" },
    ],
    radicals: ["氵", "永"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "海",
    unicode: "U+6D77",
    strokeCount: 9,
    strokes: [
      { order: 1, path: "M12,20c0.3,1.8,0.6,3.6,0.9,5.4" },
      { order: 2, path: "M15,30c1.5,2.1,3.0,4.2,4.5,6.3" },
    ],
    radicals: ["氵", "毎"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "池",
    unicode: "U+6C60",
    strokeCount: 6,
    strokes: [
      { order: 1, path: "M10,22c0.2,1.4,0.4,2.8,0.6,4.2" },
      { order: 2, path: "M13,32c1.0,1.6,2.0,3.2,3.0,4.8" },
    ],
    radicals: ["氵", "也"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "清",
    unicode: "U+6E05",
    strokeCount: 11,
    strokes: [
      { order: 1, path: "M8,18c0.4,2.2,0.8,4.4,1.2,6.6" },
    ],
    radicals: ["氵", "青"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },

  {
    character: "火",
    unicode: "U+706B",
    strokeCount: 4,
    strokes: [
      { order: 1, path: "M50,15c0.3,2.1-0.4,4.2-1.6,6.4" },
      { order: 2, path: "M52.5,25c5.8,6.2,20.1,21.3,28.2,27.2" },
      { order: 3, path: "M35,45c1.4,0.3,3.5,0.4,4.2,0.2" },
      { order: 4, path: "M22,65c1.8,0.4,3.6,0.5,6.0,0.3" }
    ],
    radicals: ["火"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "焼",
    unicode: "U+713C",
    strokeCount: 12,
    strokes: [
      { order: 1, path: "M15,18c0.2,1.8,0.4,3.6,0.6,5.4" },
      { order: 2, path: "M18,28c1.2,1.9,2.4,3.8,3.6,5.7" },
    ],
    radicals: ["灬", "尭"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "燃",
    unicode: "U+71C3",
    strokeCount: 16,
    strokes: [
      { order: 1, path: "M12,15c0.3,2.4,0.6,4.8,0.9,7.2" },
    ],
    radicals: ["灬", "然"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "煮",
    unicode: "U+716E",
    strokeCount: 12,
    strokes: [
      { order: 1, path: "M20,12c0.4,2.2,0.8,4.4,1.2,6.6" },
    ],
    radicals: ["灬", "者"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "照",
    unicode: "U+7167",
    strokeCount: 13,
    strokes: [
      { order: 1, path: "M18,10c0.5,2.6,1.0,5.2,1.5,7.8" },
    ],
    radicals: ["灬", "昭"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  },
  {
    character: "熱",
    unicode: "U+71B1",
    strokeCount: 15,
    strokes: [
      { order: 1, path: "M14,8c0.6,3.0,1.2,6.0,1.8,9.0" },
    ],
    radicals: ["灬", "埶"],
    viewBox: "0 0 109 109",
    source: 'kanjivg'
  }
];

// 部首情報は /src/config/radicals.js で一元管理
