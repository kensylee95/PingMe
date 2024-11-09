"use client"
import { ChatType } from "../../../../types";
import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";

export const MessageContent: React.FC<React.PropsWithChildren<{ chat: ChatType, authId:string|undefined }>> = ({ chat, authId }) => {
    return (
        <div className="w-full flex-col gap-4 justify-end pb-4 px-4 py-4 flex flex-grow flex-wrap">
            {/*Recieved Message*/}
            {chat.messages.map((message, index) => {
                return message.sender != authId ?
                    <SentMessage key={index} message={message.content} />
                    : <ReceivedMessage key={index} message={message.content} />
            })}

        </div>
    )
}