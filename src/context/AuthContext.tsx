import { createContext, useState } from 'react';

const AuthContext = createContext({});

export interface userInfo {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar: string
}

export interface sessionInfo {
    user: userInfo;
    access_token: string | null;
}

export const AuthProvider = ({ children }: any) => {
    const userInfoJSON = localStorage.getItem('userInfor');
    const user: userInfo = userInfoJSON && JSON.parse(userInfoJSON);
    const access_token = localStorage.getItem('access_token');
    const [auth, setAuth] = useState<sessionInfo>({ user, access_token });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
