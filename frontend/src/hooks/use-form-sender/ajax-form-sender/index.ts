import { ApiResponse } from '@/types';

type AjaxFormSenderOptions<T> = {
    onBeforeSend: () => void;
    onSuccess: (response: ApiResponse<T>) => any;
    onError: (err: Error) => any;
    onComplete: () => void;
    data: Record<string, any>;
    headers: Record<string, any>;
    shouldClearInputs?: boolean;
    inputSelector: string;
    method: string;
    formData?: boolean;
};

type Send = (url?: string) => Promise<ApiResponse>;

type AppendData = (...data: [string, string | Blob, string?]) => void;

export type AjaxFormSender = {
    send: Send;
    appendData: AppendData;
    clearInputs: () => void;
};

export const clearInputs = (inputs: HTMLInputElement[] = []) => {
    Array.from(inputs).forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type !== 'hidden') {
            input.value = '';
        }
        input.dispatchEvent(new Event('blur'));
    });
};

// const defaultOptions: AjaxFormSenderOptions<Record<string, any>> = {
//     onBeforeSend: () => {},
//     onSuccess: () => {},
//     onError: () => {},
//     onComplete: () => {},
//     data: {},
//     headers: {},
//     shouldClearInputs: true,
//     inputSelector: '[name]:not([type="submit"]):not([type="reset"])',
//     method: 'POST',
// };

const createFormSender = <T>(
    form: HTMLFormElement,
    endpoint: string,
    _options: Partial<AjaxFormSenderOptions<T>>,
): AjaxFormSender => {
    const options: AjaxFormSenderOptions<T> = {
        onBeforeSend: () => {},
        onSuccess: () => {},
        onError: () => {},
        onComplete: () => {},
        data: {},
        headers: {},
        shouldClearInputs: true,
        formData: false,
        inputSelector: '[name]:not([type="submit"]):not([type="reset"])',
        method: 'POST',
        ..._options,
    };
    const method = options.method.toLowerCase();
    const inputs = Array.from(form.querySelectorAll(options.inputSelector)) as HTMLInputElement[];
    let data: FormData | null;
    const preData: Record<string, any> = {};
    const submitBtn = form.querySelector<HTMLInputElement | HTMLButtonElement>(
        'input[type="submit"], button[type="submit"]',
    );

    const appendData: AppendData = (..._data) => {
        const [key, value] = _data;
        preData[key] = value;
    };

    const send: Send = async (url = endpoint) => {
        if (!(url && typeof url === 'string')) {
            throw new Error('Form does not have "action" attibute and url has not been provided');
        }

        options.onBeforeSend();

        if (['post', 'put', 'delete'].includes(method.toLowerCase())) {
            data = new FormData(form);

            if (options.data) {
                Object.entries(options.data).forEach((entry) => {
                    data!.append(...entry);
                });
            }

            Object.entries(preData).forEach((entry) => {
                data!.append(...entry);
            });
        }

        form.classList.add('js-ajax-form--error');
        form.classList.add('js-ajax-form--success');
        form.classList.add('js-ajax-form--loading');

        form.dispatchEvent(new Event('send'));

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        try {
            let response: ApiResponse<T>;

            const dataObj: Record<string, string> = {};

            data!.forEach((value, key) => {
                dataObj[key] = value.toString();
            });

            if (method === 'get') {
                response = await fetch(url, { method }).then((res) => res.json());
            } else {
                response = await fetch(url, {
                    method,
                    body: options.formData ? data : JSON.stringify(dataObj),
                    headers: options.headers,
                }).then((res) => res.json());
            }

            options.onSuccess(response);
            form.dispatchEvent(new CustomEvent('success', { detail: { data: response } }));
            form.classList.add('js-ajax-form--success');
            Array.from(form.querySelectorAll('.app-message')).forEach((messageElement) => {
                messageElement.textContent = '';
            });

            return response;
        } catch (err) {
            if (err instanceof Error) {
                options.onError(err);
                form.dispatchEvent(new CustomEvent('error', { detail: { error: err } }));
            }

            form.classList.add('js-ajax-form--error');

            throw err;
        } finally {
            options.onComplete();
            form.dispatchEvent(new Event('complete'));
            form.classList.remove('js-ajax-form--loading');

            if (submitBtn) {
                submitBtn.disabled = false;
            }

            if (options.shouldClearInputs) {
                clearInputs(inputs);
            }
        }
    };

    return { appendData, send, clearInputs: () => clearInputs(inputs) };
};

export default createFormSender;
