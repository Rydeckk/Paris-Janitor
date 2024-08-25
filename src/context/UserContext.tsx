import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getUser } from '../request/requestUser';
import { UserInfoWithId } from '../types/types';

interface UserContextType {
    user: UserInfoWithId | null;
    setUser: (user: UserInfoWithId | null) => void;
}

interface Props {
    children: ReactNode
}

const defaultContext: UserContextType = {
    user: null,
    setUser: () => {},
}

export const UserContext = createContext<UserContextType>(defaultContext);

export function UserProvider({children}: Props) {
    const [user, setUser] = useState<UserInfoWithId | null>(null)

    useEffect(() => {
        const getUserRequest = async () => {
                const user = await getUser()
                setUser(user)
        }

        getUserRequest()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
