import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';

interface KanjiCardProps {
  kanji: Kanji;
  onClick?: () => void;
}

export function KanjiCard({ kanji, onClick }: KanjiCardProps) {
  return (
    <Card onClick={onClick} className="text-center">
      <div className="text-4xl mb-2">{kanji.character}</div>
      <div className="text-sm text-gray-600">{kanji.strokeCount}画</div>
      <div className="text-xs text-gray-500">{kanji.radicals.join(', ')}</div>
    </Card>
  );
}
