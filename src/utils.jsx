import countries from "i18n-iso-countries";
import en from 'i18n-iso-countries/langs/en.json';

import pt from 'i18n-iso-countries/langs/pt.json';
import es from 'i18n-iso-countries/langs/es.json';
import fr from 'i18n-iso-countries/langs/fr.json';
import de from 'i18n-iso-countries/langs/de.json';
import it from 'i18n-iso-countries/langs/it.json';
import ja from 'i18n-iso-countries/langs/ja.json';
import zh from 'i18n-iso-countries/langs/zh.json';
import cs from 'i18n-iso-countries/langs/cs.json';
import pl from 'i18n-iso-countries/langs/pl.json';


export const allLocales = {
    en,
    pt,
    es,
    fr,
    de,
    it,
    ja,
    zh,
    cs,
    pl
};

/**
 * Carrega e gera uma lista de opções de países com base em um array de idiomas.
 * Tenta cada idioma em ordem e usa 'en' como fallback final.
 * @param {string[]} langs - Um array de códigos de idioma (ex: ['pt-BR', 'pt']).
 * @returns {Promise<Array<{label: string, value: string}>>}
 */
export function getCountryOptions(langs) {
    let localeData = null;
    let effectiveLang = null;

    const languagesToTry = Array.isArray(langs) ? langs : [];

    for (const lang of languagesToTry) {
        const langVariations = lang.includes('-') ? [lang, lang.split('-')[0]] : [lang];

        for (const variation of langVariations) {
            // 3. A verificação agora é uma simples consulta de objeto!
            if (allLocales[variation]) {
                localeData = allLocales[variation];
                effectiveLang = variation;
                break;
            }
        }
        if (localeData) break;
    }

    if (!localeData) {
        effectiveLang = 'en';
        localeData = allLocales['en'];
    }

    if (!localeData) {
        console.error("Locale 'en' não encontrado no mapa de locales estático.");
        return [];
    }

    countries.registerLocale(localeData);
    const names = countries.getNames(effectiveLang, { select: "official" });

    return Object.entries(names).map(([code, name]) => ({
        label: name,
        value: code,
    }));
}