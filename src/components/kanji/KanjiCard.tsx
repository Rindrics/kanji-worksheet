import { Kanji } from '@/types/kanji';
import { Card } from '@/components/ui/Card';

interface KanjiCardProps {
  kanji: Kanji;
}

export function KanjiCard({ kanji }: KanjiCardProps) {
  return (
    <Card className="text-center">
      <div className="text-4xl mb-2">{kanji.character}</div>
    </Card>
  );
}
