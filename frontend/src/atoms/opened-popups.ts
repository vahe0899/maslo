import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { addUniqueItemToArray } from '@/utils/arrays/add-unique-item-to-array';

const openedPopupsState = atom<string[]>({
    key: 'openedPopupsState',
    default: [],
});

export const useOpenedPopupsValue = () => useRecoilValue(openedPopupsState);

export const useSetOpenedPopupsState = () => {
    const setOpenedPopups = useSetRecoilState(openedPopupsState);

    const openPopup = useCallback(
        (name: string) => setOpenedPopups((prevOpenedPopups) => addUniqueItemToArray(prevOpenedPopups, name)),
        [setOpenedPopups],
    );

    const closePopup = useCallback(
        (name: string) =>
            setOpenedPopups((prevOpenedPopups) => prevOpenedPopups.filter((popupName) => popupName !== name)),
        [setOpenedPopups],
    );

    return { setOpenedPopups, openPopup, closePopup };
};
