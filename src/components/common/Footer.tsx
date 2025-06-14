export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12 print-hide">
      <div className="container mx-auto p-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            漢字の筆順データには{' '}
            <a 
              href="https://kanjivg.tagaini.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              KanjiVG
            </a>{' '}
            を利用しています
          </p>
          <p className="text-xs text-gray-500">
            KanjiVG © Ulrich Apel - 
            <a 
              href="https://creativecommons.org/licenses/by-sa/3.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              CC BY-SA 3.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 
