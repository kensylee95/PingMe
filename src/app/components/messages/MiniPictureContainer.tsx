"use-client"
import { FaUser } from "react-icons/fa"

const MiniPictureContainer: React.FC<{ isOnline?: boolean }> = ({ isOnline }) => {
    return (
        <div className="relative flex bg-gray-100 text-gray-400 justify-center items-center h-10 w-10 rounded-full">
            <FaUser />
            {/*Online green dot*/}
            {isOnline == true ? <div className="absolute bottom-0 right-0 bg-white rounded-full bg-green-50 p-[2px]">
                <div className="bg-green-500 min-w-2 min-h-2  rounded-full" /></div>
                : isOnline == false ? <div className="absolute bottom-0 right-0 bg-white rounded-full bg-green-50 p-[2px]">
                    <div className="bg-red-500 min-w-2 min-h-2  rounded-full" />
                </div>
                    : null
            }
        </div>
    )
}
export default MiniPictureContainer