import { ReactNode } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Cursor type
 */

type CursorType = 'default' | 'close' | 'link';

const cursorTypeState = atom<CursorType>({
    key: 'cursorTypeState',
    default: 'default',
});

export const useCursorTypeStateValue = () => useRecoilValue(cursorTypeState);
export const useSetCursorTypeState = () => useSetRecoilState(cursorTypeState);

/**
 * Cursor content
 */

const cursorContentState = atom<ReactNode>({
    key: 'cursorContentState',
    default: null,
});

export const useCursorContentStateValue = () => useRecoilValue(cursorContentState);
export const useSetCursorContentState = () => useSetRecoilState(cursorContentState);
