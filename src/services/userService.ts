
import { ChatType, IUser} from "../../types"
const baseUrl: string = process.env.NEXT_PUBLIC_ENDPOINT_URL  as string;

export const apiSubmitRegistration: (username: string, password: string) => Promise<Response> = async (username, password) => {
    const endPoint = `${baseUrl}/api/auth/register`
    const getResponse = await fetch(endPoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, password })
    })
    console.log(getResponse)
    return getResponse;
}

export const apiSubmitLogin: (username: string, password: string) => Promise<Response> = async (username, password) => {
    const endPoint = `${baseUrl}/api/auth/login`
    const getResponse = await fetch(endPoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, password })
    })
    return getResponse;
}


export const fetchUserByUsername =
    async (username: string): Promise<IUser | null | undefined> => {
        try {
            const response = await fetch(`${baseUrl}/api/users/username/${username}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            if (!response.ok) {
                throw new Error("User not found")
            }
            const data: { message: string, response: { user: IUser } } | null | undefined = await response.json();
            return data?.response.user;

        }
        catch (error) {
            console.log("Error fetching user:", error);
            return null
        }
    }

    //fetch authenticated user
    export const fetchAuthUser = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/authUser`,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            if (!response.ok) {
                throw new Error("User not found")
            }
            const data: {authUser:IUser|null} = await response.json();
            return data.authUser;

        }
        catch (error) {
            console.log("Error fetching user:", error);
            return null
        }
    }


export const apiAddNewFriend: (user2Id: string) => Promise<ChatType|null> = async (user2Id: string,) => {
    try {
        const response = await fetch(`${baseUrl}/api/chats/createChat`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({ user2Id })
        })
        if (!response.ok) {
            throw new Error("User not found")
        }
        const data: ChatType|null = await response.json();
        return data;

    }
    catch (error) {
        console.log("Error fetching user:", error);
        return null
    }
}
