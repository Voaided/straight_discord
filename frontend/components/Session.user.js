'use server'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Sessiondetails( ) {
    'use server'
    const session = await getServerSession(authOptions);

    return session;
}