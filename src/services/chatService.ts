import { ChatType } from "../../types";

export const fetchUserChats =
    async (): Promise<ChatType[]> => {
        const baseUrl: string = process.env.NEXT_PUBLIC_ENDPOINT_URL ||"https://pingme-backend-eg6q.onrender.com";

        try {
            const response = await fetch(`${baseUrl}/api/chats/user`,
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