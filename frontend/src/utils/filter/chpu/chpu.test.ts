import { chpu } from './index';

describe('CHPU', () => {
    describe('parseUrlToParams', () => {
        test('Возвращает пустой объект, если нет ключевого слова в URL', () => {
            expect(chpu.parseUrlToParams('/catalog')).toEqual({});
        });

        test('Возвращает пустой объект, если есть ключевое слово, то не валидный паттерн', () => {
            expect(chpu.parseUrlToParams('/catalog/filter/')).toEqual({});
            expect(chpu.parseUrlToParams('/catalog/filter/nonvalid/stuff')).toEqual({});
        });

        test('is', () => {
            expect(chpu.parseUrlToParams('/filter/section-is-some-name/')).toEqual({
                section: 'some-name',
            });
        });

        test('Range: from-to', () => {
            expect(chpu.parseUrlToParams('/filter/price-from-0-to-100/')).toEqual({
                price: [0, 100],
            });
        });

        test('Range: from', () => {
            expect(chpu.parseUrlToParams('/filter/price-from-100/')).toEqual({
                price: [100, Number.MAX_SAFE_INTEGER],
            });
        });

        test('Range: to', () => {
            expect(chpu.parseUrlToParams('/filter/price-to-1000/')).toEqual({
                price: [Number.MIN_SAFE_INTEGER, 1000],
            });
        });

        test('Несколько фильтров', () => {
            expect(chpu.parseUrlToParams('/filter/price-from-0-to-1000/section-is-some-name/')).toEqual({
                price: [0, 1000],
                section: 'some-name',
            });
        });

        test('Несколько фильтров, потом нонсенс', () => {
            expect(chpu.parseUrlToParams('/filter/price-from-0-to-1000/section-is-some-name/nonsense')).toEqual({
                price: [0, 1000],
                section: 'some-name',
            });
        });
    });

    describe('encodeParamsToUrl', () => {
        expect(chpu.encodeParamsToUrl({})).toEqual('');

        expect(
            chpu.encodeParamsToUrl({
                size: [1, 5],
                price: [200, 1000],
                section: 'some-name',
            }),
        ).toEqual('/filter/size-from-1-to-5/price-from-200-to-1000/section-is-some-name');
    });
});
