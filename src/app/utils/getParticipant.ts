import { ChatType, partChild } from "../../../types"

export const getActiveChatParticipant:(authId:string, participant:ChatType["participants"])=>undefined|partChild=(authId, participant)=>{
     const partUser:partChild|undefined = participant.find(item=>item._id!=authId);
     return partUser;
}