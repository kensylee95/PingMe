"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "../../../../types";
import { apiSubmitRegistration } from "@/services/userService";


const CenteredTextField = () => {

  const [user, setUser ] = useState<IUser>({username:"", password:""})
  const router = useRouter();
  const submitForm: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    try {
      e.preventDefault()
      if (user.username && user.password) {
        const username = user.username
        const password = user.password.trim()
        const response:Response = await apiSubmitRegistration(username, password)
        router.push("/chat/inner")
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-blend-darken bg-[url('/assets/images/background/4.jpeg')]">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Enter Username</h1>
        <p className="text-center text-gray-600 mb-6">
          Share your username to begin chatting
        </p>
        <input
          type="text"
          placeholder="Type your username..."
          onChange={(e) => setUser((prev: IUser) => ({ ...prev, username: e.target.value }))}
          className="w-full text-black p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 shadow-sm transition duration-200"
        />
        <input
          type="text"
          placeholder="Enter Password"
          onChange={(e) => setUser((prev: IUser) => ({ ...prev, password: e.target.value }))}
          className="w-full text-black p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 shadow-sm transition duration-200"
        />
        <button type='button' onClick={submitForm} className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-200">
          Start Chatting
        </button>
      </div>
    </div>
  );
};

export default CenteredTextField;
