export const getToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const clearToken = (): void => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};
