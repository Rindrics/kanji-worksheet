#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 設定
const KANJIVG_URL = 'https://github.com/KanjiVG/kanjivg/archive/refs/heads/master.zip';
const CACHE_DIR = path.join(__dirname, 'kanjivg-cache');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated-kanji.ts');

// 部首設定をTypeScriptファイルから読み込み
function loadRadicalConfig() {
  const configPath = path.join(__dirname, '../src/config/radicals.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  // TypeScriptファイルから radicalSearchPatterns を抽出（より堅牢な方法）
  const patternsMatch = configContent.match(/radicalSearchPatterns\s*=\s*({[\s\S]*?})\s*as const;/);

  if (!patternsMatch) {
    throw new Error('radicalSearchPatterns not found in config file');
  }

  // コメントを除去してJavaScript形式に変換
  let patternsStr = patternsMatch[1];

  // 行コメント（//）を除去
  patternsStr = patternsStr.replace(/\/\/.*$/gm, '');

  // シングルクォートをダブルクォートに変換
  patternsStr = patternsStr.replace(/'/g, '"');

  // 末尾のカンマを除去（JSONでは無効）
  patternsStr = patternsStr.replace(/,(\s*})/g, '$1');

  let patterns;
  try {
    patterns = JSON.parse(patternsStr);
    console.log('📋 Loaded radical patterns from TypeScript:', patterns);
  } catch (error) {
    console.error('❌ Failed to parse radical patterns:', error.message);
    console.error('📄 Patterns content:', patternsStr);
    throw error;
  }

  // radicalInfo配列も抽出
  const radicalInfoMatch = configContent.match(/radicalInfo:\s*RadicalInfo\[\]\s*=\s*(\[[\s\S]*?\]);/);

  if (!radicalInfoMatch) {
    throw new Error('radicalInfo not found in config file');
  }

  let radicalInfoStr = radicalInfoMatch[1];

  // 行コメント（//）を除去
  radicalInfoStr = radicalInfoStr.replace(/\/\/.*$/gm, '');

  // シングルクォートをダブルクォートに変換
  radicalInfoStr = radicalInfoStr.replace(/'/g, '"');

  // TypeScript特有の型キャストを除去
  radicalInfoStr = radicalInfoStr.replace(/as RadicalType/g, '');

  // プロパティ名をクォートする（JSON形式に変換）
  radicalInfoStr = radicalInfoStr.replace(/(\w+):/g, '"$1":');

  // variants プロパティの値を実際の配列に置換（patternsが既に読み込まれているので使用可能）
  // 動的にすべての部首に対して置換を実行
  for (const [radicalKey, radicalVariants] of Object.entries(patterns)) {
    const pattern = new RegExp(`"variants":\\s*radicalSearchPatterns\\["${radicalKey}"\\]`, 'g');
    radicalInfoStr = radicalInfoStr.replace(pattern, `"variants": ${JSON.stringify(radicalVariants)}`);
  }

  // 末尾のカンマを除去（JSONでは無効）
  radicalInfoStr = radicalInfoStr.replace(/,(\s*[\]}])/g, '$1');

  let radicalInfo;
  try {
    radicalInfo = JSON.parse(radicalInfoStr);
    console.log('📋 Loaded radical info from TypeScript:', radicalInfo);
  } catch (error) {
    console.error('❌ Failed to parse radical info:', error.message);
    console.error('📄 RadicalInfo content:', radicalInfoStr);
    throw error;
  }

  return { patterns, radicalInfo };
}

// 般若心経の漢字データを読み込み
function loadHannyashingyoKanji() {
  const hannyashingyoPath = path.join(__dirname, '../src/data/hannyashingyo.ts');
  const hannyashingyoContent = fs.readFileSync(hannyashingyoPath, 'utf-8');

  // HANNYASHINGYO_TEXTを抽出
  const textMatch = hannyashingyoContent.match(/HANNYASHINGYO_TEXT\s*=\s*`([\s\S]*?)`/);

  if (!textMatch) {
    console.warn('⚠️ HANNYASHINGYO_TEXT not found, skipping');
    return [];
  }

  const text = textMatch[1].trim();

  // 漢字のみを抽出（ひらがな・カタカナ・数字・記号を除外）
  const kanjiMatches = text.match(/[\u4e00-\u9faf]/g) || [];

  // 重複を除去してユニークな漢字のセットを作成
  const uniqueKanji = [...new Set(kanjiMatches)];

  console.log(`📿 Loaded ${uniqueKanji.length} unique kanji from Hannyashingyo`);

  return uniqueKanji;
}

