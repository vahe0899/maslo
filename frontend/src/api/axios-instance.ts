import Axios from 'axios';

Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export const axiosAPI = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_HOST || ''}/api`,
    headers: { 'Cache-Control': 'no-cache' },
});
