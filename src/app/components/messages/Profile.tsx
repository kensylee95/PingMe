"use client"
import { FaPlus} from "react-icons/fa";
import MiniPictureContainer from "./MiniPictureContainer";

interface ProfileInterface {
    isOnline: boolean;
    header: string;
    subtitle: string;
    searchButtonClicked?:()=>void;
}
const UserProfile: React.FC<React.PropsWithChildren<ProfileInterface>> = ({ isOnline, header, subtitle, searchButtonClicked }) => {
    return (<div className="flex shadow h-16 gap-10 px-4 rounded-t-lg items-center justify-between w-full">
        {/*Picture*/}
        {<MiniPictureContainer isOnline={isOnline} />}
        {/*Name*/}
        <div className="flex flex-grow flex-col">
            <h1 className="text-black/70 text-md tracking-tight">{header}</h1>
            <span className="text-gray-400">{subtitle}</span>
        </div>
        {searchButtonClicked &&<div onClick={searchButtonClicked} className="flex text-gray-300 items-center justify-center h-10 w-10"><FaPlus size={24}/></div>}
    </div>
    )
}
export default UserProfile;