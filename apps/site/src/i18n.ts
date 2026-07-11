/**
 * i18next bootstrap for the gopdf-cli docs site.
 */
import { initI18n, i18nInstance } from '@wsxjs/wsx-i18next';

export const i18n = initI18n({
  fallbackLng: 'en',
  debug: false,
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  ns: ['home', 'common', 'footer', 'commands'],
  defaultNS: 'common',
});

export { i18nInstance };
