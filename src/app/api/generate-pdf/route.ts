import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { KanjiWorksheetPDF } from '@/components/pdf/KanjiWorksheetPDF';
import { searchKanjiByRadical, type RadicalType, radicalInfo } from '@/data/kanji';
import { APP_CONFIG } from '@/constants/app';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const radical = searchParams.get('radical') as RadicalType;
    
    if (!radical) {
      return NextResponse.json(
        { error: '部首パラメータが必要です' },
        { status: 400 }
      );
    }

    // 漢字データを取得
    const kanjiList = searchKanjiByRadical(radical);
    
    if (kanjiList.length === 0) {
      return NextResponse.json(
        { error: '指定された部首の漢字が見つかりません' },
        { status: 404 }
      );
    }

    // 部首情報を取得
    const radicalData = radicalInfo.find(r => r.id === radical);
    const title = radicalData ? 
      `${radicalData.description || radical}ワークシート` : 
      `${radical}ワークシート`;

    // PDFを生成
    const pdfStream = await renderToStream(
      React.createElement(KanjiWorksheetPDF, { kanjiList, title, radical })
    );

    // ファイル名を生成（ASCII文字のみ）
    const rawFilename = APP_CONFIG.PDF_FILENAME_TEMPLATE(
      radicalData?.description || radical
    );
    
    // ファイル名をURL エンコード（RFC 5987形式）
    const encodedFilename = encodeURIComponent(rawFilename);

    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);
    
    return new NextResponse(pdfStream as any, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('PDF生成エラー:', error);
    return NextResponse.json(
      { error: 'PDF生成に失敗しました' },
      { status: 500 }
    );
  }
} 