"use client"
import { MessageContent } from "@/app/components/messages/MessageContent";
import UserProfile from "@/app/components/messages/Profile";
import RightSideHeader from "@/app/components/messages/RightSideHeader";
import { ChatType, IUser, MessageType, partChild, status, } from "../../../../types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { debounce } from "lodash";
import { FaUser } from "react-icons/fa6";
import { apiAddNewFriend, fetchAuthUser, fetchUserByUsername } from "@/services/userService";
import { fetchUserChats } from "@/services/chatService";
import { BsEnvelopeExclamation } from "react-icons/bs";
import EachFriend from "@/app/components/messages/EachFriend";

//Events
const senderTyping = "typing";
const receiverTyping = "userTyping";
const joinChat = "joinChat";
const sendMessageEvent = "sendMessage"
const receiveMessage = "receiveMessage";

import io, { Socket } from "socket.io-client";
import React from "react";
import { setTimeout } from "timers";
import { IoSendOutline } from "react-icons/io5";
import { RiMailSendLine } from "react-icons/ri";
import { getActiveChatParticipant } from "@/app/utils/getParticipant";
import { scrollToPageBottom } from "@/app/utils/scrollToBottom";



const ChatPage = () => {

    const [typingStatus, setTypingStatus] = useState<status[]>([]); //array containing typing state of recipient
    const [onlineStatus, setOnlineStatus] = useState<status[]>([]); //array contining online status of friends
    const [toggleSearch, setToggleSearch] = useState<boolean>(false) //Toggled state of the search bar coponents default false
    const [activeChatId, setActiveChatId] = useState<string | undefined>(""); //Id of the current active chat
    const [authUser, setAuthUser] = useState<IUser | null | undefined>(null); //authenticated user record
    const [searchFriend, setSearchedFriend] = useState<IUser | null | undefined>(null)//friend that matched search
    const [chats, setChats] = useState<ChatType[]>([]) //List of all user chats
    const [content, setContent] = useState("")// Adjust the URL as necessary
    const [isLoading, setIsloading] = useState<boolean>(false) //UI Loading state
    const messageBody = useRef<HTMLDivElement|null>(null) // message content
    const mounted = useRef<Boolean>(false) // variabled that holds the state if component has mounted or not
    const socket = useRef<Socket|null>(null) // variable that holds the SocketIO Connection
    const timeout = useRef<NodeJS.Timeout | null>(null); // variable holds the timeout id of setTimeout
    const activeChat: ChatType = chats.find((chat) => chat._id === activeChatId)!;

    //Fetches auth user and chats
    const fetchchats = (authUser:IUser|null) => {
        //setLoading indicator
        setIsloading(true)
        fetchUserChats()
            .then(async (res) => {
                //set auth user
                setAuthUser(authUser)
                //current socket listener
               socket.current = io(
                process.env.NEXT_PUBLIC_ENDPOINT_URL || "",
                {withCredentials:true}
            )
               //transform list in other to set typing status
                if (res.length) { 
                    //initialize status list
                    let statusList:status[] = [];
                    for (const chat of res) {
                        //set already initialized status list to contain the transformed list
                         statusList = chat.participants.map((participant)=>{
                            const partId:string = participant._id
                      if(authUser?._id&&participant._id!=authUser._id){
                            const status:status = {[partId]:false}
                            return status;
                        }
                        return undefined
                        }).filter(num=>num !== undefined) //filter out undefined values
                        
                    } 
                    //set up listiners for socket events    
                    subscribeSockets()
                    const activeId: string = res[0]._id!;
                    //set user chats
                    setChats(res)
                    //get and set typing status for all chats
                    setTypingStatus(statusList)
                    //set inital active chat
                    setActiveChatId(activeId)
                   
                  messageBody.current && scrollToPageBottom(messageBody.current)
                    
                }
            }).finally(()=>setIsloading(false))
    }

    //Fetch user records on mount
    useEffect(() => {
        if(mounted.current==false){
        fetchAuthUser().then(
            (res)=>{
                //fetch chats
                fetchchats(res)
            })
        }
    // Cleanup when the component unmounts or when socket changes
    return () => {
        socket.current && socket.current.off('userOnline', handleFriendOnline);
        socket.current && socket.current.off('userOffline', handleFriendOffline);
        socket.current && socket.current.off(receiveMessage, handleReceivedMessage);
        socket.current && socket.current.off(receiverTyping, handleUserTyping);
    };
    }, [])
    
    //subscribe to sockets on mount
    const subscribeSockets = ()=>{
        if(socket.current){
        socket.current.on("onlineFriends", (data:string[])=>{
          const onlineFriends:status[] = data.map((userId)=>({[userId]:true}));
          console.log(onlineFriends)
          setOnlineStatus(onlineFriends)
        })
       socket.current.on("userOnline", handleFriendOnline);
        socket.current.on('userOffline', handleFriendOffline);
        socket.current.on(receiveMessage, handleReceivedMessage);
        socket.current.on(receiverTyping, handleUserTyping );
        }
    }

    //tell friends that i'm online if active id changes
    useEffect(() => {
        if (mounted && activeChatId) {
            socket.current && socket.current.emit(joinChat, activeChatId);
        }
        socket.current && authUser?._id && socket.current.emit("userOnline", authUser._id);
    }, [activeChatId]);
    //if chats changes or active chat Id changes
    useEffect(() => {
        // Scroll to bottom after chats are fetched or active chat changes
        if (messageBody.current) {
            scrollToPageBottom(messageBody.current);
        }
    }, [chats, activeChatId]);
    
    //handles the event recieved from server when recipient sends a message
    const handleReceivedMessage = (data: { chatId: string, message: MessageType }) => {
        const { message, chatId } = data;
    
        // Avoid adding duplicate messages
        if (chats.find(chat => chat._id === chatId && chat.messages.includes(message))) {
            return; // Don't add the message again if it's already there
        }
    
        // Update the chats state immutably
        setChats((prevChats) => {
            return prevChats.map((chat) => {
                if (chat._id === chatId) {
                    // Create a new chat object with the new message added
                    return {
                        ...chat,
                        messages: [...chat.messages, message], // Immutable update of the messages array
                    };
                }
                return chat;
            });
        });
    
        // Scroll to the bottom of the message body
        if (messageBody.current) {
            scrollToPageBottom(messageBody.current);
        }
    };
    
    //handle when recipient is typing
    const handleUserTyping = (data: { chatId: string, userId: string }) => {
        const { userId } = data;
    
        // Set typing status as true for the user
        setTypingStatus((prevState) => {
            const updated = prevState.filter(status => !status[userId]==false); // Remove any old status for this user
            updated.push({ [userId]: true });
            return updated;
        });
          // Use a ref for the timeout ID so that it persists across renders
        if (timeout.current) {
            clearTimeout(timeout.current); // Clear any previous timeout
        }
        // Create a new timeout to reset typing status after a delay
        timeout.current = setTimeout(() => {
            setTypingStatus((prevState) => {
                return prevState.filter(status => !status[userId]); // Remove typing status after timeout
            });
        }, 2000); // Adjust the timeout delay as needed
    };
    

    //send message to recipient
    const sendMessage = () => {
        if (content.trim()) {
            const participant:partChild|undefined = getActiveChatParticipant(authUser!._id!, activeChat.participants)
            const senderId: string = participant!._id;
            const chatId: string = activeChat._id!;
            const messageData:{chatId:string, senderId:string, content:string} = {chatId, senderId, content}
            socket.current && socket.current.emit(sendMessageEvent, messageData);
            messageBody.current && scrollToPageBottom(messageBody.current)
            setContent("");
        }
    };

    //search regitered friends
    const searchFriends = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== searchFriend?.username) {
            const user = await fetchUserByUsername(e.target.value);
            setSearchedFriend(user);
        }
    }, 500);


    //Function that handles the click event when you add a searched friend
    const addFriend: (userId: string | undefined) => Promise<void> = async (userId) => {
        try {
            if (userId) {
                const response:ChatType|null = await apiAddNewFriend(userId);
                response && setChats((prev)=>([response, ...prev,]))
                response && setActiveChatId(response._id)
                setSearchedFriend(null)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    

    //handles user typing event
    const handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        const data:{chatId:string, userId: string} = {chatId:activeChatId!, userId:authUser!._id!}
        socket.current && socket.current.emit(senderTyping, data);
        setContent(e.target.value)
    };
    
    //handles event sent by Server when recipient is typing
    const handleFriendOnline = (userId: string) => {
        console.log(`${userId} is online`);
    
        // Check if the user is already marked as online
        setOnlineStatus((prevState) => {
  
            // Check if the user is already in the online status array
           const isUserAlreadyOnline = prevState.some(status => status[userId] === true);
            if (isUserAlreadyOnline==false) {
                console.log({[userId]: true })
                const updated = [...prevState, { [userId]: true }];
                return updated;
            }
            return prevState;  // Return the previous state if no change
        });
    };
    
    //handles event sent by Server when recipient is offline
    const handleFriendOffline = (userId: string) => {
    
        // Check if the user is already marked as offline
        setOnlineStatus((prevState) => {
            // Check if the user is already in the online status array
           const isUserAlreadyOnline = prevState.some(status => status[userId] === true);
            if (isUserAlreadyOnline==true) {
                
            
        console.log(`${userId} is offline`);
                const updated = [...prevState, { [userId]: false }];
                console.log(updated)
                return updated;
            }
            return prevState;  // Return the previous state if no change
        });
    };
    

  return  !isLoading && (
        <div className="relative bg-gray-200 w-screen h-screen overflow-hidden">
            <div className="h-full h-full flex gap-2 flex sm:p-2">
                {/*Left side Wrapper*/}
                <div className="flex flex-col min-h-full bg-white rounded-lg w-full xs:w-2/12 sm:w-5/12 md:w-3/12 overflow-hidden pb-4">

                    {/*Profile*/}
                    <div className="relative flex flex-col sm:h-[20]">
                        <div className="flex items-center w-full h-full">
                            <UserProfile header={authUser?.username.toUpperCase()||""} subtitle="User Account" isOnline={false} searchButtonClicked={() => { setToggleSearch((toggle) => !toggle) }} />
                        </div>


                        {/*Search Bar*/}
                        {toggleSearch && <div className="flex h-12 rounded-lg border-2 border-gray-300 mx-4 mt-4 mb-2">
                            <input onChange={searchFriends} className="w-full h-full rounded-lg text-black focus:outline-none p-4" placeholder="Search Users" />
                        </div>
                        }
                        {searchFriend && toggleSearch && <div onClick={() => addFriend(searchFriend?._id)} className="flex h-[55px] rounded-sm items-center absolute sm:top-[24vh] top-[20vh] z-[999] inset-x-4 bg-gray-200">
                            <div className="flex justify-center text-md items-center text-center h-full w-5/6 text-gray-700 gap-4"><FaUser size={22} className="text-gray-500 " /><span className="text-2xl font-bold tracking-normal leading-none">{searchFriend.username}</span></div>
                            <button className="flex justify-center items-center w-1/6 h-full bg-blue-500 text-white rounded-r-sm"><FaPlus /></button>
                        </div>}
                    </div>


                    {/* Left-Side Messages*/}
                    <div className="relative flex flex-col mt-4 gap-4 sm:h-[75vh] h-[80vh] overflow-auto">
                        <span className="sticky bg-white py-1 top-0 text-gray-400 px-4 z-50 w-full">Messages</span>
                        {chats ?
                            <ul className="flex flex-col w-full h-full gap-6 px-4">
                                {chats.map((chat)=>{
                                const participant:partChild|undefined = chat.participants.find(item=>item._id != authUser!._id)
                                   return <li key={chat._id} onClick={() => setActiveChatId(chat._id)}>
                                    <EachFriend  username={participant!.username} messages={chat.messages} /></li>
                                })}
                            </ul>
                            : (<div className="flex flex-col justify-center items-center gap-4 text-black/90 leading-none tracking-normal text-xl mx-4 text-center pt-10">
                                <BsEnvelopeExclamation size={50} className="text-orange-500" />
                                <span>Oops! No friend yet!</span>
                            </div>)}


                    </div>
                </div>
                {/*--------------------------------------------------------------------------------------------------------*/}

                {/*Right side*/}
                {activeChatId ? <div className="min-h-full bg-black/10 bg-[url('/assets/images/background/1.jpeg')] bg-blend-multiply rounded-lg flex flex-col justify-between sm:flex hidden flex-grow overflow-hidden">
                    {/*Header*/}
                    {<RightSideHeader authId={authUser?._id}  isTyping={typingStatus} isOnline={onlineStatus} activeChat={activeChat!} />}
                    {/*Message*/}
                    <div ref={messageBody} className="flex flex-col justify-between flex-grow overflow-y-auto">
                        {/*Message body*/}
                        {chats.length >= 1 && <MessageContent chat={activeChat} authId={authUser!._id} />}
                    </div>
                    {/*Message input box*/}
                    <div className="flex gap-6 items-center h-[60px] mb-4 mx-4 rounded-full bg-white">
                        <div className="p-4 rounded-full bg-gray-100"><RiMailSendLine size={24} className="text-red-500" /></div>
                        <input value={content} onChange={(e) => handleTyping(e)} placeholder="Start Typing a message...." className="h-full w-full rounded-lg p-4 text-md focus:outline-none text-black" />
                        <button onClick={() => content.trim() && sendMessage()} className="bg-green-500 flex  rounded-r-lg items-center justify-center text-white gap-1 px-4 text-md h-full"><IoSendOutline size={24} /></button>
                    </div>
                </div>
                    :

                    <div className="min-h-full bg-black/10 justify-center items-center bg-[url('/assets/images/background/1.jpeg')] bg-blend-multiply rounded-lg sm:flex hidden flex-grow overflow-hidden">
                        <div className="flex h-72 w-1/2 justify-center items-center rounded-lg shadow-2xl bg-gray-200 font-semiBold text-gray-500 text-2xl"> You Have No Friends Yet!</div>
                    </div>}
            </div>
        </div>
    )
}
export default ChatPage;