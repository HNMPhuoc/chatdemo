export const saveToken = (token) => {
    const parts = token.split('.');
    if (parts.length === 3) {
        localStorage.setItem('token.p1', parts[0]);
        localStorage.setItem('token.p2', parts[1]);
        localStorage.setItem('token.p3', parts[2]);
    } else {
        console.error('Token không hợp lệ');
    }
};

export const getToken = () => {
    const p1 = localStorage.getItem('token.p1');
    const p2 = localStorage.getItem('token.p2');
    const p3 = localStorage.getItem('token.p3');
    if (p1 && p2 && p3) {
        return `${p1}.${p2}.${p3}`;
    }
    return null;
};

export const clearToken = () => {
    ['p1', 'p2', 'p3'].forEach(p => localStorage.removeItem(`token.${p}`));
};