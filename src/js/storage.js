"use strict";

const STORAGE_KEY = "data";

export const getLocalStorageData = () => {
    const STORAGE_LIST = localStorage.getItem(STORAGE_KEY);
    return STORAGE_LIST ? JSON.parse(STORAGE_LIST) : [];
};

export const setLocalStorageData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};