import MiniPictureContainer from "./MiniPictureContainer"

const ActiveUser: React.FC<React.PropsWithChildren<{isOnline?:boolean, subtitle:string, username:string}>> = ({ isOnline,subtitle, username}) => {
    return (<li className="flex w-full gap-4 relative">
      <MiniPictureContainer/>
      {/*User message*/}
        <div className="flex gap-1 flex-col">
          <span className="flex leading-none text-black text-md">{username}</span>
          <span className="text-gray-500 tracking-tight text-sm">{subtitle}</span>
        </div>
    </li>
    )
  }
  export default ActiveUser