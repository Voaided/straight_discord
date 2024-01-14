'use server'

import Chatroom from "@/components/ChatRoom"
import SideMenu from "@/components/SideMenu"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function App() {
'use server'
const session = await getServerSession(authOptions);

return (
    <>
    <div>
        <div className="h-screen w-screen top-0 left-0 absolute -z-10">
            <img src={session.user.background} className="h-screen w-screen"></img>
        </div>
        
        <div className="m-custom app border-2 border-white flex justify-center items-center left-0 top-0">
            <SideMenu />
            <Chatroom />
        </div>
    </div>
    </>
)

}
