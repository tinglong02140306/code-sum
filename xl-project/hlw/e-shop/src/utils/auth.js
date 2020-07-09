const TOKEN_KEY = "Xlpayment-Token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getItem = key => localStorage.getItem(key);