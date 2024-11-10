"use client"
import MiniPictureContainer from "./MiniPictureContainer";
import { PropsWithChildren} from "react";
import {MessageType} from "../../../../types";


const EachFriend: React.FC<PropsWithChildren<{username:string, messages:MessageType[], typingStatus?:boolean}>> = ({username, messages, typingStatus=false}) => {
   const lastMessage = messages[-1]||"";
 /* let message: ReactNode = <></>
  {
    switch (lastMessage.status||"") {
      case ("read"):
        message = <div className="flex items-end justify-end"><RiCheckDoubleFill size={20} className="text-green-500" /></div>
        break;
      case ("sent"):
        message = <div className="flex items-end justify-end"><RiCheckFill size={20} className="text-gray-500" /></div>
        break;
      case ("delivered"):
        message = <div className="flex items-end justify-end"><RiCheckDoubleFill size={20} className="text-gray-500" /></div>
        break
      default:
        message = <div className="flex items-end justify-end"><FaClockRotateLeft size={18} className="text-gray-400" /></div>
        break;
    }
  }*/
  return (<div className="flex w-full gap-4 relative cursor-pointer">
    <span className="absolute top-0 right-0 text-xs text-gray-500">{"10:42"}</span>
    <div className="h-10 w-10">
      <MiniPictureContainer isOnline={true} />
    </div>
    <div className="flex gap[1px] flex-col w-full">
      <span className="flex leading-none text-black text-2xl tracking-tight sm:text-md text-bold"><span className="text-gray-400">@</span>{username}</span>
      <span className="text-gray-500 tracking-tight text-sm">{typingStatus?"Is Typing....":lastMessage.content?lastMessage.content:<span className="text-gray-400 italic">Tap to begin chat</span>}</span>
    </div>

  </div>
  )
}
export default EachFriend;