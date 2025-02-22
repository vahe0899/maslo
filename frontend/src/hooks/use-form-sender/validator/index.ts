import equals from 'validator/lib/equals';
import isEmail from 'validator/lib/isEmail';
import { isPhone } from '@/utils/validation/phone';
import messages from './messages';
import type { ValidatorOptions } from './types';
import { clearMessages, getLang } from './utils';

const ERROR_CLASS = 'is-error';

export { isEmail, equals };

function isPhoneInput(input: HTMLInputElement) {
    return input.type === 'tel' || input.classList.contains('js-validate--phone');
}

function isEmailInput(input: HTMLInputElement) {
    return input.type === 'email' || input.classList.contains('js-validate--email');
}

function isCheckboxInput(input: HTMLInputElement) {
    return input.type === 'checkbox';
}

function isSelectInput(input: HTMLInputElement) {
    return input.tagName === 'select' || input.classList.contains('js-validate--select');
}

function isAddressInput(input: HTMLInputElement) {
    return input.classList.contains('js-validate--address');
}

function isEmptyInput(input: HTMLInputElement) {
    return input.value.trim().length === 0;
}

export function validateInput(input: HTMLInputElement, container: HTMLElement | Document = document): boolean {
    // Кастомная валидация через регулярное выражение
    if (input.classList.contains('js-validate--custom')) {
        const regExp = input.getAttribute('data-custom-validation') || '.*';
        return new RegExp(regExp, 'i').test(input.value);
    }

    // Валидация электронной почты
    if (isEmailInput(input)) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isEmail(input.value) : true;
    }

    // Валидация телефона
    if (isPhoneInput(input)) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isPhone(input.value) : true;
    }

    // Валидация чекбокса
    if (isCheckboxInput(input)) {
        return input.hasAttribute('required') ? input.checked : true;
    }

    // Валидация селекта
    if (isSelectInput(input)) {
        const options = Array.from(input.querySelectorAll('option'));
        const selectedOptions = options.filter(
            (option) =>
                option.selected &&
                !option.hasAttribute('placeholder') &&
                option.innerText !== input.getAttribute('placeholder'),
        );
        return input.hasAttribute('required') ? !!selectedOptions.length : true;
    }

    if (isAddressInput(input)) {
        const valueStringParts = input.value.split(',').map((part) => part.trim());
        const uniqueStringParts = [...new Set(valueStringParts)];
        const isValueStringPartsUnique = valueStringParts.length === uniqueStringParts.length;

        const regExp = /.+\,?\s+.+\,?\s+.+/;
        return new RegExp(regExp, 'i').test(input.value) && isValueStringPartsUnique;
    }

    // Валидация равенства двух строк
    if (input.classList.contains('js-validate--equivalent')) {
        if (!input.hasAttribute('data-equivalent-name')) {
            return false;
        }
        const fieldName = input.getAttribute('data-equivalent-name');
        const field = container.querySelector<HTMLInputElement>(`[name="${fieldName}"]`);
        return field ? equals(input.value, field.value) : false;
    }

    // Валидация заполненности поля
    if (input.hasAttribute('required') && isEmptyInput(input)) {
        return false;
    }

    // Default
    return true;
}

const DEFAULT_OPTIONS: ValidatorOptions = {
    inputGroupSelector: '.input-group',
    inputSelector:
        'input[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), select[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), textarea[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])',
    messages,
    scrollToInvalidInput: true,
};

const createFormSender = (form: HTMLFormElement, validatorOptions: Partial<ValidatorOptions> = DEFAULT_OPTIONS) => {
    const options: ValidatorOptions = { ...DEFAULT_OPTIONS, ...validatorOptions };
    form.setAttribute('novalidate', 'novalidate');
    const inputGroups = Array.from(form.querySelectorAll<HTMLInputElement>(options.inputGroupSelector));

    function clearInput(inputGroup: HTMLElement) {
        const input = inputGroup.querySelector<HTMLInputElement>(options.inputSelector);

        const messageElement = inputGroup?.querySelector('.app-message');

        if (messageElement) {
            messageElement.textContent = '';
        }

        inputGroup?.classList.remove(ERROR_CLASS);

        if (input?.classList.contains('textarea')) {
            const wrapper = input.closest('.textarea-wrapper');
            wrapper?.classList.remove(ERROR_CLASS);
        }
    }

    function validate() {
        let isFormValid = true;
        const lang = getLang();
        const erroredInputs: HTMLInputElement[] = [];

        clearMessages(form);

        inputGroups.forEach((inputGroup) => {
            const input = inputGroup.querySelector<HTMLInputElement>(options.inputSelector);

            if (input) {
                const isValid = validateInput(input, form);
                const messageElement = inputGroup?.querySelector('.app-message');

                if (isValid) {
                    inputGroup?.classList.remove(ERROR_CLASS);
                } else {
                    isFormValid = false;
                    erroredInputs.push(input);
                    inputGroup?.classList.add(ERROR_CLASS);

                    if (messageElement) {
                        messageElement.textContent = '';

                        switch (true) {
                            case isEmptyInput(input) && input.hasAttribute('required'):
                                messageElement.textContent = options.messages[lang].EMPTY_FIELD;
                                break;
                            case isEmailInput(input):
                                messageElement.textContent = options.messages[lang].INVALIDATED_EMAIL;
                                break;
                            case isPhoneInput(input):
                                messageElement.textContent = options.messages[lang].INVALIDATED_PHONE;
                                break;
                            case isSelectInput(input):
                                messageElement.textContent = options.messages[lang].INVALIDATED_SELECT;
                                break;
                            case input.classList.contains('js-validate--equivalent'):
                                messageElement.textContent = options.messages[lang].INVALIDATED_EQUALS;
                                break;
                            case input.classList.contains('js-validate--address'):
                                messageElement.textContent = options.messages[lang].INVALIDATED_ADDRESS;
                                break;
                            case input.classList.contains('js-validate--custom') &&
                                input.hasAttribute('data-custom-validation-error-message'):
                                messageElement.textContent = input.getAttribute('data-custom-validation-error-message');
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        });

        if (options.scrollToInvalidInput && erroredInputs[0]) {
            erroredInputs[0].scrollIntoView(options.scrollToInvalidInputOptions);
        }

        if (isFormValid) {
            options.onValidationSuccess?.();
        } else {
            options.onValidationError?.();
        }

        options.onValidationComplete?.();

        return isFormValid;
    }

    return { validate, form, inputGroups, clearInput };
};

export default createFormSender;
