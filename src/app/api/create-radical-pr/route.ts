import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '@/constants/app';

interface RadicalRequestData {
  radicalName: string;
  message: string;
}

// GitHub認証のセットアップ（GitHub App優先、Personal Access Token代替）
async function createGitHubClient() {
  // GitHub App認証を優先
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;

  if (appId && privateKey && installationId) {
    try {
      return await createGitHubAppClient(appId, privateKey, installationId);
    } catch (error) {
      console.error('GitHub App認証に失敗、Personal Access Tokenにフォールバック:', error);
    }
  }

  // Personal Access Tokenにフォールバック
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    console.log('Personal Access Token認証を使用');
    return new Octokit({ auth: token });
  }

  throw new Error('GitHub認証に必要な環境変数が設定されていません。GitHub App認証 (GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_ID) またはPersonal Access Token (GITHUB_TOKEN) のいずれかを設定してください。');
}

// GitHub App認証の実装
async function createGitHubAppClient(appId: string, privateKey: string, installationId: string) {
  // 秘密鍵の改行文字を正しく処理
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  // JWT生成
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // 過去60秒から有効（時刻のずれを考慮）
    exp: now + (10 * 60), // 10分後に期限切れ
    iss: appId,
  };

  const jwtToken = jwt.sign(payload, formattedPrivateKey, { algorithm: 'RS256' });

  // GitHub Appクライアントを作成（JWT使用）
  const appOctokit = new Octokit({
    auth: jwtToken,
  });

  // Installation Access Tokenを取得
  const { data: installationToken } = await appOctokit.rest.apps.createInstallationAccessToken({
    installation_id: parseInt(installationId, 10),
  });

  // Installation Access Tokenを使用してクライアントを作成
  return new Octokit({
    auth: installationToken.token,
  });
}

// 既存の部首設定ファイルを読み取って新しい部首を追加
async function updateRadicalConfig(octokit: any, radicalName: string) {
  const filePath = 'src/config/radicals.ts';

  // メインブランチから既存ファイルを取得
  const { data: existingFile } = await octokit.rest.repos.getContent({
    owner: APP_CONFIG.GITHUB.OWNER,
    repo: APP_CONFIG.GITHUB.REPO,
    path: filePath,
    ref: APP_CONFIG.GITHUB.BASE_BRANCH,
  });

  const existingContent = Buffer.from(existingFile.content, 'base64').toString('utf-8');

  // 新しい部首を追加する処理
  const newContent = addRadicalToConfig(existingContent, radicalName);

  return {
    path: filePath,
    content: newContent,
    sha: existingFile.sha
  };
}

// 既存設定ファイルに新しい部首を追加
function addRadicalToConfig(existingContent: string, radicalName: string): string {
  // 1. radicalSearchPatterns に追加
  const searchPatternsRegex = /(export const radicalSearchPatterns = \{[\s\S]*?)(\} as const;)/;
  const newSearchPattern = `  '${radicalName}': ['${radicalName}'], // ${radicalName}へん\n`;

  let updatedContent = existingContent.replace(searchPatternsRegex, (match, p1, p2) => {
    return p1 + newSearchPattern + p2;
  });

  // 2. radicalInfo 配列に追加
  const radicalInfoRegex = /(export const radicalInfo: RadicalInfo\[\] = \[[\s\S]*?)(\];)/;
  const newRadicalInfo = `  {
    id: '${radicalName}' as RadicalType,
    name: '${radicalName}へん',
    description: '${radicalName}に関係する漢字',
    variants: radicalSearchPatterns['${radicalName}'],
  },
`;

  updatedContent = updatedContent.replace(radicalInfoRegex, (match, p1, p2) => {
    return p1 + newRadicalInfo + p2;
  });

  return updatedContent;
}

// PRのタイトルと説明を生成
function generatePRContent(radicalName: string, userMessage: string) {
  const title = `Add group "${radicalName}"`;

  const description = `## 概要
「${radicalName}」部首グループの追加リクエストです。

## 変更内容
- \`src/config/radicals.ts\` の \`radicalSearchPatterns\` に「${radicalName}」を追加
- \`radicalInfo\` 配列に部首情報を追加

## ユーザーからのメッセージ
${userMessage || '（メッセージなし）'}

## レビュー時の確認事項
- 部首の表記が正しいか
- 関連漢字の検索パターンが適切か
- 除外設定が必要かどうか

---
*このPRは自動生成されました*
`;

  return { title, description };
}

export async function POST(request: NextRequest) {
  try {
    const body: RadicalRequestData = await request.json();
    const { radicalName, message } = body;

    // バリデーション
    if (!radicalName?.trim()) {
      return NextResponse.json(
        { error: '部首・部品名は必須です' },
        { status: 400 }
      );
    }

    const cleanRadicalName = radicalName.trim();
    const octokit = await createGitHubClient();

    // 1. ブランチ名を生成
    const branchName = `add-radical-${cleanRadicalName}-${Date.now()}`;

    // 2. メインブランチから新しいブランチを作成
    const { data: mainBranch } = await octokit.rest.repos.getBranch({
      owner: APP_CONFIG.GITHUB.OWNER,
      repo: APP_CONFIG.GITHUB.REPO,
      branch: APP_CONFIG.GITHUB.BASE_BRANCH,
    });

    await octokit.rest.git.createRef({
      owner: APP_CONFIG.GITHUB.OWNER,
      repo: APP_CONFIG.GITHUB.REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    });

    // 3. 既存の設定ファイルを更新
    const configUpdate = await updateRadicalConfig(octokit, cleanRadicalName);

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: APP_CONFIG.GITHUB.OWNER,
      repo: APP_CONFIG.GITHUB.REPO,
      path: configUpdate.path,
      message: `feat: add ${cleanRadicalName} radical to configuration`,
      content: Buffer.from(configUpdate.content).toString('base64'),
      sha: configUpdate.sha,
      branch: branchName,
    });

    // 4. PRを作成
    const { title, description } = generatePRContent(cleanRadicalName, message);

    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner: APP_CONFIG.GITHUB.OWNER,
      repo: APP_CONFIG.GITHUB.REPO,
      title,
      body: description,
      head: branchName,
      base: APP_CONFIG.GITHUB.BASE_BRANCH,
    });

    const result = {
      success: true,
      radicalName: cleanRadicalName,
      message: message || '',
      prUrl: pullRequest.html_url,
      prNumber: pullRequest.number,
      branchName,
      timestamp: new Date().toISOString(),
    };

    console.log('GitHub PR created:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating PR:', error);

    let errorMessage = 'PR作成に失敗しました';
    if (error instanceof Error) {
      if (error.message.includes('GitHub App認証')) {
        errorMessage = 'GitHub App認証の設定に問題があります';
      } else if (error.message.includes('Not Found')) {
        errorMessage = 'リポジトリが見つかりません';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'GitHub APIの制限に達しました。しばらく時間をおいてから再試行してください';
      } else if (error.message.includes('invalid private key') || error.message.includes('PEM')) {
        errorMessage = 'GitHub Appの秘密鍵の形式が正しくありません';
      } else if (error.message.includes('installation')) {
        errorMessage = 'GitHub AppのInstallation IDが正しくありません';
      } else {
        errorMessage = `エラー: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