const { patterns: TARGET_RADICALS, radicalInfo: RADICAL_INFO } = loadRadicalConfig();
const HANNYASHINGYO_KANJI = loadHannyashingyoKanji();

async function downloadKanjiVG() {
  console.log('📥 Downloading KanjiVG data...');

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const zipPath = path.join(CACHE_DIR, 'kanjivg-master.zip');

  // 既存ファイルを削除
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // ダウンロード
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);

    const request = https.get(KANJIVG_URL, (response) => {
      // リダイレクトを処理
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`📍 Redirecting to: ${redirectUrl}`);

        https.get(redirectUrl, (redirectResponse) => {
          if (redirectResponse.statusCode !== 200) {
            reject(new Error(`Failed to download: ${redirectResponse.statusCode}`));
            return;
          }

          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('✅ Download complete');
            resolve();
          });
        }).on('error', reject);

        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('✅ Download complete');
        resolve();
      });
    });

    request.on('error', reject);
    file.on('error', reject);
  });

  // ファイルサイズを確認
  const stats = fs.statSync(zipPath);
  console.log(`📊 Downloaded file size: ${Math.round(stats.size / 1024)} KB`);

  if (stats.size < 1000) {
    throw new Error('Downloaded file is too small, likely corrupted');
  }

  // 解凍
  console.log('📦 Extracting files...');
  try {
    execSync(`cd ${CACHE_DIR} && unzip -o kanjivg-master.zip`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Extraction failed. Trying alternative method...');
    throw new Error('Extraction failed. Please install unzip or check the downloaded file.');
  }
}

function parseKanjiVG() {
  console.log('🔄 Parsing KanjiVG data...');

  const kanjiDir = path.join(CACHE_DIR, 'kanjivg-master', 'kanji');

  if (!fs.existsSync(kanjiDir)) {
    throw new Error(`Kanji directory not found: ${kanjiDir}`);
  }

  const kanjiData = [];

  // SVGファイルを読み込み
  const files = fs.readdirSync(kanjiDir).filter(f => f.endsWith('.svg') && !f.includes('-'));
  console.log(`📂 Found ${files.length} SVG files`);

  let processedCount = 0;

  for (const file of files) {
    try {
      const unicode = path.basename(file, '.svg');

      // Unicodeが5桁の16進数でない場合はスキップ
      if (!/^[0-9a-f]{5}$/i.test(unicode)) continue;

      const character = String.fromCharCode(parseInt(unicode, 16));

      // 制御文字や特殊文字をスキップ
      if (character.charCodeAt(0) < 0x4E00 || character.charCodeAt(0) > 0x9FFF) continue;

      const svgContent = fs.readFileSync(path.join(kanjiDir, file), 'utf-8');

      // SVGから部首情報を抽出
      const radicals = extractRadicalsFromSVG(svgContent, character);

      // 対象部首に含まれる漢字のみを処理
      if (!isTargetKanji(character, radicals)) continue;

      const parsed = parseSVG(svgContent, character, unicode);

      if (parsed) {
        parsed.radicals = radicals; // 抽出した部首情報を設定
        kanjiData.push(parsed);
        processedCount++;

        // 進捗表示
        if (processedCount % 10 === 0) {
          console.log(`📝 Processed ${processedCount} target kanji...`);
        }
      }
    } catch (error) {
      // エラーは無視して続行
    }
  }

  console.log(`✅ Parsed ${kanjiData.length} kanji characters`);
  return kanjiData;
}

