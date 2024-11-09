import { ChatType } from "../../types";

export const fetchUserChats =
    async (): Promise<ChatType[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api/chats/user`,
                {
                    method: "GET",
                    credentials: "include"
                }
            )
            const chats:ChatType[] = await response.json()
            console.log(chats)
            return chats;
        }
        catch (error) {
            console.log("Error fetching user:", error);
            return []
        }
    }