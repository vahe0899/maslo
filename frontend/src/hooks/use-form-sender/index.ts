import { RefObject, useEffect, useRef, useState } from 'react';
import { DICT } from '@/dict';
import { tp } from '@/typograf';
import { useLocale } from '../use-locale';
import createFormSender, { AjaxFormSender } from './ajax-form-sender';
import createValidator from './validator';

type UseFormSenderParams = {
    ref: RefObject<HTMLFormElement>;
    endpointPath: string;
    shouldClearInputs?: boolean;
    headers?: Record<string, string>;
};

const clearAntispamInput = (form: HTMLFormElement) => {
    const checkInput = form.querySelector<HTMLInputElement>('input[name="check_val"]');
    if (checkInput) {
        checkInput.value = '';
    }
};

export function useFormSender<T>({ ref, endpointPath, shouldClearInputs = true, headers = {} }: UseFormSenderParams) {
    const [data, setData] = useState<T | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const validatorRef = useRef<ReturnType<typeof createValidator> | null>(null);
    const senderRef = useRef<AjaxFormSender | null>(null);
    const locale = useLocale();

    useEffect(() => {
        let hideTimeout: NodeJS.Timeout;
        const form = ref.current;

        if (form) {
            senderRef.current = createFormSender<T>(form, endpointPath, {
                shouldClearInputs,
                method: 'POST',
                headers: {
                    ...headers,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                onBeforeSend: () => {
                    clearAntispamInput(form);
                },
                onSuccess: ({ status, data, errors }) => {
                    if (status === 'success') {
                        if (data) {
                            setData(data);
                        }
                    } else {
                        setError(
                            new Error(
                                Array.isArray(errors)
                                    ? errors.map((error) => error.message).join('<br>')
                                    : tp(DICT.SOMETHING_WENT_WRONG[locale], locale),
                            ),
                        );
                    }
                },
                onError: (err) => {
                    setError(err);
                },
                onComplete: () => {
                    clearTimeout(hideTimeout);
                },
            });
        }

        return () => {
            clearTimeout(hideTimeout);
        };
    }, [ref, endpointPath, shouldClearInputs, locale, headers]);

    useEffect(() => {
        const form = ref.current;

        function onFocus(this: HTMLInputElement) {
            const inputGroup = this.closest<HTMLElement>('.input-group');

            if (inputGroup) {
                validatorRef.current?.clearInput(inputGroup);
            }
        }

        if (form) {
            validatorRef.current = createValidator(form, {
                scrollToInvalidInputOptions: {
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                },
            });

            validatorRef.current.inputGroups.forEach((inputGroup) => {
                const input = inputGroup.querySelector<HTMLInputElement>(
                    'input[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), select[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), textarea[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])',
                );

                input?.addEventListener('focus', onFocus);
            });
        }

        return () => {
            validatorRef.current?.inputGroups.forEach((inputGroup) => {
                const input = inputGroup.querySelector<HTMLInputElement>(
                    'input[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), select[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"]), textarea[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])',
                );

                input?.removeEventListener('focus', onFocus);
            });
        };
    }, [ref]);

    useEffect(() => {
        const form = ref.current;

        async function submitFn(event: Event) {
            if (isSubmitting) return;

            event.preventDefault();
            setError(null);
            const isFormValid = validatorRef.current?.validate();

            if (isFormValid) {
                setIsSubmitting(true);

                try {
                    await senderRef.current?.send();
                } finally {
                    setIsSubmitting(false);
                }
            }
        }

        form?.addEventListener('submit', submitFn);

        return () => {
            form?.removeEventListener('submit', submitFn);
        };
    }, [isSubmitting, ref]);

    return { data, isSubmitting, error };
}
