import { timeout } from '@/utils/timeout';

export const leaveInstant = (): Promise<void> => timeout(50).then(() => Promise.resolve());