function extractRadicalsFromSVG(svgContent, character) {
  const radicals = [];

  // SVGのkvg:element属性から部首情報を抽出
  const elementMatches = svgContent.match(/kvg:element="([^"]+)"/g);
  if (elementMatches) {
    for (const match of elementMatches) {
      const element = match.match(/kvg:element="([^"]+)"/)[1];
      // 部首として認識されるものをフィルタ
      if (element.length === 1 && /[\u4e00-\u9fff]/.test(element)) {
        if (!radicals.includes(element)) {
          radicals.push(element);
        }
      }
    }
  }

  // フォールバック：文字自体から部首を推定
  for (const [radical, variants] of Object.entries(TARGET_RADICALS)) {
    for (const variant of variants) {
      if (character.includes(variant) || svgContent.includes(variant)) {
        if (!radicals.includes(radical)) {
          radicals.push(radical);
        }
      }
    }
  }

  return radicals.length > 0 ? radicals : [character]; // 部首が見つからない場合は文字自体を返す
}

function isTargetKanji(character, radicals) {
  // まず除外文字をチェック
  for (const radicalInfo of RADICAL_INFO) {
    if (radicalInfo.excludeCharacter && radicalInfo.excludeCharacter.includes(character)) {
      console.log(`🚫 Excluding character: ${character} (matched excludeCharacter)`);
      return false;
    }
  }

  // 般若心経の漢字かチェック
  if (HANNYASHINGYO_KANJI.includes(character)) {
    return true;
  }

  // 抽出された部首が対象部首のいずれかに含まれるかチェック
  for (const [radical, variants] of Object.entries(TARGET_RADICALS)) {
    for (const variant of variants) {
      if (radicals.includes(variant) || radicals.includes(radical)) {
        return true;
      }
    }
  }

  // 文字自体が部首バリエーションに含まれるかチェック
  for (const [radical, variants] of Object.entries(TARGET_RADICALS)) {
    if (variants.includes(character)) {
      return true;
    }
  }

  return false;
}

function parseSVG(svgContent, character, unicode) {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 109 109';

  // stroke要素を抽出
  const strokes = [];
  const strokeRegex = /<path[^>]+kvg:type="stroke"[^>]*d="([^"]+)"[^>]*>/g;
  let match;
  let order = 1;

  while ((match = strokeRegex.exec(svgContent)) !== null) {
    strokes.push({
      order,
      path: match[1],
      type: inferStrokeType(match[1])
    });
    order++;
  }

  // ストロークが見つからない場合は一般的なpath要素を探す
  if (strokes.length === 0) {
    const generalPathRegex = /<path[^>]+d="([^"]+)"[^>]*>/g;
    let generalMatch;
    let generalOrder = 1;

    while ((generalMatch = generalPathRegex.exec(svgContent)) !== null) {
      strokes.push({
        order: generalOrder,
        path: generalMatch[1],
        type: inferStrokeType(generalMatch[1])
      });
      generalOrder++;
    }
  }

  return {
    character,
    unicode: `U+${unicode.toUpperCase()}`,
    strokeCount: strokes.length,
    strokes,
    radicals: [], // 後で設定される
    viewBox,
    source: 'kanjivg'
  };
}

function inferStrokeType(pathData) {
  // パスデータから画の種類を推定（簡易版）
  if (pathData.includes('H') || pathData.includes('h')) return 'horizontal';
  if (pathData.includes('V') || pathData.includes('v')) return 'vertical';
  if (pathData.includes('C') || pathData.includes('c')) return 'complex';
  return 'complex';
}

function generateTypeScriptFile(kanjiData) {
  console.log('📝 Generating TypeScript file...');

  console.log(`📊 Total characters: ${kanjiData.length}`);

  const content = `// このファイルは自動生成されます。手動で編集しないでください。
// Generated from KanjiVG data at ${new Date().toISOString()}
// Total: ${kanjiData.length} characters
//
// KanjiVG © Ulrich Apel
// Licensed under Creative Commons Attribution-Share Alike 3.0
// https://creativecommons.org/licenses/by-sa/3.0/

import { Kanji } from '@/types/kanji';

export const generatedKanji: Kanji[] = ${JSON.stringify(kanjiData, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, content);
  console.log(`✅ Generated ${OUTPUT_FILE}`);
}

async function main() {
  try {
    await downloadKanjiVG();
    const kanjiData = parseKanjiVG();

    if (kanjiData.length === 0) {
      console.warn('⚠️ No kanji data was extracted. Check the radical matching logic.');
    }

    generateTypeScriptFile(kanjiData);
    console.log('🎉 Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.log('💡 Tip: Make sure you have unzip installed and internet connection is stable');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
