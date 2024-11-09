"use client"
import { IUser } from "../../../../types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";


interface UserContextType{
    user:IUser;
    setUser:Dispatch<SetStateAction<IUser>>
}

const UserContext = createContext<UserContextType| undefined>(undefined);

interface UserProviderProps{
    children:ReactNode;
}

export const UserProvider:React.FC<UserProviderProps> = ({children})=>{
    const [user, setUser] = useState<IUser>({username:"", password:""});
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
export function useUser():UserContextType{
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}