import RadicalRequestForm from '@/components/RadicalRequestForm';
import Footer from '@/components/common/Footer';
import Link from 'next/link';

export default function RequestRadicalPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            部首・部品グループの追加依頼
          </h1>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </header>

        {/* リクエストフォーム */}
        <section className="max-w-4xl mx-auto">
          <RadicalRequestForm />
        </section>

        {/* フッター */}
        <Footer />
      </div>
    </main>
  );
}
