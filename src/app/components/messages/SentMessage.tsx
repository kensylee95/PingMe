const SentMessage:React.FC<React.PropsWithChildren<{message:string}>> = ({message})=>{
    return (
        <div className="flex justify-end w-full">
        <div style={{overflowWrap:"break-word", wordBreak:"break-word"}} className="bg-white text-gray-800 p-4 rounded-[25px] rounded-tr-none max-w-xs">
            <p>{message}</p>
        </div>
    </div>
    )
}
export default SentMessage