import RadicalRequestForm from '@/components/RadicalRequestForm';
import Link from 'next/link';
import { APP_CONFIG } from '@/constants/app';

export default function RequestRadicalPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            新しいグループの追加リクエスト
          </h1>
          <p className="text-gray-600 mb-4">
            {APP_CONFIG.SERVICE_NAME}に新しい部首グループを追加するリクエストを送信できます
          </p>
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
      </div>
    </main>
  );
}
