import { toFormData } from '@/utils/forms';
import { axiosAPI } from './axios-instance';

export interface FeedbackResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

export const postFeedback = ({ signal, data }: { signal: AbortSignal; data: Record<string, any> }) =>
    axiosAPI.post<FeedbackResponse>('/v1/feedback', toFormData(data), { signal }).then((res) => res.data);
