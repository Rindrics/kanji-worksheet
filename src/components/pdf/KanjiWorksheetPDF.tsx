import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Kanji } from '@/types/kanji';
import { type RadicalType } from '@/data/kanji';
import path from 'path';

// 日本語フォント設定 - TTFフォントを使用
const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Regular.ttf');
Font.register({
  family: 'NotoSansJP',
  src: fontPath,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'NotoSansJP',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NotoSansJP',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  kanjiCard: {
    width: 70,
    height: 70,
    border: '1pt solid #333',
    marginBottom: 8,
    marginRight: 8,
  },
  quadrantGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  quadrant: {
    flex: 1,
    border: '0.5pt solid #666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanjiCharacter: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'NotoSansJP',
  },
  kanjiCharacterLight: {
    fontSize: 24,
    color: '#ddd',
    fontFamily: 'NotoSansJP',
  },
  footer: {
    fontSize: 8,
    color: '#666',
    textAlign: 'right',
    marginTop: 20,
    fontFamily: 'NotoSansJP',
  }
});

interface KanjiWorksheetPDFProps {
  kanjiList: Kanji[];
  title: string;
  radical: RadicalType;
}

export function KanjiWorksheetPDF({ kanjiList, title, radical }: KanjiWorksheetPDFProps) {
  // 1ページあたりの漢字数（横向きレイアウト用に調整）
  const kanjiPerPage = 30;
  const pages = Math.ceil(kanjiList.length / kanjiPerPage);

  return (
    <Document>
      {Array.from({ length: pages }, (_, pageIndex) => {
        const startIndex = pageIndex * kanjiPerPage;
        const endIndex = Math.min(startIndex + kanjiPerPage, kanjiList.length);
        const pageKanji = kanjiList.slice(startIndex, endIndex);

        return (
          <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page}>
            {/* ヘッダー */}
            <Text style={styles.header}>
              {title} {pages > 1 ? `(${pageIndex + 1}/${pages})` : ''}
            </Text>

            {/* 漢字グリッド */}
            <View style={styles.grid}>
              {pageKanji.map((kanji, index) => (
                <View key={kanji.unicode} style={styles.kanjiCard}>
                  <View style={styles.quadrantGrid}>
                    {/* 上段 */}
                    <View style={styles.row}>
                      {/* 左上: なぞり書き用 */}
                      <View style={styles.quadrant}>
                        <Text style={styles.kanjiCharacterLight}>
                          {kanji.character}
                        </Text>
                        {/* ガイドライン */}
                        <View style={[styles.guideline, styles.verticalGuideline]} />
                        <View style={[styles.guideline, styles.horizontalGuideline]} />
                      </View>
                      
                      {/* 右上: 空欄 */}
                      <View style={styles.quadrant}>
                        <View style={[styles.guideline, styles.verticalGuideline]} />
                        <View style={[styles.guideline, styles.horizontalGuideline]} />
                      </View>
                    </View>

                    {/* 下段 */}
                    <View style={styles.row}>
                      {/* 左下: なぞり書き用 */}
                      <View style={styles.quadrant}>
                        <Text style={styles.kanjiCharacterLight}>
                          {kanji.character}
                        </Text>
                        <View style={[styles.guideline, styles.verticalGuideline]} />
                        <View style={[styles.guideline, styles.horizontalGuideline]} />
                      </View>
                      
                      {/* 右下: 空欄 */}
                      <View style={styles.quadrant}>
                        <View style={[styles.guideline, styles.verticalGuideline]} />
                        <View style={[styles.guideline, styles.horizontalGuideline]} />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* フッター */}
            <Text style={styles.footer}>
              漢字ワークシート - {new Date().toLocaleDateString('ja-JP')}
            </Text>
          </Page>
        );
      })}
    </Document>
  );
} 