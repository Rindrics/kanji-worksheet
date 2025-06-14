'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RadicalRequestData {
  radicalName: string;
  message: string;
}

export default function RadicalRequestForm() {
  const [formData, setFormData] = useState<RadicalRequestData>({
    radicalName: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitResults, setSubmitResults] = useState<{
    success: string[];
    failed: { name: string; error: string }[];
  }>({ success: [], failed: [] });

  const handleInputChange = (field: keyof RadicalRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 入力文字列を部首名の配列に分割する関数
  const parseRadicalNames = (input: string): string[] => {
    // 区切り文字：読点、全角・半角スペース、カンマ
    const separators = /[、,，\s　・]+/;
    return input
      .split(separators)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setSubmitResults({ success: [], failed: [] });

    try {
      // 空白チェック
      if (!formData.radicalName.trim()) {
        throw new Error('部首・部品名を入力してください');
      }

      // 入力文字列を分割して部首名の配列を取得
      const radicalNames = parseRadicalNames(formData.radicalName);
      
      if (radicalNames.length === 0) {
        throw new Error('有効な部首・部品名を入力してください');
      }

      console.log(`${radicalNames.length}個の部首・部品名が見つかりました:`, radicalNames);

      const results = { success: [] as string[], failed: [] as { name: string; error: string }[] };

      // 各部首名に対して個別にPRを作成
      for (const radicalName of radicalNames) {
        try {
          const requestData = {
            radicalName: radicalName.trim(),
            message: formData.message
          };

          const response = await fetch('/api/create-radical-pr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'エラーが発生しました');
          }

          const result = await response.json();
          results.success.push(radicalName);
          console.log(`PR created for "${radicalName}":`, result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '予期しないエラーが発生しました';
          results.failed.push({ name: radicalName, error: errorMessage });
          console.error(`Failed to create PR for "${radicalName}":`, error);
        }
      }

      setSubmitResults(results);

      // 結果に応じてステータスを設定
      if (results.failed.length === 0) {
        setSubmitStatus('success');
      } else if (results.success.length === 0) {
        // 全て失敗した場合
        setSubmitStatus('error');
        if (results.failed.length === 1) {
          // 単一の失敗の場合は、そのエラーメッセージを表示
          setErrorMessage(results.failed[0].error);
        } else {
          // 複数の失敗の場合は、要約メッセージを表示
          setErrorMessage(`${results.failed.length}個の部首・部品名でエラーが発生しました。詳細は下記をご確認ください。`);
        }
      } else {
        setSubmitStatus('success'); // 一部成功した場合も成功扱い
      }

      // フォームをリセット
      setFormData({ radicalName: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '予期しないエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">リクエスト内容</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 部首・部品名入力 */}
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                    追加してほしい部首・部品名
                </label>
                <input
                  type="text"
                  value={formData.radicalName}
                  onChange={(e) => handleInputChange('radicalName', e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：木、金、食、魚、米、草、竹、石"
                  required
                  maxLength={50}
                />
            </div>

            {/* 一言メッセージ */}
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                    一言メッセージ（任意）
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="個人情報の入力はしないでください"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/200 文字
                </p>
            </div>

            {/* 送信ボタン */}
            <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'リクエストを送信中...' : 'リクエストを送信'}
                </button>
            </div>

            {/* ステータス表示 */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <div className="flex items-start justify-between">
                      <div className="flex-1">
                          <p className="font-medium">
                            {submitResults.failed.length === 0 ? '✅ すべてのリクエストが送信されました！' : '⚠️ 一部のリクエストが送信されました'}
                          </p>
                          {/* 成功した部首名 */}
                          {submitResults.success.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium">成功した部首・部品名：</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {submitResults.success.map((name, index) => (
                                  <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 失敗した部首名 */}
                          {submitResults.failed.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-red-600">失敗した部首・部品名：</p>
                              <div className="mt-1 space-y-1">
                                {submitResults.failed.map((failure, index) => (
                                  <div key={index} className="text-xs">
                                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded mr-2">
                                      {failure.name}
                                    </span>
                                    <span className="text-red-600">{failure.error}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                      <Link
                        href="/"
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                          ホームに戻る
                      </Link>
                  </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <p className="font-medium">❌ エラー</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
              </div>
            )}
        </form>
    </div>
  );
}
