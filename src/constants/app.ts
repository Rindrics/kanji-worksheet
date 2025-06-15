export const APP_CONFIG = {
  SERVICE_NAME: 'なかま漢字ワークシート',
  DESCRIPTION: 'テーマが共通する漢字を集めた練習プリントを作れます',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  PDF_FILENAME_TEMPLATE: (groupName: string) => `${groupName} - ${APP_CONFIG.SERVICE_NAME}`,
  GITHUB: {
    OWNER: process.env.GITHUB_OWNER || 'Rindrics',
    REPO: process.env.GITHUB_REPO || 'kanji-worksheet',
    BASE_BRANCH: 'main',
  },
} as const;
