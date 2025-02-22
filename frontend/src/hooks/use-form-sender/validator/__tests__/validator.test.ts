import { isPhone } from '@/utils/validation/phone';
import { isEmail } from '../index';

describe('Номер телефона', () => {
    it('Не принимает пустую строку', () => {
        expect(isPhone('')).toBe(false);
    });

    it('Не принимает буквы', () => {
        expect(isPhone('+799s9999999')).toBe(false);
    });

    it('Принимает спецсимволы [()s-]', () => {
        expect(isPhone('+7 (999) 111-22-33')).toBe(true);
    });

    // TODO: должен ли принимать без плюса в начале?
    it.skip('Принимает номер без плюса в начале', () => {
        expect(isPhone('7 (999) 111-22-33')).toBe(true);
    });

    it('Считает валидной длину номера телефона от 5 до 10 символов', () => {
        expect(isPhone('+7 (999) 111-22-33-4567')).toBe(false);
        expect(isPhone('+79991112233')).toBe(true);
    });
});

describe('Email', () => {
    it('Принимает почту только с доменной зоной', () => {
        expect(isEmail('example@domain')).toBe(false);
        expect(isEmail('example@domain.com')).toBe(true);
    });
});
