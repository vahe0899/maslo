import Typograf from 'typograf';
import { DEFAULT_LOCALE } from './hooks/use-locale';

Typograf.addRule({
    name: 'common/other/aposToQuot',
    handler: function (text) {
        return text.replace(/&apos;/g, "'");
    },
});

const typograf = new Typograf({ locale: ['ru', 'en-US'] });

typograf.enableRule(['common/nbsp/afterNumber']);

// Вложенные кавычки тоже «ёлочки» для русской типографики
typograf.setSetting('common/punctuation/quote', 'ru', { left: '«', right: '»', removeDuplicateQuotes: true });

export const tp = (str: string, locale = DEFAULT_LOCALE) =>
    typograf.execute(str, { locale: locale === 'ru' ? 'ru' : 'en-US' });
