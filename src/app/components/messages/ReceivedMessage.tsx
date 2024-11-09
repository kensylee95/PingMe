const ReceivedMessage:React.FC<React.PropsWithChildren<{message:React.ReactNode|string}>> = ({message})=>{
    return (
        <div className="flex justify-start w-full">
        <div style={{overflowWrap:"break-word", wordBreak:"break-word"}} className="bg-white text-gray-800 p-4 rounded-[25px] rounded-tl-none max-w-xs">
            <p>{message}</p>
        </div>
    </div>
    )
}
export default ReceivedMessage