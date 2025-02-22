/**
 * Все провайдеры подключаются в этом файле.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { RecoilEnv, RecoilRoot } from 'recoil';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
});

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </RecoilRoot>
    );
};

export default Providers;
