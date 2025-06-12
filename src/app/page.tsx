'use client';

import { useState } from 'react';
import { KanjiCard } from '@/components/kanji/KanjiCard';
import { mockWaterKanji } from '@/data/mock-kanji';

export default function HomePage() {
  const [selectedKanji, setSelectedKanji] = useState(mockWaterKanji);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        漢字練習プリントサービス
      </h1>

      <div className="mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setSelectedKanji(mockWaterKanji)}
        >
          水編
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {selectedKanji.map(kanji => (
          <KanjiCard
            key={kanji.unicode}
            kanji={kanji}
            onClick={() => console.log('Selected:', kanji.character)}
          />
        ))}
      </div>
    </main>
  );
}
