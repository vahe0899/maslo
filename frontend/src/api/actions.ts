import { useQuery } from '@tanstack/react-query';
import { DEFAULT_LOCALE } from '@/hooks/use-locale';
import { ApiResponse, ImageShape } from '@/types';
import { axiosAPI } from './axios-instance';

export type ApiActionsRequest = Partial<{
    limit: number;
    page: number;
}>;

type Params = {
    params?: ApiActionsRequest;
    locale?: string;
    signal?: AbortSignal;
};

export type ApiActionsResponse = ApiResponse<{
    //
}>;

export type AppActionsResponse = ApiResponse<{
    //
}>;

const transformApiResponse = (response: ApiActionsResponse): AppActionsResponse => ({
    ...response,
    //
});

export const getActions = ({ params = {}, locale = DEFAULT_LOCALE }: Params): Promise<AppActionsResponse> =>
    axiosAPI
        .get<ApiActionsResponse>('/v1/actions', { params, headers: { 'App-Locale': locale } })
        .then((res) => transformApiResponse(res.data));

export const useActionsQuery = (data: Params, initialData?: AppActionsResponse) =>
    useQuery({
        queryKey: ['actions', data],
        queryFn: () => getActions(data),
        initialData,
        placeholderData: (prev) => prev,
    });
