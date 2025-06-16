import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';
import zh from './locales/zh.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: ar },
            de: { translation: de },
            en: { translation: en },
            es: { translation: es },
            fr: { translation: fr },
            hi: { translation: hi },
            it: { translation: it },
            ja: { translation: ja },
            ko: { translation: ko },
            nl: { translation: nl },
            pl: { translation: pl },
            pt: { translation: pt },
            ru: { translation: ru },
            uk: { translation: uk },
            zh: { translation: zh },
        },
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false, // React já faz isso
        },
        detection: {
            order: ['navigator', 'htmlTag', 'path', 'subdomain'],
            caches: [], // não cacheia em localStorage ou cookie
        },
    });

export default i18n;
