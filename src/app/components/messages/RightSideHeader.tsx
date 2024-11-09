import { getActiveChatParticipant } from "@/app/utils/getParticipant"
import { ChatType,partChild, status} from "../../../../types"
import ActiveUser from "./ActiveUser"

const RightSideHeader:React.FC<{isTyping:status[], authId :string|undefined, isOnline: status[],activeChat:ChatType}> = ({authId,  activeChat, isOnline, isTyping})=>{
   
    //get id of partiipant that is not the current auth
    const notAuthParticipant:partChild|undefined = getActiveChatParticipant(authId!, activeChat.participants)
    
    //find the key of the typingStatus array of user friends that matches the participant Id
    const typingData:status|undefined =  isTyping.find((item)=>{
        return Object.keys(item).some((key)=>key===notAuthParticipant!._id);
    });
     //find the key of the onlineStatus array of user friends that matches the participant Id
    const onlineData:status|undefined =  isOnline.find((item)=>{
        return Object.keys(item).some((key)=>key===notAuthParticipant!._id);
    });

     console.log(onlineData)
    const subtitle = (typingData&&typingData[notAuthParticipant!._id!])?"User is typing...":onlineData&&onlineData[notAuthParticipant!._id!]?"Online":"Offline"
    const participant:partChild|undefined = activeChat.participants.find((item)=>item._id!=authId);
    return(
        <div className="flex items-center p-4 w-full  shadow-gray-200 shadow h-16 bg-white rounded-t-lg">
            <ActiveUser subtitle={subtitle} username={participant?.username||""}/>
        </div>
    )
}
export default RightSideHeader