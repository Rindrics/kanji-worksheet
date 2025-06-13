export const APP_CONFIG = {
  SERVICE_NAME: 'なかま漢字ワークシート',
  DESCRIPTION: '同じ部首・同じ部品を持つ漢字の練習プリント',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  PDF_FILENAME_TEMPLATE: (groupName: string) => `${groupName} - ${APP_CONFIG.SERVICE_NAME}`,
} as const;
