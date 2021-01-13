import { createContext } from 'react';

const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    token: '',
    userName: ''
});

export default AuthContext;